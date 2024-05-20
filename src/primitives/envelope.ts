import { Polygon } from "./polygon";
import { Segment } from "./segment";
import { translate,angle, substract } from "../math/utils";
import { Point } from "./point";
export class Envelope{
    //look for a fix
    public poly: Polygon=new Polygon([new Point(0, 0)]);

    constructor(public skeleton?: Segment, public width: number=0,public roundness:number=1) {
        if (skeleton) {
            
            this.skeleton = skeleton;
            //use with to generate poly
            this.poly = this.generatePolygon(width,this.roundness);
        }

    }

    static load(info: Envelope) {
        const env = new Envelope();
        env.skeleton = new Segment(info?.skeleton?.p1!, info?.skeleton?.p2!);
        env.poly = Polygon.load(info.poly);
        return env;
    }

    private generatePolygon(width: number,roundness:number):Polygon {
        const { p1, p2 } = this.skeleton!;

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

    draw(ctx: CanvasRenderingContext2D,options?:{fill:string,stroke:string,lineWidth:number}) {
        this?.poly?.draw(ctx,options);
    }
}