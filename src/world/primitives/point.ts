export class Point{
    public x:number;
    public y: number;
    public id?: number;
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    //!! check if 2 points are the same
    equals(point: Point):boolean {
        return this.x==point.x && this.y == this.y
    }

    draw(ctx: CanvasRenderingContext2D, { size = 18, color = "black", outline = false,fill=false }:{size?:number,color?:string,outline?:boolean,fill?:boolean} = {}){
        const radius = size / 2;
        ctx.beginPath();
        ctx.fillStyle = color;
        ctx.arc(this.x, this.y, radius, 0, Math.PI * 2);
        ctx.fill();

        if (outline) {
            ctx.beginPath();
            ctx.lineWidth = 2;
            ctx.strokeStyle = "yellow";
            ctx.arc(this.x, this.y, radius * .6, 0, Math.PI * 2);
            ctx.stroke();
        }

        if (fill) {
            ctx.beginPath();
            ctx.arc(this.x, this.y, radius * .4, 0, Math.PI * 2);
            ctx.fillStyle = "yellow";
            ctx.fill();
        }
    }
}