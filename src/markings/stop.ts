import { angle} from "../math/utils";
import { Point } from "../primitives/point";
import { Segment } from "../primitives/segment";
import { Marking } from "./marking";

export class Stop extends Marking{
    public boder: Segment;

    constructor( center: Point,  directionVector: Point,  width: number, height: number) {
        super(center,directionVector,width,height)
        //stop border
        this.boder = this.poly.segments[2];
    }

    draw(ctx: CanvasRenderingContext2D) {
        this.boder.draw(ctx,{width:5,color:"white"})
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