export class Markerdetector{
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D ;
    constructor() { 
        this.canvas = document.createElement('canvas')!;
        this.ctx = this.canvas.getContext('2d')!;
        document.body.appendChild(this.canvas);
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
            if (blueness > 0) {
                const pIndex = i / 4;
                const y = Math.floor(pIndex / imgData.width);
                const x = pIndex % imgData.width;

                //loc x,loc y ,blueness
                points.push({x,y,blueness});
            }
        }

        this.canvas.width = imgData.width;
        this.canvas.height = imgData.height +255;

        for (const point of points) {
            this.ctx.globalAlpha=point.blueness/255 
            this.ctx?.fillRect(point.x, point.y, 1, 1);
        }

        //reset transparence
        this.ctx.globalAlpha = 1;
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