import { useCallback, useEffect, useRef } from "react";

const BACKGROUND_SRC = "/sounds/forest.mp3";
const INTERACTIVE_SELECTOR =
  "button, [role=\"button\"], a[href], input[type=\"button\"], input[type=\"submit\"], input[type=\"reset\"]";
const SOUND_EFFECTS = {
  // MP3: Safari/iOS no decodifica .ogg
  interface: { src: "/sounds/click_3.mp3" },
  wardrobe: { src: "/sounds/click_2.mp3" },
  success: { src: "/sounds/chimes.mp3" },
  failure: { src: "/sounds/negative_sound.mp3" },
};
const AUDIBLE_MODES = new Set(["full", "medium"]);
const VIBRATION_DURATION = 30;
const MUSIC_VOLUME = { full: 1, medium: 0.3 };
const EFFECT_VOLUME = { full: 1, medium: 0.4 };

export default function useSoundController(soundSetting, musicEnabled = true) {
  const backgroundAudioRef = useRef(null);
  const audioContextRef = useRef(null);
  const effectBuffersRef = useRef({});
  const effectGainRef = useRef(null);
  const musicGainRef = useRef(null); // en iOS `audio.volume` es de solo lectura: el volumen va por GainNode
  const fallbackEffectsRef = useRef({});
  const attemptBackgroundPlaybackRef = useRef(null);
  const soundSettingRef = useRef(soundSetting);
  const musicEnabledRef = useRef(musicEnabled);
  const hasWarnedVibrationRef = useRef(false);
  const gestureListenersActiveRef = useRef(false);

  const applyModeToAudio = useCallback((mode, music) => {
    const musicOn = music !== undefined ? music : musicEnabledRef.current;
    const musicVolume = musicOn ? MUSIC_VOLUME[mode] || 0 : 0;
    const effectVolume = EFFECT_VOLUME[mode] || 0;
    const background = backgroundAudioRef.current;
    if (background) {
      if (musicGainRef.current) {
        // Volumen real en iOS: el elemento queda a 1 y manda el GainNode.
        background.volume = 1;
        background.muted = false;
        musicGainRef.current.gain.value = musicVolume;
      } else {
        background.muted = musicVolume === 0;
        background.volume = musicVolume;
      }
      // Sin música no tiene caso seguir reproduciendo (batería y datos).
      if (musicVolume === 0 && !background.paused) background.pause();
    }

    // Los efectos siguen al modo de volumen (el switch de música no los afecta).
    if (effectGainRef.current) effectGainRef.current.gain.value = effectVolume;

    Object.values(fallbackEffectsRef.current).forEach((audio) => {
      if (!audio) return;
      audio.muted = effectVolume === 0;
      audio.volume = effectVolume;
    });
  }, []);

  const performVibration = useCallback(() => {
    if (
      typeof navigator !== "undefined" &&
      typeof navigator.vibrate === "function"
    ) {
      navigator.vibrate(VIBRATION_DURATION);
    } else if (!hasWarnedVibrationRef.current) {
      hasWarnedVibrationRef.current = true;
      console.warn(
        "[sound] Vibration API not supported; skipping vibration feedback."
      );
    }
  }, []);

  const playAudioEffect = useCallback(async (key, mode) => {
    if (!AUDIBLE_MODES.has(mode)) {
      return;
    }

    const context = audioContextRef.current;
    if (context) {
      try {
        if (context.state === "suspended") {
          await context.resume();
        }
      } catch (error) {
        console.warn(`[sound] Unable to resume audio context for ${key}.`, error);
      }
    }

    if (context && effectBuffersRef.current[key] && effectGainRef.current) {
      try {
        const source = context.createBufferSource();
        source.buffer = effectBuffersRef.current[key];
        source.connect(effectGainRef.current);
        source.start();
        return;
      } catch (error) {
        console.warn(`[sound] Unable to play ${key} buffer.`, error);
      }
    }

    const fallback = fallbackEffectsRef.current[key];
    if (fallback) {
      try {
        fallback.currentTime = 0;
        await fallback.play();
      } catch (error) {
        console.warn(`[sound] Unable to play ${key} fallback.`, error);
      }
    }
  }, []);

  const ensureBackgroundPlaying = useCallback(() => {
    if (typeof attemptBackgroundPlaybackRef.current === "function") {
      attemptBackgroundPlaybackRef.current();
    }
  }, []);

  const triggerClickFeedback = useCallback(
    (overrideMode) => {
      const mode = overrideMode || soundSettingRef.current;

      if (mode === "off") {
        return;
      }

      if (mode === "vibrate") {
        performVibration();
        return;
      }

      playAudioEffect("interface", mode);
    },
    [performVibration, playAudioEffect]
  );

  const playWardrobeSound = useCallback(
    (overrideMode) => {
      const mode = overrideMode || soundSettingRef.current;

      if (mode === "off") {
        return;
      }

      if (mode === "vibrate") {
        performVibration();
        return;
      }

      playAudioEffect("wardrobe", mode);
    },
    [performVibration, playAudioEffect]
  );

  const playSuccessSound = useCallback(
    (overrideMode) => {
      const mode = overrideMode || soundSettingRef.current;
      if (!AUDIBLE_MODES.has(mode)) {
        return;
      }

      playAudioEffect("success", mode);
    },
    [playAudioEffect]
  );

  const playErrorSound = useCallback(
    (overrideMode) => {
      const mode = overrideMode || soundSettingRef.current;
      if (!AUDIBLE_MODES.has(mode)) {
        return;
      }

      playAudioEffect("failure", mode);
    },
    [playAudioEffect]
  );

  useEffect(() => {
    soundSettingRef.current = soundSetting;
    musicEnabledRef.current = musicEnabled;
    applyModeToAudio(soundSetting, musicEnabled);

    if (musicEnabled && (soundSetting === "full" || soundSetting === "medium")) {
      ensureBackgroundPlaying();
    }
  }, [soundSetting, musicEnabled, applyModeToAudio, ensureBackgroundPlaying]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

    const background = new Audio(BACKGROUND_SRC);
    background.loop = true;
    background.preload = "none"; // se descarga al primer play, no en la carga inicial
    background.muted = false;
    background.volume = 1;
    background.playsInline = true;
    backgroundAudioRef.current = background;

    const AudioContextClass = window.AudioContext || window.webkitAudioContext;

    if (AudioContextClass) {
      const context = new AudioContextClass();
      audioContextRef.current = context;

      const gain = context.createGain();
      gain.gain.value = 0;
      gain.connect(context.destination);
      effectGainRef.current = gain;

      try {
        const musicGain = context.createGain();
        musicGain.gain.value = 0;
        context.createMediaElementSource(background).connect(musicGain).connect(context.destination);
        musicGainRef.current = musicGain;
      } catch (error) {
        console.warn("[sound] Music GainNode unavailable; using element volume.", error);
      }

      Object.keys(SOUND_EFFECTS).forEach((key) => {
        const { src } = SOUND_EFFECTS[key];
        fetch(src)
          .then((response) => {
            if (!response.ok) {
              throw new Error(`HTTP ${response.status}`);
            }
            return response.arrayBuffer();
          })
          .then((data) => context.decodeAudioData(data))
          .then((buffer) => {
            effectBuffersRef.current[key] = buffer;
          })
          .catch((error) => {
            console.warn(`[sound] Failed to load ${key} buffer.`, error);
          });
      });
    }

    // Respaldo con <audio> solo si no hay Web Audio.
    if (!AudioContextClass) {
      Object.keys(SOUND_EFFECTS).forEach((key) => {
        const { src } = SOUND_EFFECTS[key];
        const audio = new Audio(src);
        audio.preload = "auto";
        audio.muted = true;
        audio.volume = 0;
        audio.playsInline = true;
        fallbackEffectsRef.current[key] = audio;
      });
    }

    applyModeToAudio(soundSettingRef.current, musicEnabledRef.current);

    function removeGestureListeners() {
      if (!gestureListenersActiveRef.current) {
        return;
      }

      gestureListenersActiveRef.current = false;
      window.removeEventListener("pointerdown", handleGesture);
      window.removeEventListener("touchstart", handleGesture);
      window.removeEventListener("keydown", handleGesture);
    }

    function addGestureListeners() {
      if (gestureListenersActiveRef.current) {
        return;
      }

      gestureListenersActiveRef.current = true;
      window.addEventListener("pointerdown", handleGesture, { passive: true });
      window.addEventListener("touchstart", handleGesture, { passive: true });
      window.addEventListener("keydown", handleGesture);
    }

    async function attemptPlay() {
      const musicWanted =
        musicEnabledRef.current && AUDIBLE_MODES.has(soundSettingRef.current) && document.visibilityState !== "hidden";
      if (audioContextRef.current) {
        try {
          if (audioContextRef.current.state === "suspended") {
            await audioContextRef.current.resume();
          }
        } catch (error) {
          console.warn("[sound] Unable to resume audio context.", error);
        }
      }

      if (!musicWanted) {
        // Aun sin música, el primer gesto desbloquea el AudioContext para los efectos.
        if (audioContextRef.current?.state === "running") removeGestureListeners();
        else addGestureListeners();
        return;
      }

      try {
        applyModeToAudio(soundSettingRef.current, musicEnabledRef.current);
        await background.play();
        removeGestureListeners();
      } catch (error) {
        if (error?.name !== "AbortError") {
          console.warn("[sound] Background playback blocked.", error);
        }
        addGestureListeners();
      }
    }

    function handleGesture() {
      attemptPlay();
    }

    // iOS suspende el AudioContext y pausa la música al bloquear el teléfono o
    // cambiar de app: al volver se reanuda (o se espera al siguiente toque).
    function handleVisibility() {
      if (document.visibilityState === "hidden") {
        background.pause();
      } else {
        attemptPlay();
      }
    }
    document.addEventListener("visibilitychange", handleVisibility);
    window.addEventListener("pageshow", handleVisibility);

    attemptBackgroundPlaybackRef.current = attemptPlay;
    attemptPlay();

    return () => {
      attemptBackgroundPlaybackRef.current = null;
      removeGestureListeners();
      document.removeEventListener("visibilitychange", handleVisibility);
      window.removeEventListener("pageshow", handleVisibility);
      musicGainRef.current = null;

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

      effectBuffersRef.current = {};
      effectGainRef.current = null;

      Object.values(fallbackEffectsRef.current).forEach((audio) => {
        if (audio) {
          audio.pause();
          audio.src = "";
        }
      });
      fallbackEffectsRef.current = {};
    };
  }, [applyModeToAudio]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

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

    document.addEventListener("click", handleInteractiveClick, true);

    return () => {
      document.removeEventListener("click", handleInteractiveClick, true);
    };
  }, [triggerClickFeedback]);

  return {
    triggerClickFeedback,
    playWardrobeSound,
    playSuccessSound,
    playErrorSound,
  };
}
