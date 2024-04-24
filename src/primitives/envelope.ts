import { Polygon } from "./polygon";
import { Segment } from "./segment";
import { translate,angle, substract } from "../math/utils";
import { Point } from "./point";
export class Envelope{
    public poly: Polygon;

    constructor(public skeleton: Segment, public width: number,public roundness:number=1) {
        this.skeleton = skeleton;
        //use with to generate poly
        this.poly = this.generatePolygon(width,this.roundness);
    }

    private generatePolygon(width: number,roundness:number):Polygon {
        const { p1, p2 } = this.skeleton;

      const radius = width / 2;
      const alpha = angle(substract(p1, p2));
      const alpha_cw = alpha + Math.PI / 2;
        const alpha_ccw = alpha - Math.PI / 2;
        
        //?? make the curvy thing
        const points: Point[] = [];
        
        //curve segment's p1
        const step = Math.PI / Math.max(1, roundness);
        const eps = step / 2;
        for (let i = alpha_ccw; i <= alpha_cw+eps; i += step){
            points.push(translate(p1,i,radius))
        }
        //curve p2
        for (let i = alpha_ccw; i <= alpha_cw+eps; i += step){
            points.push(translate(p2,Math.PI+i,radius))
        }

        return new Polygon(points)
    }

    draw(ctx: CanvasRenderingContext2D) {
        this.poly.draw(ctx);
    }
}