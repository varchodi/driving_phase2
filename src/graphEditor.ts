import { Graph } from "./math/graph";
import { Point } from "./primitives/point";
import { getNearestPoint } from "./math/utils";
import { Segment } from "./primitives/segment";

export class GraphEditor{
    private ctx: CanvasRenderingContext2D;
    private selected: Point | null;
    private hovered: Point|null;
    private dragging: boolean;
    private mouse: Point | null; 

    constructor(public canvas: HTMLCanvasElement, public graph: Graph) {
        this.canvas = canvas;
        this.graph = graph;
        this.ctx = this.canvas.getContext("2d")!;
        this.selected = null;
        this.hovered = null;
        this.dragging = false;
        this.mouse = null;
        
        //init events listeners
        this.addEventsListeners();
    }


    private addEventsListeners() {
        //use .bind(this) to make graphEditor object accessible in the function 
        this.canvas.addEventListener("mousedown", this.handleMouseDouwn.bind(this))

        this.canvas.addEventListener("mousemove", this.handleMouseMouve.bind(this));

        //??context menu ??
        this.canvas.addEventListener("contextmenu", (evt: MouseEvent) => {
            evt.preventDefault();
        })
        
        this.canvas.addEventListener("mouseup", () => {
            this.dragging = false;
        })
    }

    //Mouse mouve action handleler
    private handleMouseMouve(evt:MouseEvent) {
        this.mouse = new Point(evt.offsetX, evt.offsetY);
            this.hovered = getNearestPoint(this.mouse, this.graph.points,10);
            
            if (this.dragging && this.selected) {
                this.selected.x = this.mouse.x!;
                this.selected.y = this.mouse.y!;
            }
    }

    //mouse down action
    private handleMouseDouwn(evt: MouseEvent) {
        //Right click
        if (evt.button == 2) {
            if (this.selected) {
                this.selected = null;
            } else if (this.hovered) {
                this.removePoint(this.hovered);
            }
        }

        //??Left click
        if (evt.button == 0) {
            
            //?? if point where clicked ?; we hover on it , if not create a new one
            if (this.hovered) {
                //?? add segment with existing points too 
                this.selectPoint(this.hovered);

                //!! gragable
                this.dragging = true;
                return;
            }
            this.graph.addPoint(this.mouse!);

            //!! if the is a previous selected point 
            this.selectPoint(this.mouse!);
            this.hovered = this.mouse;
        }
    }


    //select point
    private selectPoint(point: Point) {
        if (this.selected) {
            this.graph.tryAddSegment(new Segment(this.selected, point));
        }
        
        this.selected = point;
    }

    private removePoint(point: Point) {
        this.graph.removePoint(point);
        this.hovered = null;
        if (this.selected == point) {
            this.selected = null;
        }
    }

    display() {
        this.graph.draw(this.ctx);

        if (this.hovered) {
            this.hovered.draw(this.ctx, { fill: true });
        }

        if (this.selected) {
            const intent = this.hovered ? this.hovered : this.mouse;
            new Segment(this.selected, intent!).draw(this.ctx,{dash:[3,3]});
            this.selected.draw(this.ctx, { outline: true });
        }
    }
}