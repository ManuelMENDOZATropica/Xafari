import { useEffect, useRef, useState } from "react";
import jsQR from "jsqr";

const FPS = 8; // ~8 lecturas por segundo: suficiente para QR y deja respirar al hilo principal
const MAX_WIDTH = 320; // se decodifica a 320 px de ancho como máximo

/**
 * Cámara trasera + lectura de QR con jsQR.
 * - `active`: enciende/apaga la cámara (se apaga siempre al desmontar).
 * - `paused`: deja la cámara encendida pero no decodifica.
 * - `onDecode(text)`: se llama con el texto del QR; si devuelve true, se pausa la lectura
 *   hasta que el componente vuelva a poner `paused` en false.
 * Devuelve {videoRef, error, ready}.
 */
export default function useQrScanner({ active = true, paused = false, onDecode }) {
  const videoRef = useRef(null);
  const streamRef = useRef(null);
  const onDecodeRef = useRef(onDecode);
  const [error, setError] = useState(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    onDecodeRef.current = onDecode;
  }, [onDecode]);

  // Cámara
  useEffect(() => {
    if (!active) return undefined;
    let cancelled = false;
    let attachedVideo = null;
    setError(null);
    (async () => {
      try {
        if (!navigator.mediaDevices?.getUserMedia) throw new Error("camera_unsupported");
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "environment", width: { ideal: 640 }, height: { ideal: 480 } },
          audio: false,
        });
        if (cancelled) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }
        streamRef.current = stream;
        const video = videoRef.current;
        attachedVideo = video;
        if (video) {
          video.srcObject = stream;
          await video.play().catch(() => {});
        }
        setReady(true);
      } catch (err) {
        if (!cancelled) setError(err?.name || err?.message || "camera_error");
      }
    })();
    return () => {
      cancelled = true;
      setReady(false);
      streamRef.current?.getTracks().forEach((t) => t.stop());
      streamRef.current = null;
      if (attachedVideo) attachedVideo.srcObject = null;
    };
  }, [active]);

  // Lectura a ~8 fps sobre un canvas reducido
  useEffect(() => {
    if (!active || paused || !ready) return undefined;
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    let timer = null;
    let stopped = false;

    const tick = () => {
      if (stopped) return;
      const video = videoRef.current;
      if (video && video.readyState >= video.HAVE_CURRENT_DATA && video.videoWidth) {
        const scale = Math.min(1, MAX_WIDTH / video.videoWidth);
        const w = Math.round(video.videoWidth * scale);
        const h = Math.round(video.videoHeight * scale);
        if (canvas.width !== w) canvas.width = w;
        if (canvas.height !== h) canvas.height = h;
        ctx.drawImage(video, 0, 0, w, h);
        const img = ctx.getImageData(0, 0, w, h);
        const code = jsQR(img.data, w, h, { inversionAttempts: "dontInvert" });
        if (code?.data && onDecodeRef.current?.(code.data.trim()) === true) return; // pausa
      }
      timer = setTimeout(tick, 1000 / FPS);
    };
    timer = setTimeout(tick, 1000 / FPS);
    return () => {
      stopped = true;
      clearTimeout(timer);
    };
  }, [active, paused, ready]);

  return { videoRef, error, ready };
}
