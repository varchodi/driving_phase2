import { Point } from "../primitives/point";

export function getNearestPoint (loc: Point, points: Point[],threshold:number=Number.MAX_SAFE_INTEGER){
    let minDist = Number.MAX_SAFE_INTEGER;
    let nearest = null;

    for (const point of points) {
        const dist = distance(point, loc);
        if (dist < minDist && dist<threshold) {
            minDist = dist;
            nearest = point;
        }
    }

    return nearest;
}

//2points distance
function distance(p1: Point, p2: Point):number {
    return Math.hypot(p1.x - p2.x, p1.y - p2.y);
}