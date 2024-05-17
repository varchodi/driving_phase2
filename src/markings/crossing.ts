import { add, angle, scale, translate } from "../math/utils";
import { Envelope } from "../primitives/envelope";
import { Point } from "../primitives/point";
import { Polygon } from "../primitives/polygon";
import { Segment } from "../primitives/segment";

export class Crossing{
    private support: Segment;
    public poly: Polygon;
    private boder: Segment;

    constructor(private center: Point, private directionVector: Point, private width: number, private height: number) {
        this.center = center;
        this.directionVector = directionVector;
        this.width = width;
        this.height = height;

        this.support = new Segment(
            translate(center, angle(directionVector), height / 2),
            translate(center, angle(directionVector), -height / 2)
        )
        this.poly = new Envelope(this.support, width, 0).poly;
        //stop border
        this.boder = this.poly.segments[2];
    }

    draw(ctx: CanvasRenderingContext2D) {
        const perp = perpendicular(this.directionVector);
        const line = new Segment(
            add(this.center, scale(perp, this.width / 2)),
            add(this.center,scale(perp,-this.width/2))
        )

        line.draw(ctx);
        
    }
}