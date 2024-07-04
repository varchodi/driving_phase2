import { Markerdetector } from "./marker/merkerDetector";

export class CameraControls{
    ctx: CanvasRenderingContext2D;
    tilt: number;
    forward: boolean;
    reverse: boolean;
    markerDetector: Markerdetector;
    public video: HTMLVideoElement=null!;
    constructor(public canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d')!;
        this.tilt = 0;
        this.forward = true;
        this.reverse = false;

        this.markerDetector = new Markerdetector();

        navigator.mediaDevices.getUserMedia({ video: true })
            .then((rawdata) => {
                this.video = document.createElement("video");
                this.video.srcObject = rawdata;
                this.video.play();
                this.video.onloadeddata = () => {
                    this.canvas.width = this.video.videoWidth;
                    this.canvas.height = this.video.videoHeight;
                    this.loop();
                }
        })
    }

    private loop() {
        
    }
}