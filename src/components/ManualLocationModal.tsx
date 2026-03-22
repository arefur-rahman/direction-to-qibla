import { useState } from "react";

interface ManualLocationModalProps {
    isOpen: boolean;
    onClose: () => void;
    onSetLocation: (lat: number, lon: number) => void;
    currentCoords: { lat: number; lon: number } | null;
}

export const ManualLocationModal = ({
    isOpen,
    onClose,
    onSetLocation,
    currentCoords,
}: ManualLocationModalProps) => {
    const [lat, setLat] = useState(currentCoords?.lat.toString() || "");
    const [lon, setLon] = useState(currentCoords?.lon.toString() || "");
    const [error, setError] = useState<string | null>(null);

    if (!isOpen) return null;

    const processInput = (value: string) => {
        if (value.includes(",")) {
            const parts = value.split(",").map((s) => s.trim());
            if (parts.length >= 2) {
                const l = parts[0];
                const ln = parts[1];
                
                // Validate if they are numbers before setting
                if (!isNaN(parseFloat(l)) && !isNaN(parseFloat(ln))) {
                    setLat(l);
                    setLon(ln);
                    setError(null);
                    return true;
                }
            }
        }
        return false;
    };

    const handlePaste = (e: React.ClipboardEvent) => {
        const pastedData = e.clipboardData.getData("text");
        if (processInput(pastedData)) {
            e.preventDefault();
        }
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const l = parseFloat(lat);
        const ln = parseFloat(lon);

        if (isNaN(l) || isNaN(ln)) {
            setError("Please enter valid numbers");
            return;
        }

        if (l < -90 || l > 90) {
            setError("Latitude must be between -90 and 90");
            return;
        }

        if (ln < -180 || ln > 180) {
            setError("Longitude must be between -180 and 180");
            return;
        }

        onSetLocation(l, ln);
        onClose();
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-300">
            <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-2xl animate-in zoom-in-95 duration-300">
                <div className="flex justify-between items-start mb-6">
                    <div>
                        <h2 className="text-xl font-bold text-white">
                            Manual Location
                        </h2>
                        <p className="text-slate-400 text-xs mt-1">
                            Enter your current coordinates
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-800 rounded-full transition-colors"
                    >
                        <svg
                            className="w-5 h-5 text-slate-400"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M6 18L18 6M6 6l12 12"
                            />
                        </svg>
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-1.5">
                        <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest ml-1">
                            Latitude
                        </label>
                        <input
                            type="text"
                            inputMode="decimal"
                            value={lat}
                            onPaste={handlePaste}
                            onChange={(e) => {
                                if (!processInput(e.target.value)) {
                                    setLat(e.target.value);
                                }
                            }}
                            placeholder="e.g. 23.8103"
                            className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all font-mono"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[10px] font-mono text-slate-500 uppercase tracking-widest ml-1">
                            Longitude
                        </label>
                        <input
                            type="text"
                            inputMode="decimal"
                            value={lon}
                            onPaste={handlePaste}
                            onChange={(e) => {
                                if (!processInput(e.target.value)) {
                                    setLon(e.target.value);
                                }
                            }}
                            placeholder="e.g. 90.4125"
                            className="w-full bg-slate-800/50 border border-slate-700/50 rounded-xl px-4 py-3 text-white placeholder:text-slate-600 focus:outline-hidden focus:ring-2 focus:ring-emerald-500/50 focus:border-emerald-500/50 transition-all font-mono"
                        />
                    </div>

                    {error && (
                        <p className="text-rose-500 text-[10px] font-medium ml-1 animate-pulse">
                            {error}
                        </p>
                    )}

                    <div className="pt-2">
                        <button
                            type="submit"
                            className="w-full bg-emerald-600 hover:bg-emerald-500 text-white font-bold py-3.5 rounded-xl shadow-lg shadow-emerald-900/20 active:scale-[0.98] transition-all"
                        >
                            Set Location
                        </button>
                    </div>
                </form>

                <div className="mt-6 pt-6 border-t border-slate-800/50">
                    <p className="text-[10px] text-slate-500 text-center leading-relaxed italic">
                        Tip: You can paste the "lat, lon" string directly from
                        Google Maps into either field!
                    </p>
                </div>
            </div>
        </div>
    );
};
