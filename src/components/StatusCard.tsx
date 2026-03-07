interface StatusCardProps {
    status: string;
    isCompassActive: boolean;
    coords: { lat: number; lon: number } | null;
}

export const StatusCard = ({
    status,
    isCompassActive,
    coords,
}: StatusCardProps) => {
    return (
        <div className="bg-slate-900/40 border border-slate-800/50 rounded-2xl p-4 backdrop-blur-md space-y-3">
            <div className="flex items-center gap-3">
                <div
                    className={`w-2 h-2 rounded-full ${coords ? "bg-emerald-500 animate-pulse" : "bg-amber-500"}`}
                />
                <p className="text-sm font-medium text-slate-100 truncate">
                    {status}
                    {isCompassActive && " • Compass Active"}
                </p>
            </div>

            {coords && (
                <div className="grid grid-cols-2 gap-2 text-[10px] font-mono text-slate-400 uppercase tracking-tight">
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
