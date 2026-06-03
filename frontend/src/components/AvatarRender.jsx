export const FACE_OFFSETS = {
  1: { x: 0.0, y: 0.0 },
  2: { x: 0.12, y: 2.95 },
  3: { x: -0.9, y: 1.77 },
  4: { x: -0.82, y: 0.25 },
  5: { x: 0.05, y: 1.98 },
  6: { x: -0.99, y: 2.34 },
  7: { x: -1.45, y: 0.68 },
  8: { x: -0.38, y: 4.19 },
  9: { x: 0.0, y: 3.92 },
  10: { x: -0.34, y: 3.71 },
  11: { x: 0.02, y: 1.73 },
  12: { x: -0.37, y: 4.38 },
  13: { x: -0.95, y: 3.35 },
  14: { x: 0.22, y: 3.93 },
  15: { x: -0.84, y: 1.8 },
  16: { x: -1.11, y: 2.81 },
  17: { x: -0.94, y: 3.65 },
  18: { x: -0.27, y: 0.56 },
  19: { x: -0.99, y: 2.34 },
  20: { x: -0.63, y: 1.01 },
  21: { x: -0.9, y: 1.77 },
  22: { x: -0.44, y: 6.22 },
  23: { x: -1.45, y: 0.68 }
};

export function getFaceStyle(faceIdx, isChild) {
  const offset = FACE_OFFSETS[faceIdx + 1] || { x: 0, y: 0 };
  
  let baseTranslateX = 0;
  let baseTranslateY = 0;
  let baseScale = 1;
  
  if (isChild) {
    baseTranslateY = -5;
    baseScale = 0.5;
  } else {
    baseTranslateX = 5;
    baseTranslateY = -20;
    baseScale = 0.7;
  }
  
  const transform = `translate(${baseTranslateX}%, ${baseTranslateY}%) scale(${baseScale}) translate(${offset.x}%, ${offset.y}%)`;
  
  return {
    transform,
    transformOrigin: "center center",
  };
}

export default function AvatarRender({ avatarData: avatarFromProps, className = "" }) {
  const user = JSON.parse(localStorage.getItem("user"));
  const avatarData = avatarFromProps || user?.avatar;

  if (!avatarData) return null;

  const bodyOptions = ["/avatares/cuerpoNiño.png", "/avatares/cuerpoAdulto.png"];
  const faceOptions = Array.from({ length: 23 }, (_, i) => `/avatares/cara (${i + 1}).png`);

  const bodyIdx = avatarData.bodyOptions === 0 ? 0 : 1;
  const isChild = bodyIdx === 0;

  return (
    <div className={`relative w-[33px] h-[60px] ${className}`}>
      <img
        src={bodyOptions[bodyIdx]}
        alt="body"
        className={`absolute w-full h-full object-contain ${isChild ? "scale-[0.85] translate-y-[5%]" : "scale-100"
          }`}
      />
      <div
        className="absolute w-full h-full"
        style={getFaceStyle(avatarData.faceOptions || 0, isChild)}
      >
        <img
          src={faceOptions[avatarData.faceOptions || 0]}
          alt="face"
          className="w-full h-full object-contain"
        />
      </div>
    </div>
  );
}
