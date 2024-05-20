import { Marking } from "./marking";
import { add, perpendicular, scale } from "../math/utils";
import { Point } from "../primitives/point";
import { Segment } from "../primitives/segment";

export class Crossing extends Marking{
    public boders: Segment[];

    constructor( center: Point,  directionVector: Point,  width: number,  height: number) {
        super(center, directionVector, width, height);
        this.boders = [this.poly.segments[0],this.poly.segments[2]];
        this.type="crossing";
    }

    draw(ctx: CanvasRenderingContext2D) {
        const perp = perpendicular(this.directionVector);
        const line = new Segment(
            add(this.center, scale(perp, this.width / 2)),
            add(this.center,scale(perp,-this.width/2))
        )

        line.draw(ctx, {
            width: this.height,
            color: "white",
            dash:[11,11]
        });

        
    }
}