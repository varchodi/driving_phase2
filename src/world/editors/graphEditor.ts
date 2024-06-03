import { Graph } from "../math/graph";
import { Point } from "../primitives/point";
import { getNearestPoint } from "../math/utils";
import { Segment } from "../primitives/segment";
import { Viewport } from "../viewport";

export class GraphEditor{
    private ctx: CanvasRenderingContext2D;
    private selected: Point | null;
    private hovered: Point|null;
    private dragging: boolean;
    private mouse: Point | null; 
    public canvas: HTMLCanvasElement;
    private boundMouseDown:any;
    private boundMousemove: any;
    private boundMouseup: any;
    private boundContextMenu: any;
    public start: Point = null!;
    public end: Point = null!;

    constructor(public viewport:Viewport, public graph: Graph) {
        this.viewport=viewport;
        this.graph = graph;
        this.canvas = viewport.canvas;
        this.ctx = this.canvas.getContext("2d")!;
        this.selected = null;
        this.hovered = null;
        this.dragging = false;
        this.mouse = null;

        
    }

    public enable() {
        this.addEventsListeners();
    }

    public disable() {
        this.removeEventsListeners();
        this.selected = null;
        this.hovered = null;
    }

    private addEventsListeners() {
        this.boundMouseDown = this.handleMouseDouwn.bind(this);
        this.boundMousemove = this.handleMouseMouve.bind(this);
        this.boundMouseup = () => this.dragging = false
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
        
        this.canvas.removeEventListener("mouseup", this.boundMouseup);

        //?? events for selecting end  or start point on path stuff
        window.addEventListener("keydown", (evt: KeyboardEvent) => {
            if (this.hovered) {
                if(evt.key=="s"){
                    this.start = this.hovered;
                }

                if(evt.key=="e"){
                    this.end = this.hovered;
                }
            }
        })
    }


    //Mouse mouve action handleler
    private handleMouseMouve(evt:MouseEvent) {
        this.mouse = this.viewport.getMouse(evt,true);
            this.hovered = getNearestPoint(this.mouse, this.graph.points,10*this.viewport.zoom);
            
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

    //clear
    dispose() {
        this.graph.dispose();
        this.selected = null;
        this.hovered = null;
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

        //?? calculate shorted path n draw it
        if (this.start && this.end) {
            const path = this.graph.getShortestPath(
                this.start, this.end
            )
        
    
            for (const point of path) {
                point.draw(this.ctx, { size: 50, color: "blue" })
                if (point.prev) {
                    new Segment(point, point.prev).draw(this.ctx, { width: 20 });
                }
            }
        }
    }

}