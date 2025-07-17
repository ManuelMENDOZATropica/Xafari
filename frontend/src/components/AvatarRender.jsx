export default function AvatarRender({ avatarData: avatarFromProps, className = "" }) {
  const user = JSON.parse(localStorage.getItem("user"));
  const avatarData = avatarFromProps || user?.avatar;

  if (!avatarData) return null;

  const bodyOptions = Array.from({ length: 10 }, (_, i) => `/avatares/CUERPO_${i + 1}.png`);
  const eyesOptions = Array.from({ length: 5 }, (_, i) => `/avatares/OJOS_${i + 1}.png`);
  const hairOptions = [null, ...Array.from({ length: 18 }, (_, i) => `/avatares/PELO_${i + 1}.png`)];
  const clothingOptions = Array.from({ length: 16 }, (_, i) => `/avatares/VESTUARIO_${i + 1}.png`);
  const glassesOptions = [null, ...Array.from({ length: 10 }, (_, i) => `/avatares/LENTES_${i + 1}.png`)];
  const headOptions = [null, ...Array.from({ length: 10 }, (_, i) => `/avatares/SOMBREROS_${i + 1}.png`)];
  const bodyAccOptions = [null, ...Array.from({ length: 2 }, (_, i) => `/avatares/ACCESORIOS_CUERPOS_${i + 1}.png`)];
  const shoeOptions = [null, ...Array.from({ length: 15 }, (_, i) => `/avatares/ZAPATOS_${i + 1}.png`)];

  const hideHair = avatarData.clothingOptions === 4 || avatarData.clothingOptions === 5;

  const layers = [
    bodyAccOptions[avatarData.bodyAccessoryOptions],
    bodyOptions[avatarData.bodyOptions],
    eyesOptions[avatarData.eyesOptions],
    !hideHair ? hairOptions[avatarData.hairOptions] : null,
    shoeOptions[avatarData.shoeOptions],
    clothingOptions[avatarData.clothingOptions],
    headOptions[avatarData.headAccessoryOptions],
    glassesOptions[avatarData.glassesAccessoryOptions],
  ];

  return (
    <div className={`relative w-[33px] h-[60px] ${className}`}>
      {layers.map(
        (img, idx) =>
          img && (
            <img
              key={idx}
              src={img}
              alt={`layer-${idx}`}
              className="absolute w-full h-full object-contain"
            />
          )
      )}
    </div>
  );
}
