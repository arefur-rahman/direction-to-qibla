export function getQiblaDirection(lat: number, lon: number) {
    const kaabaLat = 21.4225;
    const kaabaLon = 39.8262;

    const toRad = (deg: number) => (deg * Math.PI) / 180;
    const toDeg = (rad: number) => (rad * 180) / Math.PI;

    const φ1 = toRad(lat);
    const φ2 = toRad(kaabaLat);
    const Δλ = toRad(kaabaLon - lon);

    const y = Math.sin(Δλ) * Math.cos(φ2);
    const x =
        Math.cos(φ1) * Math.sin(φ2) -
        Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);

    const θ = Math.atan2(y, x);
    const bearing = (toDeg(θ) + 360) % 360;

    return bearing; // degree from North
}

export function getDirectionParts(bearing: number) {
    const b = (Math.round(bearing) + 360) % 360;

    if (b === 0) return { label: "North", base: 0 };
    if (b === 90) return { label: "East", base: 90 };
    if (b === 180) return { label: "South", base: 180 };
    if (b === 270) return { label: "West", base: 270 };

    if (b > 0 && b < 90) {
        if (b <= 45) return { label: "North-East", deg: b, base: 0 };
        return { label: "East-North", deg: 90 - b, base: 90 };
    }
    if (b > 90 && b < 180) {
        if (b <= 135) return { label: "East-South", deg: b - 90, base: 90 };
        return { label: "South-East", deg: 180 - b, base: 180 };
    }
    if (b > 180 && b < 270) {
        if (b <= 225) return { label: "South-West", deg: b - 180, base: 180 };
        return { label: "West-South", deg: 270 - b, base: 270 };
    }

    if (b <= 315) return { label: "West-North", deg: b - 270, base: 270 };
    return { label: "North-West", deg: 360 - b, base: 0 };
}

export function describeArc(
    x: number,
    y: number,
    radius: number,
    startAngle: number,
    endAngle: number,
) {
    const start = polarToCartesian(x, y, radius, endAngle);
    const end = polarToCartesian(x, y, radius, startAngle);

    const largeArcFlag = Math.abs(endAngle - startAngle) <= 180 ? "0" : "1";
    return [
        "M",
        start.x,
        start.y,
        "A",
        radius,
        radius,
        0,
        largeArcFlag,
        0,
        end.x,
        end.y,
    ].join(" ");
}

export function polarToCartesian(
    cx: number,
    cy: number,
    r: number,
    angleDeg: number,
) {
    const angleRad = ((angleDeg - 90) * Math.PI) / 180.0;
    return {
        x: cx + r * Math.cos(angleRad),
        y: cy + r * Math.sin(angleRad),
    };
}

export function getDirectionDescription(bearing: number) {
    const b = (Math.round(bearing) + 360) % 360;

    if (b === 0) return "North";
    if (b === 90) return "East";
    if (b === 180) return "South";
    if (b === 270) return "West";

    if (b > 0 && b < 90) {
        if (b <= 45) return `North-East ${b}°`;
        return `East-North ${90 - b}°`;
    }
    if (b > 90 && b < 180) {
        if (b <= 135) return `East-South ${b - 90}°`;
        return `South-East ${180 - b}°`;
    }
    if (b > 180 && b < 270) {
        if (b <= 225) return `South-West ${b - 180}°`;
        return `West-South ${270 - b}°`;
    }

    if (b <= 315) return `West-North ${b - 270}°`;
    return `North-West ${360 - b}°`;
}
