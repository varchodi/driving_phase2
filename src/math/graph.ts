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

    draw(ctx: CanvasRenderingContext2D) {
        for (const segment of this.segments) {
            segment.draw(ctx);
        }

        for (const point of this.points) {
            point.draw(ctx);
        }
    }
}