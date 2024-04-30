import { scale, substract ,add} from "../math/utils";
import { Point } from "../primitives/point";
import { Polygon } from "../primitives/polygon";

export class Building{
    public base: Polygon;

    constructor(private poly: Polygon, private heightCoef: number = 0.4) {
        this.base = poly;
        this.heightCoef = heightCoef;   
    }

    draw(ctx: CanvasRenderingContext2D, viewPoint: Point) {
        //?? get the tops points (top polygon??)
        const topPoints = this.base.points.map((p =>
            add(p, scale(substract(p, viewPoint), this.heightCoef))
        ));
        const ceiling = new Polygon(topPoints);// top polygon

        const sides: Polygon[] = [];
        for (let i = 0; i < this.base.points.length; i++){
            const nextI = (i + 1) % this.base.points.length;
            const poly = new Polygon([
                this.base.points[i], this.base.points[nextI],
                topPoints[nextI], topPoints[i]
            ]);
            sides.push(poly);
        }

        //make far backward side(farthest to the viewport) first ,then front's ones(closest one) 
        sides.sort((a,b) =>
            b.distanceToPoint(viewPoint) -
            a.distanceToPoint(viewPoint)
        )

        this.base.draw(ctx, { fill: "white", stroke: "#AAA" });
        //draw sides
        for (const side of sides) {
            side.draw(ctx, { fill: "white", stroke: "#AAA" });
        }
        ceiling.draw(ctx, { fill: "white", stroke: "#AAA" });//draw ceiling
        
    }
}