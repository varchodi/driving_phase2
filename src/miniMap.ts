import { Graph } from "./world/math/graph";
import { scale } from "./world/math/utils";
import { Point } from "./world/primitives/point";

export class MiniMap{
    ctx: CanvasRenderingContext2D;
    constructor(private canvas: HTMLCanvasElement, private graph: Graph, public size: number) {
        this.canvas = canvas;
        this.graph = graph;
        this.size = size;

        canvas.width = size;
        canvas.height = size;
        this.ctx = canvas.getContext("2d")!;
    }

    public update(viewPoint: Point) {
        this.ctx.clearRect(0, 0, this.size, this.size);

        const scaler = 0.05;
        const  scaleViewPoint = scale(viewPoint, -scaler);
        //?? consider viewpoint
        this.ctx.save();
        this.ctx.translate(
            scaleViewPoint.x + this.size /2 ,
            scaleViewPoint.y + this.size /2 
        );
        this.ctx.scale(scaler, scaler);
        for (const seg of this.graph.segments) {
            seg.draw(this.ctx, { width: 3/scaler,color:"white"});
        }
        this.ctx.restore();

        //?? map center => wich is also the car
        new Point(this.size / 2, this.size / 2).draw(this.ctx,{color:"blue",outline:true});
    }
}