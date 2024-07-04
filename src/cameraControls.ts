import { Markerdetector } from "./marker/merkerDetector";

export class CameraControls{
    ctx: CanvasRenderingContext2D;
    tilt: number;
    forward: boolean;
    reverse: boolean;
    markerDetector: Markerdetector;
    constructor(public canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d')!;
        this.tilt = 0;
        this.forward = true;
        this.reverse = false;

        this.markerDetector = new Markerdetector();
    }
}