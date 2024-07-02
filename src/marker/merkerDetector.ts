import { distance } from ".";

export class Markerdetector{
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D ;
    threshold: HTMLInputElement;
    constructor() { 
        this.canvas = document.createElement('canvas')!;
        this.ctx = this.canvas.getContext('2d')!;
        this.threshold = document.createElement('input')!;
        this.threshold.type = 'range';
        this.threshold.min = '0';
        this.threshold.max = '255';
        this.threshold.value = '40';
        document.body.appendChild(this.canvas);
        document.body.appendChild(this.threshold);
    }

    // average points (find center point)
    private averagePoints(points:{x: number;y: number;blueness: number}[]) {
        const center = { x: 0, y: 0 };
        for (const point of points) {
            center.x += point.x;
            center.y += point.y;
        }
        center.x /= points.length;
        center.y /= points.length;

        return center;
    }
    
    public detect(imgData: ImageData) {
        const points = [];

        // ?? i+=4 (pixel by pixel)
        for (let i = 0; i < imgData.data.length; i += 4){
            const r = imgData.data[i + 0];
            const g = imgData.data[i + 1];
            const b = imgData.data[i + 2];
            
            // mesure bleness
            const blueness = b - Math.max(r, g);
            if (blueness > parseInt(this.threshold.value)) {
                const pIndex = i / 4;
                const y = Math.floor(pIndex / imgData.width);
                const x = pIndex % imgData.width;

                //loc x,loc y ,blueness
                points.push({x,y,blueness});
            }
        }
        const first = points[0];
        const last = points[points.length - 1];

        const group1 = points.filter((p) => distance(p, first) < distance(p, last));

        //!!center point
        const centroid1 = this.averagePoints(group1);
        //??find point measure
        const size1 = Math.sqrt(group1.length);
        const radius1 = size1 / 2;

        this.canvas.width = imgData.width;
        this.canvas.height = imgData.height +255;

        for (const point of points) {
            this.ctx.globalAlpha=point.blueness/255 
            this.ctx?.fillRect(point.x, point.y, 1, 1);
        }

        //reset transparence
        this.ctx.globalAlpha = 1;

        // ?? draw a circle on  center blue points
        this.ctx.arc(centroid1.x, centroid1.y, radius1,0, Math.PI * 2);
        this.ctx.stroke();
        

        this.ctx.translate(0, imgData.height);

        points.sort((a, b) => b.blueness - a.blueness);

        // small chart of blue points 
        for (let i = 0; i < points.length; i++){
            const y = points[i].blueness;
            const x = this.canvas.width * i / points.length;
            this.ctx.fillRect(x, y, 1, 1);
        }
    }
}