import { Polygon } from "./polygon";
import { Segment } from "./segment";
import { translate,angle, substract } from "../math/utils";
export class Envelope{
    public poly: Polygon;

    constructor(public skeleton: Segment, public width: number) {
        this.skeleton = skeleton;
        //use with to generate poly
        this.poly = this.generatePolygon(width);
    }

    private generatePolygon(width: number):Polygon {
        const { p1, p2 } = this.skeleton;

      const radius = width / 2;
      const alpha = angle(substract(p1, p2));
      const alpha_cw = alpha + Math.PI / 2;
        const alpha_ccw = alpha - Math.PI / 2;
        
        const p1_ccw = translate(p1, alpha_ccw, radius);
        const p2_ccw = translate(p2, alpha_ccw, radius);
        const p1_cw = translate(p1, alpha_cw, radius);
        const p2_cw = translate(p2, alpha_cw, radius);

        return new Polygon([p1_ccw,p2_ccw,p2_cw,p1_cw])
    }

    draw(ctx: CanvasRenderingContext2D) {
        this.poly.draw(ctx);
    }
}