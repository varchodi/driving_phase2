import { Crossing } from "../markings/crossing";
import { Stop } from "../markings/stop";
import { getNearestSegment } from "../math/utils";
import { Point } from "../primitives/point";
import { Segment } from "../primitives/segment";
import { Viewport } from "../viewport";
import { World } from "../world";

export class MarkingEditor{
    public canvas: HTMLCanvasElement;
    public ctx: CanvasRenderingContext2D;
    public boundMouseDown:any;
    public boundMousemove: any;
    public boundMouseup: any;
    public boundContextMenu: any;
    public mouse: Point | null; 
    public intent: Stop |Point|Crossing| null;
    public markings: typeof this.world.markings ;

    constructor(public viewport: Viewport, public world: World,public targetSegment:Segment[]) {
        this.viewport = viewport;
        this.world = world;

        this.canvas = viewport.canvas;
        this.ctx = this.canvas.getContext("2d")!;

        this.mouse = null;
        this.intent = null;

        this.targetSegment = targetSegment;

        this.markings = this.world.markings;;
    }

    //overwritten in subclasses
    public createMarking(center: Point, directionVector: Point):any {
        return center
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
            const seg = getNearestSegment(this.mouse, this.targetSegment,10*this.viewport.zoom);
            
        if (seg) {
            const proj = seg.projectPoint(this.mouse);
            if (proj.offset >= 0 && proj.offset <= 1) {
                this.intent = this.createMarking(
                    proj.point,
                    seg.directionVector()
                )
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