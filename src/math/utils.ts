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

export function add(p1: Point, p2: Point):Point {
    return new Point(p1.x + p2.x, p1.y + p2.y);
}


export function substract(p1: Point, p2: Point):Point {
    return new Point(p1.x - p2.x, p1.y - p2.y);
}

export function scale(p: Point, scaler: number): Point{
    return new Point(p.x * scaler, p.y * scaler);
}