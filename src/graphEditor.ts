import { Graph } from "./math/graph";
import { Point } from "./primitives/point";
import { getNearestPoint } from "./math/utils";
import { Segment } from "./primitives/segment";

export class GraphEditor{
    private ctx: CanvasRenderingContext2D;
    private selected: Point | null;
    private hovered: Point|null;
    private dragging: boolean;

    constructor(public canvas: HTMLCanvasElement, public graph: Graph) {
        this.canvas = canvas;
        this.graph = graph;
        this.ctx = this.canvas.getContext("2d")!;
        this.selected = null;
        this.hovered = null;
        this.dragging = false;

        //init events listeners
        this.addEventsListeners();
    }


    private addEventsListeners() {
        this.canvas.addEventListener("mousedown", (evt: MouseEvent) => {
            
            //Right click
            if (evt.button == 2) {
                if (this.hovered) {
                    this.removePoint(this.hovered);
                }
            }

            //??Left click
            if (evt.button == 0) {
                const mouse = new Point(evt.offsetX, evt.offsetY);
                //?? if point where clicked ?; we hover on it , if not create a new one
                if (this.hovered) {
                    //?? add segment with existing points too 
                    if (this.selected) {
                        this.graph.tryAddSegment(new Segment(this.selected, this.hovered));
                    }

                    this.selected = this.hovered;

                    //!! gragable
                    this.dragging = true;
                    return;
                }
                this.graph.addPoint(mouse);

                //!! if the is a previous selected point 
                if (this.selected) {
                    this.graph.tryAddSegment(new Segment(this.selected, mouse));
                }
                
                this.selected = mouse;
                this.hovered = mouse;
            }
        })

        this.canvas.addEventListener("mousemove", (evt: MouseEvent) => {
            const mouse = new Point(evt.offsetX, evt.offsetY);
            this.hovered = getNearestPoint(mouse, this.graph.points,10);
            
            if (this.dragging && this.selected) {
                this.selected.x = mouse.x!;
                this.selected.y = mouse.y!;
            }
        })

        //??context menu ??
        this.canvas.addEventListener("contextmenu", (evt: MouseEvent) => {
            evt.preventDefault();
        })

        this.canvas.addEventListener("mouseup", () => {
            this.dragging = false;
        })
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
            console.log("drawing")
            this.hovered.draw(this.ctx, { fill: true });
        }

        if (this.selected) {
            this.selected.draw(this.ctx, { outline: true });
        }
    }
}