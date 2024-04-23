export class Viewport{
    private ctx: CanvasRenderingContext2D;
    private zoom: number;

    constructor(public canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d")!;

        this.zoom = 1;

        this.addEventsListeners();
    }

    private addEventsListeners() {
        
    }
}