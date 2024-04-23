import { Point } from "./primitives/point";

export class Viewport{
    private ctx: CanvasRenderingContext2D;
    public zoom: number;

    constructor(public canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d")!;

        this.zoom = 1;

        this.addEventsListeners();
    }

    //getmouse info,with scaling applied
    getMouse(evt: MouseEvent) {
        return new Point(
            evt.offsetX * this.zoom,
            evt.offsetY* this.zoom
        )
    }

    private addEventsListeners() {
        this.canvas.addEventListener("wheel", this.handleMouseWheel.bind(this));
    }

    private handleMouseWheel = (evt: WheelEvent)=>{
        const dir = Math.sign(evt.deltaY);
        const step = 0.1;
        this.zoom += dir * step;
        this.zoom = Math.max(1, Math.min(5, this.zoom));
    }
}