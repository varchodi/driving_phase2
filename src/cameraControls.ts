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
    tempCanvas: HTMLCanvasElement;
    tmpCtx: CanvasRenderingContext2D;
    initializing: boolean;
    expectedSize: any;
    constructor(public canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d')!;
        if (this.ctx == null) alert("cotext error");
        this.tempCanvas = document.createElement("canvas");
        this.tmpCtx = this.tempCanvas.getContext("2d")!;
        this.tilt = 0;
        this.forward = true;
        this.reverse = false;

        // init 
        this.initializing = true;
        this.expectedSize = 0;

        this.markerDetector = new Markerdetector();

        navigator.mediaDevices.getUserMedia({ video: true })
            .then((rawdata) => {
                this.video = document.createElement("video");
                this.video.srcObject = rawdata;
                this.video.play();
                this.video.onloadeddata = () => {
                    this.canvas.width = this.video.videoWidth / 4;
                    this.canvas.height = this.video.videoHeight / 4;
                    this.tempCanvas.width = this.canvas.width;
                    this.tempCanvas.height = this.canvas.height;
                    this.loop();
                }
            }).catch((err) => { alert(err) });
        
        this.canvas.addEventListener("wheel", (event: WheelEvent) => {
            this.markerDetector.updateThreshhold(-Math.sin(event.deltaY))
        })
    }

    private processMarkers({ leftMarker, rightMarker }: DetectType) {
        // get tilt
        this.tilt = Math.atan2(rightMarker.centroid.y - leftMarker.centroid.y, rightMarker.centroid.x - leftMarker.centroid.x);

        if (this.initializing) {
            this.expectedSize = (leftMarker.radius + rightMarker.radius) / 2;
            
        }
        const size = (leftMarker.radius + rightMarker.radius) / 2;
        if (size < this.expectedSize * .85) {
            this.forward = false;
            this.reverse = true;
        } else {
            this.reverse = false;
            this.forward = true;
        }

        const wheelCenter = average(
            new Point(leftMarker.centroid.x, leftMarker.centroid.y),
            new Point(rightMarker.centroid.x, rightMarker.centroid.y)
        );

        const wheelRadius = distance(wheelCenter, new Point(leftMarker.centroid.x, leftMarker.centroid.y));


        this.ctx.beginPath();
        this.ctx.fillStyle = this.forward ?"blue":'red';
        this.ctx.arc(wheelCenter.x, wheelCenter.y, wheelRadius, 0, Math.PI * 2);
        this.ctx.fill();


    }

    private loop() {
        setTimeout(() => {
            this.initializing = false;
            
        },3000)

        this.ctx.save();
        this.ctx.translate(this.canvas.width, 0);
        this.ctx.scale(-1, 1);

        this.ctx.drawImage(this.video, 0, 0, this.canvas.width, this.canvas.height);
        this.ctx.restore();

        const imgData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
        const result = this.markerDetector.detect(imgData);//get data from canvas
        if (result) {
            this.processMarkers(result);

            for (let i = 0; i < imgData.data.length; i+=4) {
                imgData.data[i + 3] = 0;
            }

            for (const point of [...result.leftMarker.points, ...result.rightMarker.points]) {
                const index = (point.y * imgData.width + point.x) * 4;
                imgData.data[index + 3] = 255;
            }

            this.tmpCtx.putImageData(imgData, 0, 0);
            this.ctx.drawImage(this.tempCanvas , 0, 0);

        }
        requestAnimationFrame(() => this.loop());

    }
}