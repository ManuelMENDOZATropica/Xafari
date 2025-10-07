import { useCallback, useEffect, useRef } from "react";

const BACKGROUND_SRC = "/sounds/forest.mp3";
const CLICK_SRC = "/sounds/click_3.ogg";
const INTERACTIVE_SELECTOR =
  "button, [role=\"button\"], a[href], input[type=\"button\"], input[type=\"submit\"], input[type=\"reset\"]";

export default function useSoundController(soundSetting) {
  const backgroundAudioRef = useRef(null);
  const audioContextRef = useRef(null);
  const clickBufferRef = useRef(null);
  const clickGainRef = useRef(null);
  const fallbackClickRef = useRef(null);
  const soundSettingRef = useRef(soundSetting);
  const audioReadyRef = useRef(false);
  const hasWarnedVibrationRef = useRef(false);

  const applyModeToAudio = useCallback((mode) => {
    const background = backgroundAudioRef.current;
    if (background) {
      if (mode === "full") {
        background.muted = false;
        background.volume = 1;
      } else if (mode === "medium") {
        background.muted = false;
        background.volume = 0.3;
      } else {
        background.muted = true;
        background.volume = 0;
      }
    }

    if (clickGainRef.current) {
      if (mode === "full") {
        clickGainRef.current.gain.value = 1;
      } else if (mode === "medium") {
        clickGainRef.current.gain.value = 0.4;
      } else {
        clickGainRef.current.gain.value = 0;
      }
    }

    if (fallbackClickRef.current) {
      if (mode === "full") {
        fallbackClickRef.current.muted = false;
        fallbackClickRef.current.volume = 1;
      } else if (mode === "medium") {
        fallbackClickRef.current.muted = false;
        fallbackClickRef.current.volume = 0.4;
      } else {
        fallbackClickRef.current.muted = true;
        fallbackClickRef.current.volume = 0;
      }
    }
  }, []);

  const ensureAudioEnabled = useCallback(async () => {
    const background = backgroundAudioRef.current;
    if (!background) {
      return false;
    }

    try {
      if (
        audioContextRef.current &&
        audioContextRef.current.state === "suspended"
      ) {
        await audioContextRef.current.resume();
      }
    } catch (error) {
      console.warn("[sound] Unable to resume audio context.", error);
    }

    if (!audioReadyRef.current || background.paused) {
      try {
        await background.play();
        audioReadyRef.current = true;
        applyModeToAudio(soundSettingRef.current);
        return true;
      } catch (error) {
        if (error?.name !== "AbortError") {
          console.warn("[sound] Background playback blocked.", error);
        }
        return false;
      }
    }

    return true;
  }, [applyModeToAudio]);

  const triggerClickFeedback = useCallback(
    (overrideMode) => {
      const mode = overrideMode || soundSettingRef.current;

      if (mode === "off") {
        return;
      }

      if (mode === "vibrate") {
        if (
          typeof navigator !== "undefined" &&
          typeof navigator.vibrate === "function"
        ) {
          navigator.vibrate(20);
        } else if (!hasWarnedVibrationRef.current) {
          hasWarnedVibrationRef.current = true;
          console.warn(
            "[sound] Vibration API not supported; skipping vibration feedback."
          );
        }
        return;
      }

      ensureAudioEnabled();

      if (
        audioContextRef.current &&
        clickBufferRef.current &&
        clickGainRef.current
      ) {
        try {
          const source = audioContextRef.current.createBufferSource();
          source.buffer = clickBufferRef.current;
          source.connect(clickGainRef.current);
          source.start();
        } catch (error) {
          console.warn("[sound] Unable to play click buffer.", error);
        }
        return;
      }

      if (fallbackClickRef.current) {
        try {
          fallbackClickRef.current.currentTime = 0;
          fallbackClickRef.current.play();
        } catch (error) {
          console.warn("[sound] Unable to play click fallback.", error);
        }
      }
    },
    [ensureAudioEnabled]
  );

  useEffect(() => {
    soundSettingRef.current = soundSetting;
    applyModeToAudio(soundSetting);

    if (audioReadyRef.current) {
      ensureAudioEnabled();
    }
  }, [soundSetting, applyModeToAudio, ensureAudioEnabled]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

    const background = new Audio(BACKGROUND_SRC);
    background.loop = true;
    background.preload = "auto";
    background.muted = true;
    background.volume = 0;
    background.playsInline = true;
    backgroundAudioRef.current = background;

    const AudioContextClass = window.AudioContext || window.webkitAudioContext;

    let cancelled = false;

    if (AudioContextClass) {
      const context = new AudioContextClass();
      audioContextRef.current = context;

      try {
        context.suspend();
      } catch (error) {
        console.warn("[sound] Unable to suspend audio context.", error);
      }

      const gain = context.createGain();
      gain.gain.value = 0;
      gain.connect(context.destination);
      clickGainRef.current = gain;

      fetch(CLICK_SRC)
        .then((response) => {
          if (!response.ok) {
            throw new Error(`HTTP ${response.status}`);
          }
          return response.arrayBuffer();
        })
        .then((data) => context.decodeAudioData(data))
        .then((buffer) => {
          if (!cancelled) {
            clickBufferRef.current = buffer;
          }
        })
        .catch((error) => {
          console.warn("[sound] Failed to load click buffer.", error);
        });
    } else {
      const fallback = new Audio(CLICK_SRC);
      fallback.preload = "auto";
      fallback.muted = true;
      fallback.volume = 0;
      fallback.playsInline = true;
      fallbackClickRef.current = fallback;
    }

    applyModeToAudio(soundSettingRef.current);

    return () => {
      cancelled = true;
      if (backgroundAudioRef.current) {
        backgroundAudioRef.current.pause();
        backgroundAudioRef.current.src = "";
        backgroundAudioRef.current = null;
      }

      if (audioContextRef.current) {
        try {
          audioContextRef.current.close();
        } catch (error) {
          console.warn("[sound] Unable to close audio context.", error);
        }
        audioContextRef.current = null;
      }

      clickBufferRef.current = null;
      clickGainRef.current = null;
      fallbackClickRef.current = null;
    };
  }, [applyModeToAudio]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

    let pointerListenersActive = true;

    const handlePointerGesture = () => {
      ensureAudioEnabled().then((enabled) => {
        if (enabled && pointerListenersActive) {
          pointerListenersActive = false;
          window.removeEventListener("pointerdown", handlePointerGesture);
          window.removeEventListener("touchstart", handlePointerGesture);
          window.removeEventListener("keydown", handlePointerGesture);
        }
      });
    };

    const handleInteractiveClick = (event) => {
      const target = event.target.closest(INTERACTIVE_SELECTOR);
      if (!target) {
        return;
      }

      if (target.closest("[data-skip-sound-click=\"true\"]")) {
        return;
      }

      if (target.disabled || target.getAttribute("aria-disabled") === "true") {
        return;
      }

      triggerClickFeedback();
    };

    window.addEventListener("pointerdown", handlePointerGesture, {
      passive: true,
    });
    window.addEventListener("touchstart", handlePointerGesture, {
      passive: true,
    });
    window.addEventListener("keydown", handlePointerGesture);
    document.addEventListener("click", handleInteractiveClick, true);

    return () => {
      pointerListenersActive = false;
      window.removeEventListener("pointerdown", handlePointerGesture);
      window.removeEventListener("touchstart", handlePointerGesture);
      window.removeEventListener("keydown", handlePointerGesture);
      document.removeEventListener("click", handleInteractiveClick, true);
    };
  }, [ensureAudioEnabled, triggerClickFeedback]);

  return { triggerClickFeedback };
}
