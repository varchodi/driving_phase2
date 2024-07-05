import { Markerdetector } from "./marker/merkerDetector";
import { average, distance } from "./world/math/utils";
import { Point } from "./world/primitives/point";
export type DetectType = {
    leftMarker: {
        centroid: {
            x: number;
            y: number;
            blueness: number;
        };
        points: {
            x: number;
            y: number;
            blueness: number;
        }[];
        radius: number;
    };
    rightMarker: {
        centroid: {
            x: number;
            y: number;
            blueness: number;
        };
        points: {
            x: number;
            y: number;
            blueness: number;
        }[];
        radius: number;
    };
}

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
        if (this.ctx==null) alert("cotext error");
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
                    this.canvas.width = this.video.videoWidth/4;
                    this.canvas.height = this.video.videoHeight/4;
                    this.loop();
                }
        }).catch((err)=>{alert(err)})
    }

    private processMarkers({ leftMarker, rightMarker }: DetectType) {
        // get tilt
        this.tilt = Math.atan2(rightMarker.centroid.y - leftMarker.centroid.y, rightMarker.centroid.x - leftMarker.centroid.x);

        const wheelCenter = average(
            new Point(leftMarker.centroid.x, leftMarker.centroid.y),
            new Point(rightMarker.centroid.x, rightMarker.centroid.y)
        );

        const wheelRadius = distance(wheelCenter, new Point(leftMarker.centroid.x, leftMarker.centroid.y));


        this.ctx.beginPath();
        this.ctx.fillStyle = 'red';
        this.ctx.arc(wheelCenter.x, wheelCenter.y, wheelRadius, 0, Math.PI * 2);
        this.ctx.fill();

        // this.ctx.beginPath();
        // this.ctx.fillStyle = 'yellow';
        // this.ctx.arc(rightMarker.centroid.x, rightMarker.centroid.y, 20, 0, Math.PI * 2);
        // this.ctx.fill();

    }

    private loop() {
        this.ctx.save();
        this.ctx.translate(this.canvas.width, 0);
        this.ctx.scale(-1, 1);

        this.ctx.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height);
        this.ctx.restore();

        const imgData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        const result = this.markerDetector.detect(imgData);//get data from canvas
        if (result) {
            this.processMarkers(result);
        }
        requestAnimationFrame(() => this.loop());

    }
}