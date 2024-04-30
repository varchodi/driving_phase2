import {scale, add, substract,lerp2D, lerp, translate } from "../math/utils";
import { Point } from "../primitives/point";
import { Polygon } from "../primitives/polygon";
import { Segment } from "../primitives/segment";

export class Tree{
    public base: Polygon;

    constructor(public center: Point, public size: number,private hightCoef:number=0.3) {
        this.center = center;
        this.size = size; // size of base 
        this.hightCoef = hightCoef // tree hight controller
        this.base = this.generateLevel(center, size);// generate base 
    }

    private generateLevel(point: Point, size: number):Polygon {
        const points = [];
        const rad = size / 2;

        for (let a = 0; a < Math.PI * 2; a += Math.PI / 16){
            const kindOfRandom = Math.cos(((a + this.center.x) * size) % 17)**2;
            const noisyRadius = rad * lerp(0.5,1,kindOfRandom);
            points.push(translate(point, a, noisyRadius));
        }

        return new Polygon(points);
    }

    draw(ctx: CanvasRenderingContext2D, viewPoint:Point) {
        
        const diff=substract(this.center,viewPoint)
        const top = add(this.center, scale(diff,this.hightCoef));
        
        //draw tree branches level
        const levelCount = 7; 
        for (let level = 0; level < levelCount; level++){
            const t = level / (levelCount - 1);
            const point = lerp2D(this.center, top, t);
            const color = `rgb(30,${lerp(50, 200, t)},70)`;// level colors (shading effect)
            const size = lerp(this.size, 40, t);
            
            const poly = this.generateLevel(point, size);
            poly.draw(ctx,{fill:color,stroke:"rgba(0,0,0,0)"})
        }
        
        
    }
}