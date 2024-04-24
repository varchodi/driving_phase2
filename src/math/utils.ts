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

export function translate(loc: Point, angle: number, offset: number):Point {
    return new Point(
        loc.x + Math.cos(angle) * offset,
        loc.y + Math.sin(angle) * offset
    )
}

export function angle(p: Point):number {
    return Math.atan2(p.y, p.x);
}


export function getIntersection(A: Point, B:Point, C:Point, D:Point) {
    const tTop = (D.x - C.x) * (A.y - C.y) - (D.y - C.y) * (A.x - C.x);
    const uTop = (C.y - A.y) * (A.x - B.x) - (C.x - A.x) * (A.y - B.y);
    const bottom = (D.y - C.y) * (B.x - A.x) - (D.x - C.x) * (B.y - A.y);
 
    if (bottom != 0) {
       const t = tTop / bottom;
       const u = uTop / bottom;
       if (t >= 0 && t <= 1 && u >= 0 && u <= 1) {
          return {
             x: lerp(A.x, B.x, t),
             y: lerp(A.y, B.y, t),
             offset: t,
          };
       }
    }
 
    return null;
 }
 
export function lerp(a:number, b:number, t:number) {
    return a + (b - a) * t;
}

export function getRandomColor() {
    const hue = 290 + Math.random() * 260;
    return "hsl(" + hue + ", 100%, 60%)";
 }