import { Graph } from "./math/graph";
import { Envelope } from "./primitives/envelope";
import { Point } from "./primitives/point";
import { Polygon } from "./primitives/polygon";
import { Segment } from "./primitives/segment";

export class World{
    private envelopes: Envelope[];
    private intersections: Point[] = [];
    private roadBoarders:Segment[] = [];

    constructor(public graph: Graph, public roadWidth: number = 100, public roadRoundness: number = 10) {
        this.graph = graph;
        this.roadWidth = roadWidth;
        this.roadRoundness = roadRoundness;
        this.envelopes = [];

        this.roadBoarders = [];
        this.generate();
    }

    generate() {
        this.envelopes.length = 0;
        for (const seg of this.graph.segments) {
            this.envelopes.push(
                new Envelope(seg,this.roadWidth,this.roadRoundness)
            )
        }

        this.roadBoarders=Polygon.union(this.envelopes.map((e) => e.poly));
    }

    draw(ctx: CanvasRenderingContext2D) {
        for (const env of this.envelopes) {
            env.draw(ctx,{fill:"#bbb",stroke:"#bbb"});
        }

        for (const seg of this.roadBoarders) {
            seg.draw(ctx,{color:"white",width:4});
        }

    }
}