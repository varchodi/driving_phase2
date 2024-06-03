import { Point } from "../primitives/point";
import { Segment } from "../primitives/segment";

export type PointType = {x:number,y:number};
export type SegmentType = [PointType, PointType];

export class Graph{
    public points;
    public segments;
    constructor(points:Point[]=[],segments:Segment[]=[]) {
        this.points = points;
        this.segments = segments;
    }

    //load previous data (points and segments)
    static load(info: Graph): Graph {
        //transporm save data into point and segment data 
        const points:Point[] = info.points.map((p)=>new Point(p.x,p.y));
        const segments = info.segments.map((s) => new Segment(
            points.find((p) => p.equals(s.p1))!,
            points.find((p) => p.equals(s.p2))!,
            s.oneWay,
        ))

        return new Graph(points, segments);
    }

    //graph hash
    hash(): string{
        return JSON.stringify(this);
    }

    //add point
    addPoint(point: Point) {
        this.points.push(point);
    }

    //check if the graph alread have x point
    containsPoint(point: Point):Point {
        return this.points.find((p) => p.equals(point))!;
    }

    // check??
    tryAddPoint(point: Point) {
        if (!this.containsPoint(point)) {
            this.addPoint(point);
            return true;
        }
        return false;
    }

    //remove point    
    removePoint(point: Point) {
        const segs:Segment[] = this.getSegmentWithPoint(point);
        for (const seg of segs) {
            this.removeSegment(seg);
        }
        this.points.splice(this.points.indexOf(point), 1);
    }
    
    //!! add segment
    addSegment(segment: Segment) {
        this.segments.push(segment);
    }

    //check if contains segment ??
    containsSegment(seg: Segment):Segment {
        return this.segments.find(s => s.equals(seg))!;
    }

    // add segment with check 
    tryAddSegment(segment: Segment):boolean {
        if (!this.containsSegment(segment) && !segment.p1.equals(segment.p2)) {
            this.addSegment(segment);
            return true;
        }
        return false;
    }

    removeSegment(seg: Segment) {
        this.segments.splice(this.segments.indexOf(seg), 1);
    }

    //get segments with point x
    getSegmentWithPoint(point: Point): Segment[]{
        const segs:Segment[] = [];
        for (const seg of this.segments) {
            if (seg.include(point)) {
                segs.push(seg);
            }
        }
        return segs;
    }

    //?? implement shortPath algo
    getShortestPath(start:Point, end:Point) {
        const path = [];
        path.push(start);
        path.push(end);

        //! init point diat to the largest number
        for (const point of this.points) {
            point.dist = Number.MAX_SAFE_INTEGER;
            point.visited = false;
        }

        //!! visit point
        let currentPoint=start;
        currentPoint.dist = 0;

        const segs = this.getSegmentWithPoint(currentPoint);
        for (const seg of segs) {
            const otherPoint = seg.p1.equals(currentPoint) ? seg.p2 : seg.p1;
            path.push(otherPoint);
            //?? get others Point dist
            otherPoint.dist = seg.length();
        }
        currentPoint.visited = true;

        const unvisited = this.points.filter((p) => p.visited === false); // univisited points
        const dists = unvisited.map((p) => p.dist); //univisited points distances
        //?? univisited point with the smallest dist with current Point, n set it as current
        currentPoint=unvisited.find((p)=>p.dist == Math.min(...dists))!

        return path;
    }


    dispose() {
        this.points.length = 0;
        this.segments.length = 0;
    }

    draw(ctx: CanvasRenderingContext2D) {
        for (const segment of this.segments) {
            segment.draw(ctx);
        }

        for (const point of this.points) {
            point.draw(ctx);
        }
    }
}