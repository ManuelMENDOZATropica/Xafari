export default function Xelfies({ onClose }) {
  return (
    <div className="relative w-[90vw] max-w-3xl bg-white rounded-3xl shadow-2xl overflow-hidden">
      <button
        type="button"
        onClick={onClose}
        className="absolute right-4 top-4 h-10 w-10 rounded-full bg-amber-100 text-amber-700 font-semibold shadow-md hover:bg-amber-200 transition"
        aria-label="Cerrar"
      >
        ✕
      </button>

      <div className="flex flex-col items-center gap-4 px-8 py-10 text-center text-gray-800">
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
          Nueva función en camino
        </div>
      </div>
    </div>
  );
}