// const myCanvas = document.getElementById("soundVis") as HTMLCanvasElement;
// const ctx = myCanvas.getContext('2d') as CanvasRenderingContext2D;

import Car from "../car";
import { carCtx } from "../race";
import { cross, distance, substract } from "../world/math/utils";
import { Point } from "../world/primitives/point";
import { Polygon } from "../world/primitives/polygon";
import { Segment } from "../world/primitives/segment";
import { World } from "../world/world";


export default class Camera {
    public x: number = null!;
    public y: number = null!;
    public z: number = null!;
    public angle: number = null!;
    public range: number;
    public center: Point = null!;
    public tip: Point = null!;
    public left: Point = null!;
    public right: Point = null!;
    public poly: Polygon = null!;
    
    constructor({x,y,angle}:Car,range=1000) {
        this.range = range;
        this.move({ x, y, angle } as Car);
    }

    public move({ x, y, angle }: Car) {
        this.x = x;
        this.y=y;
        this.z = -20;
        this.angle = angle;
        this.center = new Point(this.x, this.y);
        this.tip = new Point(
            this.x - this.range * Math.sin(this.angle),
            this.y -this.range * Math.cos(this.angle)
        )
        this.left = new Point(
            this.x - this.range * Math.sin(this.angle - Math.PI / 4),
            this.y -this.range * Math.cos(this.angle - Math.PI / 4)
        )
        this.right = new Point(
            this.x - this.range * Math.sin(this.angle + Math.PI / 4),
            this.y -this.range * Math.cos(this.angle + Math.PI / 4)
        )

        this.poly = new Polygon([this.center,this.left,this.right])
    }

    private projectPoint(ctx: CanvasRenderingContext2D, p: Point):Point {
        const seg = new Segment(this.center, this.tip);
        const { point: p1 } = seg.projectPoint(p);
        const c = cross(substract(p1, new Point(this.x, this.y)), substract(p, new Point(this.x, this.y)));
        const x =Math.sign(c)* distance(p, p1) / distance(new Point(this.x, this.y), p1);
        const y = (p.z - this.z) / distance(new Point(this.x, this.y), p1);

        const cX = ctx.canvas.width / 2;
        const cY = ctx.canvas.height / 2;
        const scaler = Math.max(cX, cY);

        return new Point(cX + x * scaler, cY + y * scaler);
    }

    private filter(polys: Polygon[]):Polygon[] {
        const filteredPolys = [];
        for (const poly of polys) {
            if (!this.poly.containsPoly(poly)) {
                continue;
            }
            if (poly.intersectPoly(this.poly)) {
                const copy1 = new Polygon(poly.points);
                const copy2 = new Polygon(this.poly.points);
                Polygon.break(copy1, copy2,true);
                const points = copy1.segments.map((s) => s.p1);
                const filteredPoints = points.filter((p) => p.intersection || this.poly.containsPoint(p));
                filteredPolys.push(new Polygon(filteredPoints));
            } else {
                filteredPolys.push(poly);
            }
        }
        return filteredPolys;
    }

    private extrude(polys: Polygon[], height = 10) {
        const extrudePolys =[];
        for (const poly of polys) {
            const ceiling = new Polygon(
                poly.points.map((p) => new Point(p.x, p.y, -height))
            );
            extrudePolys.push(poly, ceiling);
        }
        return extrudePolys;
    }

    public render(ctx: CanvasRenderingContext2D, world: World) {
        // get buildings bases
        const polys =this.extrude(this.filter( world.buildings.map((b) => b.base)));

        const projPolys = polys.map((poly) => new Polygon(
            poly.points.map((p)=>this.projectPoint(ctx,p))
        ))

        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);

        for (const poly of projPolys) {
            poly.draw(ctx);
        }

        for (const poly of polys) {
            poly.draw(carCtx);
        }
    }

    public draw(ctx: CanvasRenderingContext2D) {
        this.poly.draw(ctx);
    }
}

