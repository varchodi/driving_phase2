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
        ctx.save();
        ctx.translate(this.center.x, this.center.y);
        ctx.rotate(angle(this.directionVector) - Math.PI / 2);
        ctx.scale(1, 3);

        ctx.beginPath();
        ctx.textBaseline = "middle";
        ctx.textAlign = "center";
        ctx.fillStyle = "white";
        ctx.font = `bold ${this.height * .3}px Arial`;
        ctx.fillText("STOP", 0, 1); // 0,0, because of roatatio

        ctx.restore();
    }
}