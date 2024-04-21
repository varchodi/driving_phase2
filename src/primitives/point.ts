export class Point{
    public x:number;
    public y: number;
    constructor(x: number, y: number) {
        this.x = x;
        this.y = y;
    }

    //!! check if 2 points are the same
    equals(point: Point):boolean {
        return this.x==point.x && this.y == this.y
    }

    draw  (ctx: CanvasRenderingContext2D,size:number=18, color: string = "black"){
        const radius = size / 2;
        ctx.beginPath();
        ctx.fillStyle = color;
        ctx.arc(this.x, this.y, radius, 0, Math.PI * 2);
        ctx.fill();
    }
}