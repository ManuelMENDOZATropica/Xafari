import { useContext } from "react";
import XafariContext from "./XafariContext";
import { getFaceStyle } from "@/data/avatar";

export default function AvatarRender({ avatarData: avatarFromProps, className = "" }) {
  const { user } = useContext(XafariContext);
  const avatarData = avatarFromProps || user?.avatar;

  if (!avatarData) return null;

  const bodyOptions = ["/avatares/cuerpoNino.webp", "/avatares/cuerpoAdulto.webp"];
  const faceOptions = Array.from({ length: 23 }, (_, i) => `/avatares/cara-${i + 1}.webp`);

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
