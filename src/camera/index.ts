// const myCanvas = document.getElementById("soundVis") as HTMLCanvasElement;
// const ctx = myCanvas.getContext('2d') as CanvasRenderingContext2D;

import Car from "../car";
import { Point } from "../world/primitives/point";


export default class Camera {
    public x: number;
    public y: number;
    public z: number;
    public angle: number;
    public center: Point;

    constructor({x,y,angle}:Car) {
        this.x = x;
        this.y=y;
        this.z = -20;
        this.angle = angle;
        this.center = new Point(this.x, this.y);
    }

    public draw(ctx: CanvasRenderingContext2D) {
        // camera place
        this.center.draw(ctx, { color: 'red' });
    }
}

