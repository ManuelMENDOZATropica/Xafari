import { useCallback, useEffect, useRef } from "react";

const BACKGROUND_SRC = "/sounds/forest.mp3";
const INTERACTIVE_SELECTOR =
  "button, [role=\"button\"], a[href], input[type=\"button\"], input[type=\"submit\"], input[type=\"reset\"]";
const SOUND_EFFECTS = {
  interface: { src: "/sounds/click_3.ogg" },
  wardrobe: { src: "/sounds/click_2.ogg" },
  success: { src: "/sounds/chimes.ogg" },
  failure: { src: "/sounds/negative_sound.ogg" },
};
const AUDIBLE_MODES = new Set(["full", "medium"]);
const VIBRATION_DURATION = 30;

export default function useSoundController(soundSetting) {
  const backgroundAudioRef = useRef(null);
  const audioContextRef = useRef(null);
  const effectBuffersRef = useRef({});
  const effectGainRef = useRef(null);
  const fallbackEffectsRef = useRef({});
  const attemptBackgroundPlaybackRef = useRef(null);
  const soundSettingRef = useRef(soundSetting);
  const hasWarnedVibrationRef = useRef(false);
  const gestureListenersActiveRef = useRef(false);

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

    if (effectGainRef.current) {
      if (mode === "full") {
        effectGainRef.current.gain.value = 1;
      } else if (mode === "medium") {
        effectGainRef.current.gain.value = 0.4;
      } else {
        effectGainRef.current.gain.value = 0;
      }
    }

    const fallbackAudios = fallbackEffectsRef.current;
    Object.keys(fallbackAudios).forEach((key) => {
      const audio = fallbackAudios[key];
      if (!audio) {
        return;
      }

      if (mode === "full") {
        audio.muted = false;
        audio.volume = 1;
      } else if (mode === "medium") {
        audio.muted = false;
        audio.volume = 0.4;
      } else {
        audio.muted = true;
        audio.volume = 0;
      }
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
    applyModeToAudio(soundSetting);

    if (soundSetting === "full" || soundSetting === "medium") {
      ensureBackgroundPlaying();
    }
  }, [soundSetting, applyModeToAudio, ensureBackgroundPlaying]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return undefined;
    }

    const background = new Audio(BACKGROUND_SRC);
    background.loop = true;
    background.preload = "auto";
    background.muted = false;
    background.volume = 0;
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

    Object.keys(SOUND_EFFECTS).forEach((key) => {
      const { src } = SOUND_EFFECTS[key];
      const audio = new Audio(src);
      audio.preload = "auto";
      audio.muted = true;
      audio.volume = 0;
      audio.playsInline = true;
      fallbackEffectsRef.current[key] = audio;
    });

    applyModeToAudio(soundSettingRef.current);

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
      if (audioContextRef.current) {
        try {
          if (audioContextRef.current.state === "suspended") {
            await audioContextRef.current.resume();
          }
        } catch (error) {
          console.warn("[sound] Unable to resume audio context.", error);
        }
      }

      try {
        await background.play();
        applyModeToAudio(soundSettingRef.current);
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

    attemptBackgroundPlaybackRef.current = attemptPlay;
    attemptPlay();

    return () => {
      attemptBackgroundPlaybackRef.current = null;
      removeGestureListeners();

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
