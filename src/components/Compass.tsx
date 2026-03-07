import {
    getDirectionParts,
    describeArc,
    polarToCartesian,
    getDirectionDescription,
} from "../utils/qibla-math";

interface CompassProps {
    heading: number;
    bearing: number | null;
}

export const Compass = ({ heading, bearing }: CompassProps) => {
    return (
        <main className="flex-1 flex flex-col items-center justify-center w-full max-w-md gap-12">
            <div className="relative group p-4 animate-in zoom-in duration-500">
                {/* Outer glow */}
                <div className="absolute inset-0 bg-emerald-500/10 rounded-full blur-3xl group-hover:bg-emerald-500/20 transition-all duration-1000" />

                {/* Compass Container */}
                <div className="relative w-72 h-72 md:w-80 md:h-80 rounded-full border border-slate-800 bg-slate-900/50 backdrop-blur-sm shadow-2xl flex items-center justify-center overflow-hidden">
                    {/* Compass Rings */}
                    <div className="absolute inset-2 rounded-full border border-slate-800/50" />
                    <div className="absolute inset-4 rounded-full border border-slate-700/20" />

                    {/* Rotating Compass Rose */}
                    <div
                        className="absolute inset-0 transition-transform duration-200 ease-linear"
                        style={{ transform: `rotate(${-heading}deg)` }}
                    >
                        {/* Cardinal Points */}
                        <div className="absolute top-3 inset-x-0 flex flex-col items-center">
                            <span className="font-bold text-slate-200 text-xs">
                                N
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">
                                0°
                            </span>
                        </div>
                        <div className="absolute right-3 inset-y-0 flex items-center gap-1.5">
                            <span className="text-[10px] text-slate-400 font-mono">
                                90°
                            </span>
                            <span className="font-bold text-slate-200 text-xs">
                                E
                            </span>
                        </div>
                        <div className="absolute bottom-3 inset-x-0 flex flex-col items-center">
                            <span className="text-[10px] text-slate-400 font-mono">
                                180°
                            </span>
                            <span className="font-bold text-slate-200 text-xs">
                                S
                            </span>
                        </div>
                        <div className="absolute left-3 inset-y-0 flex items-center gap-1.5">
                            <span className="font-bold text-slate-200 text-xs">
                                W
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">
                                270°
                            </span>
                        </div>

                        {/* The Needle/Indicator */}
                        {bearing !== null && (
                            <div className="absolute inset-0">
                                {/* Marking Arc/Line */}
                                <svg
                                    className="absolute inset-0 w-full h-full pointer-events-none drop-shadow-[0_0_5px_rgba(251,191,36,0.3)]"
                                    viewBox="0 0 100 100"
                                >
                                    {(() => {
                                        const parts =
                                            getDirectionParts(bearing);
                                        if (parts.deg === undefined)
                                            return null;
                                        return (
                                            <>
                                                <path
                                                    d={describeArc(
                                                        50,
                                                        50,
                                                        42,
                                                        parts.base,
                                                        bearing,
                                                    )}
                                                    fill="none"
                                                    stroke="rgba(251, 191, 36, 0.6)"
                                                    strokeWidth="1.5"
                                                    strokeLinecap="round"
                                                    className="animate-in fade-in duration-1000"
                                                />
                                                <circle
                                                    cx={
                                                        polarToCartesian(
                                                            50,
                                                            50,
                                                            42,
                                                            parts.base,
                                                        ).x
                                                    }
                                                    cy={
                                                        polarToCartesian(
                                                            50,
                                                            50,
                                                            42,
                                                            parts.base,
                                                        ).y
                                                    }
                                                    r="1.5"
                                                    fill="#fbbf24"
                                                />
                                            </>
                                        );
                                    })()}
                                </svg>

                                <div
                                    className="relative w-full h-full flex items-center justify-center transition-transform duration-500 ease-out"
                                    style={{
                                        transform: `rotate(${bearing}deg)`,
                                    }}
                                >
                                    {/* Arrow to Kaaba */}
                                    <div className="absolute top-10 flex flex-col items-center scale-110">
                                        <div className="w-1 h-32 bg-linear-to-t from-transparent via-emerald-500 to-emerald-400 rounded-full shadow-[0_0_15px_rgba(16,185,129,0.5)]" />
                                        <div className="w-0 h-0 border-l-12 border-l-transparent border-r-12 border-r-transparent border-b-24 border-b-emerald-400 -mt-2 drop-shadow-[0_0_10px_rgba(16,185,129,0.8)]" />

                                        {/* Kaaba Icon */}
                                        <div className="-mt-1 md:mt-0 p-2 bg-slate-900 border border-emerald-500/30 rounded-lg shadow-xl translate-y-2 scale-78 md:scale-95">
                                            <svg
                                                className="w-6 h-6 text-emerald-400"
                                                viewBox="0 0 24 24"
                                                fill="currentColor"
                                            >
                                                <path d="M12 2L4 6v12l8 4 8-4V6l-8-4zm6 14.5l-6 3-6-3V7.5l6-3 6 3v9z" />
                                                <rect
                                                    x="9"
                                                    y="9"
                                                    width="6"
                                                    height="6"
                                                    fill="currentColor"
                                                    fillOpacity="0.4"
                                                />
                                            </svg>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    {bearing === null && (
                        <div className="animate-pulse flex flex-col items-center gap-4">
                            <div className="w-12 h-12 rounded-full border-4 border-slate-800 border-t-emerald-500 animate-spin" />
                            <span className="text-slate-300 text-sm font-medium">
                                Scanning...
                            </span>
                        </div>
                    )}
                </div>
            </div>

            {/* Display info */}
            {bearing !== null && (
                <div className="text-center space-y-2 animate-in fade-in slide-in-from-bottom duration-1000">
                    <div className="md:text-5xl text-4xl font-mono tracking-tighter text-emerald-400 font-bold uppercase">
                        {getDirectionDescription(bearing)}
                    </div>
                    <div className="text-slate-300 text-sm font-medium tracking-wide uppercase">
                        Relative Direction to Kaaba
                    </div>
                    <div className="text-slate-400 text-[10px] font-mono opacity-70">
                        RAW BEARING: {Math.round(bearing)}° FROM NORTH
                    </div>
                </div>
            )}
        </main>
    );
};
