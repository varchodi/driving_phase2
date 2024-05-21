import { angle, translate } from "../math/utils";
import { Envelope } from "../primitives/envelope";
import { Point } from "../primitives/point";
import { Polygon } from "../primitives/polygon";
import { Segment } from "../primitives/segment";
import { Crossing } from "./crossing";
import { Light } from "./light";
import { Parking } from "./parking";
import { Start } from "./start";
import { Stop } from "./stop";
import { Target } from "./target";
import { Yield } from "./yield";

export class Marking{
    public support: Segment;
    public poly: Polygon;
    public type: string = 'markings';
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

    // static load(info: any) {
        
    //     const point = new Point(info.center.x, info.center.y);
    //     const dir = new Point(info.directionVector.x, info.directionVector.y);

    //     switch (info.type) {
    //         case "crossing":
    //             return new Crossing(point, dir, info.width, info.height);
    //         case "light":
    //             return new Light(point, dir, info.width, info.height);
    //         case "parking":
    //             return new Parking(point, dir, info.width, info.height);
    //         case "start":
    //             return new Start(point, dir, info.width, info.height);
    //         case "stop":
    //             return new Stop(point, dir, info.width, info.height);
    //         case "target":
    //             return new Target(point, dir, info.width, info.height);
    //         case "yeild":
    //             return new Yield(point, dir, info.width, info.height);
    //     }
    // }

    draw(ctx: CanvasRenderingContext2D) {
        if (this.poly) {
            console.log("this"+this.type);
        }
        this.poly.draw(ctx)
    }
}