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

export const EXPRESSION_POSITIONS = {
  1: { x: 50.93, y: 53.49, scale: 0.5 },
  2: { x: 50.76, y: 49.83, scale: 0.479 },
  3: { x: 50.98, y: 46.0, scale: 0.493 },
  4: { x: 50.85, y: 47.31, scale: 0.482 },
  5: { x: 50.0, y: 49.63, scale: 0.553 },
  6: { x: 50.9, y: 46.22, scale: 0.6 },
  7: { x: 51.44, y: 45.17, scale: 0.492 },
  8: { x: 50.22, y: 37.96, scale: 0.585 },
  9: { x: 49.71, y: 54.71, scale: 0.49 },
  10: { x: 51.25, y: 49.41, scale: 0.482 },
  11: { x: 47.34, y: 37.72, scale: 0.549 },
  12: { x: 52.56, y: 38.72, scale: 0.523 },
  13: { x: 50.68, y: 39.26, scale: 0.578 },
  14: { x: 50.02, y: 35.72, scale: 0.602 },
  15: { x: 50.76, y: 48.61, scale: 0.489 },
  16: { x: 51.93, y: 39.99, scale: 0.522 },
  17: { x: 50.07, y: 41.53, scale: 0.467 },
  18: { x: 51.25, y: 49.73, scale: 0.507 },
  19: { x: 50.9, y: 46.22, scale: 0.6 },
  20: { x: 50.56, y: 40.84, scale: 0.479 },
  21: { x: 50.98, y: 46.0, scale: 0.493 },
  22: { x: 48.12, y: 37.08, scale: 0.536 },
  23: { x: 51.44, y: 45.17, scale: 0.492 }
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

export function getExpressionStyle(faceIdx) {
  const pos = EXPRESSION_POSITIONS[faceIdx + 1] || { x: 50, y: 50, scale: 0.5 };
  return {
    position: "absolute",
    left: `${pos.x}%`,
    top: `${pos.y}%`,
    width: "100%",
    height: "100%",
    transform: `translate(-50%, -40.5%) scale(${pos.scale})`,
    transformOrigin: "center center",
  };
}

export default function AvatarRender({ avatarData: avatarFromProps, className = "" }) {
  const user = JSON.parse(localStorage.getItem("user"));
  const avatarData = avatarFromProps || user?.avatar;

  if (!avatarData) return null;

  const bodyOptions = ["/avatares/cuerpoNiño.png", "/avatares/cuerpoAdulto.png"];
  const faceOptions = Array.from({ length: 23 }, (_, i) => `/avatares/cara (${i + 1}).png`);

  const isChild = avatarData.bodyOptions === 0;

  return (
    <div className={`relative w-[33px] h-[60px] ${className}`}>
      <img
        src={bodyOptions[avatarData.bodyOptions || 0]}
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
        {avatarData.expressionOptions !== undefined && avatarData.expressionOptions !== null && avatarData.expressionOptions > 0 && (
          <img
            src={`/avatares/expresiones/expresion (${avatarData.expressionOptions}).png`}
            alt="expression"
            className="absolute object-contain"
            style={getExpressionStyle(avatarData.faceOptions || 0)}
          />
        )}
      </div>
    </div>
  );
}
