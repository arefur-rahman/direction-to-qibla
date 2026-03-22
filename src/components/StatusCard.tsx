interface StatusCardProps {
    status: string;
    isCompassActive: boolean;
    coords: { lat: number; lon: number } | null;
    onManualClick?: () => void;
}

export const StatusCard = ({
    status,
    isCompassActive,
    coords,
    onManualClick,
}: StatusCardProps) => {
    return (
        <div className="bg-slate-900/40 border border-slate-800/50 rounded-2xl p-4 backdrop-blur-md space-y-3 relative overflow-hidden">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div
                        className={`w-2 h-2 rounded-full ${coords ? "bg-emerald-500 animate-pulse" : "bg-amber-500"}`}
                    />
                    <p className="text-sm font-medium text-slate-100 truncate">
                        {status}
                        {isCompassActive && " • Compass Active"}
                    </p>
                </div>
                
                <button 
                   onClick={onManualClick}
                   className="text-[10px] font-mono font-bold text-emerald-500 hover:text-emerald-400 bg-emerald-500/10 hover:bg-emerald-500/20 px-2.5 py-1 rounded-full transition-all border border-emerald-500/20 active:scale-95"
                >
                    {coords ? "EDIT" : "MANUAL"}
                </button>
            </div>

            {coords && (
                <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-slate-400 uppercase tracking-tight animate-in fade-in slide-in-from-top duration-500">
                    <div className="bg-black/20 p-2 rounded-lg border border-white/5">
                        Lat: {coords.lat.toFixed(4)}
                    </div>
                    <div className="bg-black/20 p-2 rounded-lg border border-white/5">
                        Lon: {coords.lon.toFixed(4)}
                    </div>
                </div>
            )}
        </div>
    );
};
