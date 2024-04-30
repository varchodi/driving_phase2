import {scale, add, substract,lerp2D, lerp } from "../math/utils";
import { Point } from "../primitives/point";
import { Segment } from "../primitives/segment";

export class Tree{
    constructor(public center: Point, public size: number,private hightCoef:number=0.3) {
        this.center = center;
        this.size = size; // size of base 
        this.hightCoef=hightCoef // tree hight controller
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
            point.draw(ctx, { size,color });
            
        }
        
    }
}