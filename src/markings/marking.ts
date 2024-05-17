import { angle, translate } from "../math/utils";
import { Envelope } from "../primitives/envelope";
import { Point } from "../primitives/point";
import { Polygon } from "../primitives/polygon";
import { Segment } from "../primitives/segment";

export class Marking{
    public support: Segment;
    public poly: Polygon;

    constructor(public center: Point, public directionVector: Point, public width: number, public height: number) {
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
    
    }

    draw(ctx: CanvasRenderingContext2D) {
        this.poly.draw(ctx)
    }
}