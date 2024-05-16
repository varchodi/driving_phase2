import { angle, translate } from "../math/utils";
import { Envelope } from "../primitives/envelope";
import { Point } from "../primitives/point";
import { Polygon } from "../primitives/polygon";
import { Segment } from "../primitives/segment";

export class Stop{
    private support: Segment;
    private poly: Polygon;

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
    }

    draw(ctx: CanvasRenderingContext2D) {
        this.poly.draw(ctx);
    }
}