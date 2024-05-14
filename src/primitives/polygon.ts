import { Point } from "./point";
import { Segment } from "./segment";
import { getIntersection ,getRandomColor,average} from "../math/utils";

export class Polygon{
    private segments: Segment[];
    constructor(public points: Point[]) {
        this.points = points;
        this.segments = [];


        for (let i = 1; i <= points.length; i++) {
         this.segments.push(
            new Segment(points[i - 1], points[i % points.length])
         );
      }
    }

    //?? unify broken polygon
    static union(polys: Polygon[]) {
        Polygon.multiBreak(polys);

        const keptSegments = [];

        for (let i = 0; i < polys.length; i++){
            for (const seg of polys[i].segments) {
                let keep = true;

                for (let j = 0; j < polys.length; j++){
                    if (i != j) {
                        if (polys[j].containsSegment(seg)) {
                            keep = false;
                            break;
                        }
                    }
                }
                if (keep) {
                    keptSegments.push(seg);
                }
            }
        }

        return keptSegments;
    }

    //!! break all polygons at intersection
    static multiBreak(polys: Polygon[]) {
        for (let i = 0; i < polys.length-1; i++){
            for (let j = i + 1; j < polys.length; j++){
                Polygon.break(polys[i], polys[j]);
            }
        }
    }

    static break(poly1: Polygon, poly2:Polygon) {
        const segs1 = poly1.segments;
        const segs2 = poly2.segments;

        for (let i = 0; i < segs1.length; i++){
            for (let j = 0; j < segs2.length; j++){
                const int = getIntersection(
                    segs1[i].p1, segs1[i].p2, segs2[j].p1, segs2[j].p2
                );

                if (int && int.offset != 1 && int.offset != 0) {
                    const point = new Point(int.x, int.y);
                    let aux = segs1[i].p2;
                    segs1[i].p2 = point;
                    segs1.splice(i + 1, 0, new Segment(point, aux));
                    aux = segs2[j].p2;
                    segs2[j].p2 = point;
                    segs2.splice(j + 1, 0, new Segment(point, aux));
                 }
                
            }
        }

        
        
    }

    drawSegment(ctx: CanvasRenderingContext2D) {
        for (const seg of this.segments) {
            seg.draw(ctx,{color:getRandomColor(),width:5})
        }
    }

    //distance between Point and polygon
    distanceToPoint(p: Point) {
        return Math.min(...this.segments.map(s=>s.distanceToPoint(p)))
    }

    //distance between 2 polygons
    distanceToPoly(poly: Polygon) {
        return Math.min(...this.points.map((p)=>poly.distanceToPoint(p)))
    }

    //chack if polgon intercepts (or overlap)
    intersectPoly(poly: Polygon) {
        for (let s1 of this.segments) {
            for (let s2 of poly.segments) {
                if (getIntersection(s1.p1, s1.p2, s2.p1, s2.p2)) {
                    return true;
                }
            }
        }
        return false;
    }

    containsSegment(seg: Segment) {
        const midpoint=average(seg.p1,seg.p2)
        return this.containsPoint(midpoint);
    }

    //check if point p is inside the polygon
    containsPoint(p: Point) {
        const outerPoint=new Point(-1000,-1000)
        let intersectionCount = 0;

        for (const seg of this.segments) {
            let int = getIntersection(outerPoint, p, seg.p1, seg.p2);

            if (int) {
                intersectionCount++;
            }
        }

        return intersectionCount % 2 == 1;//if count is even true
    }

    draw(ctx: CanvasRenderingContext2D, { stroke = "blue", lineWidth = 2, fill = "rgba(0,0,2255,0.3)" ,join="line"}={} ) {
         ctx.beginPath();
      ctx.fillStyle = fill;
      ctx.strokeStyle = stroke;
      ctx.lineWidth = lineWidth;
      ctx.moveTo(this.points[0].x, this.points[0].y);
      for (let i = 1; i < this.points.length; i++) {
         ctx.lineTo(this.points[i].x, this.points[i].y);
      }
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }
}