import { useState, useEffect, useCallback } from "react";
import { getQiblaDirection } from "./utils/qibla-math";
import { Header } from "./components/Header";
import { Compass } from "./components/Compass";
import { StatusCard } from "./components/StatusCard";
import { Footer } from "./components/Footer";
import { ManualLocationModal } from "./components/ManualLocationModal";

function App() {
    const [status, setStatus] = useState<string>("Initializing...");
    const [coords, setCoords] = useState<{ lat: number; lon: number } | null>(
        null,
    );
    const [useHighAccuracy, setUseHighAccuracy] = useState(true);
    const [bearing, setBearing] = useState<number | null>(null);
    const [heading, setHeading] = useState<number>(0);
    const [isCompassActive, setIsCompassActive] = useState(false);
    const [isManualModalOpen, setIsManualModalOpen] = useState(false);

    const handleSetManualLocation = (lat: number, lon: number) => {
        setCoords({ lat, lon });
        setBearing(getQiblaDirection(lat, lon));
        setStatus("Manual Location Set");
    };

    const getLocation = useCallback((highAccuracy: boolean) => {
        if (!navigator.geolocation) {
            setStatus("Geolocation not supported");
            return;
        }

        setStatus(
            highAccuracy
                ? "Fetching precise location..."
                : "Fetching location...",
        );

        navigator.geolocation.getCurrentPosition(
            (pos) => {
                const { latitude: lat, longitude: lon } = pos.coords;
                setCoords({ lat, lon });
                setBearing(getQiblaDirection(lat, lon));
                setStatus("Location Updated");
            },
            (err) => {
                console.error("Geolocation Error:", err.message, err.code);

                if (highAccuracy && err.code === 2) {
                    setStatus(
                        "Precise location unavailable. Trying standard accuracy...",
                    );
                    setUseHighAccuracy(false);
                    return;
                }

                switch (err.code) {
                    case 1:
                        setStatus(
                            "Permission Denied. Please enable location access.",
                        );
                        break;
                    case 2:
                        setStatus(
                            "Position Unavailable. Try turning on Wi-Fi.",
                        );
                        break;
                    case 3:
                        setStatus(
                            "Request timed out. Please check connection.",
                        );
                        break;
                    default:
                        setStatus(`Error: ${err.message}`);
                }
            },
            {
                enableHighAccuracy: highAccuracy,
                timeout: 10000,
                maximumAge: 0,
            },
        );
    }, []);

    useEffect(() => {
        const handleOrientation = (event: DeviceOrientationEvent) => {
            const e = event as DeviceOrientationEvent & {
                webkitCompassHeading?: number;
            };
            let h = 0;
            if (e.webkitCompassHeading !== undefined) {
                h = e.webkitCompassHeading;
            } else if (e.alpha !== null) {
                h = (360 - e.alpha) % 360;
            } else {
                return;
            }
            setHeading(h);
            setIsCompassActive(true);
        };

        window.addEventListener("deviceorientation", handleOrientation, true);
        window.addEventListener(
            "deviceorientationabsolute",
            handleOrientation,
            true,
        );

        return () => {
            window.removeEventListener("deviceorientation", handleOrientation);
            window.removeEventListener(
                "deviceorientationabsolute",
                handleOrientation,
            );
        };
    }, []);

    const startCompassRequest = async () => {
        const DOE = DeviceOrientationEvent as unknown as {
            requestPermission?: () => Promise<"granted" | "denied">;
        };
        if (typeof DOE.requestPermission === "function") {
            try {
                const response = await DOE.requestPermission();
                if (response === "granted") {
                    setIsCompassActive(true);
                }
            } catch (err) {
                console.error("Compass permission error:", err);
            }
        }
    };

    useEffect(() => {
        Promise.resolve().then(() => {
            getLocation(useHighAccuracy);
        });
    }, [getLocation, useHighAccuracy]);

    return (
        <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-between p-6 font-sans overflow-hidden">
            <Header />

            <Compass heading={heading} bearing={bearing} />

            <div className="w-full max-w-md space-y-6 pb-4 mt-4">
                <StatusCard
                    status={status}
                    isCompassActive={isCompassActive}
                    coords={coords}
                    onManualClick={() => setIsManualModalOpen(true)}
                />

                <button
                    onClick={() => {
                        startCompassRequest();
                        if (useHighAccuracy) {
                            getLocation(true);
                        } else {
                            setUseHighAccuracy(true);
                        }
                    }}
                    className="w-full bg-emerald-600 hover:bg-emerald-500 active:scale-[0.98] text-white py-4 rounded-2xl font-bold transition-all shadow-lg shadow-emerald-900/20 flex items-center justify-center gap-2 group cursor-pointer"
                >
                    <svg
                        className={`w-5 h-5 group-hover:rotate-180 transition-transform duration-500 ${status.includes("Fetching") ? "animate-spin" : ""}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                        />
                    </svg>
                    {coords ? "REFRESH DIRECTION" : "TRY AGAIN"}
                </button>

                <Footer />
            </div>

            <ManualLocationModal
                isOpen={isManualModalOpen}
                onClose={() => setIsManualModalOpen(false)}
                onSetLocation={handleSetManualLocation}
                currentCoords={coords}
            />
        </div>
    );
}

export default App;
