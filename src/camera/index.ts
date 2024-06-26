// const myCanvas = document.getElementById("soundVis") as HTMLCanvasElement;
// const ctx = myCanvas.getContext('2d') as CanvasRenderingContext2D;

import Car from "../car";
import { carCtx } from "../race";
import { Point } from "../world/primitives/point";
import { Polygon } from "../world/primitives/polygon";
import { World } from "../world/world";


export default class Camera {
    public x: number = null!;
    public y: number = null!;
    public z: number = null!;
    public angle: number = null!;
    public range: number;
    public center: Point = null!;
    public tip: Point = null!;
    public left: Point = null!;
    public right: Point = null!;
    public poly: Polygon = null!;
    
    constructor({x,y,angle}:Car,range=100) {
        this.range = range;
        this.move({ x, y, angle } as Car);
    }

    public move({ x, y, angle }: Car) {
        this.x = x;
        this.y=y;
        this.z = -20;
        this.angle = angle;
        this.center = new Point(this.x, this.y);
        this.tip = new Point(
            this.x - this.range * Math.sin(this.angle),
            this.y -this.range * Math.cos(this.angle)
        )
        this.left = new Point(
            this.x - this.range * Math.sin(this.angle - Math.PI / 4),
            this.y -this.range * Math.cos(this.angle - Math.PI / 4)
        )
        this.right = new Point(
            this.x - this.range * Math.sin(this.angle + Math.PI / 4),
            this.y -this.range * Math.cos(this.angle + Math.PI / 4)
        )

        this.poly = new Polygon([this.center,this.left,this.right])
    }

    public render(ctx: CanvasRenderingContext2D, world: World) {
        // get buildings bases
        const polys = world.buildings.map((b) => b.base);
        for (const poly of polys) {
            poly.draw(carCtx);
        }
    }

    public draw(ctx: CanvasRenderingContext2D) {
        this.poly.draw(ctx);
    }
}

