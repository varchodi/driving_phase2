import { Point } from "./primitives/point";
import {add,substract,scale} from "./math/utils"
export class Viewport{
    private ctx: CanvasRenderingContext2D;
    public zoom: number;
    public center: Point;
    private drag : {
        start: Point,
        end: Point,
        offset: Point,
        active:boolean
    }

    public offset: Point; //point to whic scaling(zoom) will be focused
    constructor(public canvas: HTMLCanvasElement) {
        this.canvas = canvas;
        this.ctx = canvas.getContext("2d")!;

        this.zoom = 1;
        this.center = new Point(canvas.width / 2, canvas.height / 2);//default center
        this.offset = scale(this.center,-1)//default offsetp
        
        this.drag = {
            start: new Point(0, 0),
            end: new Point(0, 0),
            offset: new Point(0, 0),
            active: false
        }

        this.addEventsListeners();
    }

    //getmouse info,with scaling applied
    getMouse(evt: MouseEvent) {
        return new Point(
            evt.offsetX * this.zoom,
            evt.offsetY* this.zoom
        )
    }

    getOffset():Point {
        return add(this.offset,this.drag.offset)
    }

    private addEventsListeners() {
        this.canvas.addEventListener("wheel", this.handleMouseWheel.bind(this));
        this.canvas.addEventListener("mousedown", this.handleMouseDown.bind(this));
        this.canvas.addEventListener("mousemove", this.handleMouseMouve.bind(this));
        this.canvas.addEventListener("mouseup", this.handleMouseUp.bind(this));
    }

    private handleMouseDown(evt: MouseEvent) {
        if (evt.button == 1) {
            //moddle button
            this.drag.start = this.getMouse(evt);
            this.drag.active = true;
        }
    }

    private handleMouseMouve(evt: MouseEvent) {
        if(this.drag.active){
            this.drag.end = this.getMouse(evt);
            this.drag.offset = substract(this.drag.start, this.drag.end);
        }
    }

    private handleMouseUp(evt: MouseEvent) {
        if (this.drag.active) {
            this.offset = add(this.offset, this.drag.offset);
            //reset 
            this.drag = {
                start: new Point(0, 0),
                end: new Point(0, 0),
                offset: new Point(0, 0),
                active: false
            }
        }
    }

    private handleMouseWheel = (evt: WheelEvent)=>{
        const dir = Math.sign(evt.deltaY);
        const step = 0.1;
        this.zoom += dir * step;
        this.zoom = Math.max(1, Math.min(5, this.zoom));
    }
}