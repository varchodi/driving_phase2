import { Stop } from "../markings/stop";
import { getNearestSegment } from "../math/utils";
import { Point } from "../primitives/point";
import { Viewport } from "../viewport";
import { World } from "../world";

export class StopEditor{
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private boundMouseDown:any;
    private boundMousemove: any;
    private boundMouseup: any;
    private boundContextMenu: any;
    private mouse: Point | null; 
    private intent: Stop | null;
    public markings: typeof this.world.markings ;

    constructor(private viewport: Viewport, private world: World) {
        this.viewport = viewport;
        this.world = world;

        this.canvas = viewport.canvas;
        this.ctx = this.canvas.getContext("2d")!;

        this.mouse = null;
        this.intent = null;

        this.markings = this.world.markings;;
    }

    public enable() {
        this.addEventsListeners();
    }

    public disable() {
        this.removeEventsListeners();
    }

    private addEventsListeners() {
        this.boundMouseDown = this.handleMouseDouwn.bind(this);
        this.boundMousemove = this.handleMouseMouve.bind(this);
        this.boundContextMenu = (evt: MouseEvent) => evt.preventDefault();

        this.canvas.addEventListener("mousedown", this.boundMouseDown)
        this.canvas.addEventListener("mousemove", this.boundMousemove);

        //??context menu ??
        this.canvas.addEventListener("contextmenu",this.boundContextMenu )
        
        this.canvas.addEventListener("mouseup", this.boundMouseup)
    }

    private removeEventsListeners() {
        this.canvas.removeEventListener("mousedown", this.boundMouseDown);
        this.canvas.removeEventListener("mousemove", this.boundMousemove);
        this.canvas.removeEventListener("contextmenu", this.boundContextMenu);
    }

    //Mouse mouve action handleler
    private handleMouseMouve(evt:MouseEvent) {
        this.mouse = this.viewport.getMouse(evt,true);
            const seg = getNearestSegment(this.mouse, this.world.laneGuides,10*this.viewport.zoom);
            
        if (seg) {
            const proj = seg.projectPoint(this.mouse);
            if (proj.offset >= 0 && proj.offset <= 1) {
                this.intent = new Stop(
                    proj.point,
                    seg.directionVector(),
                    this.world.roadWidth/2,
                    this.world.roadWidth/2
                );
            } else {
                this.intent = null;
            }
        } else {
            this.intent = null;
        }
    }

    private handleMouseDouwn(evt:MouseEvent) {
        //left click
        if (evt.button == 0) {
            if (this.intent) {
                this.markings.push(this.intent);
                this.intent = null;
            }
        }
        //remove on right click
        if (evt.button == 2) {
            for (let i = 0; i < this.markings.length; i++){
                const poly = this.markings[i].poly;
                if (poly.containsPoint(this.mouse!)) {
                    this.markings.splice(i, 1);
                    return;
                }
            }
        }
    }

    public display() {
        if (this.intent) {
            this.intent.draw(this.ctx);
        }
    }
}