import CloseIcon from "./CloseIcon";

export default function Xelfies({ onClose }) {
  return (
    <div className="w-full h-full mt-[22px] ">
      <div className="relative w-full h-full font-apercu text-white bg-[#7b5226] rounded-[10px]">
        <div className="absolute inset-0 w-full h-full bg-white/0 overflow-hidden flex flex-col z-10">
          <div className="flex flex-col items-center gap-4 px-8 py-10 text-center text-gray-800 h-full justify-center">
            <img
              src="/iconos/xelfies.png"
              alt="Xelfies"
              className="w-24 h-24 object-contain"
            />
            <h2 className="text-2xl font-bold text-amber-700">Xelfies</h2>
            <p className="text-base leading-relaxed max-w-xl">
              Captura y revive tus momentos favoritos. Próximamente podrás guardar y
              compartir tus Xelfies desde aquí.
            </p>
            <div className="mt-2 inline-flex items-center gap-2 rounded-full bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-700">
              <span className="inline-block h-2 w-2 rounded-full bg-amber-500" />
              Nueva función en caminoo
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}