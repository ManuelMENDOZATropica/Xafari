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
      <img
        src={faceOptions[avatarData.faceOptions || 0]}
        alt="face"
        className={`absolute w-full h-full object-contain ${isChild
          ? "scale-[0.5] -translate-y-[5%]"
          : "scale-[0.7] -translate-y-[20%] -translate-x-[-5%]"
          }`}
      />
    </div>
  );
}
