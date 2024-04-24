import { Graph } from "./math/graph";
import { Envelope } from "./primitives/envelope";
import { Point } from "./primitives/point";
import { Polygon } from "./primitives/polygon";

export class World{
    private envelopes: Envelope[];
    private intersections: Point[]=[];

    constructor(public graph: Graph, public roadWidth: number = 100, public roadRoundness: number = 3) {
        this.graph = graph;
        this.roadWidth = roadWidth;
        this.roadRoundness = roadRoundness;

        this.envelopes = [];
        this.generate();
    }

    generate() {
        this.envelopes.length = 0;
        for (const seg of this.graph.segments) {
            this.envelopes.push(
                new Envelope(seg,this.roadWidth,this.roadRoundness)
            )
        }

        Polygon.multiBreak(this.envelopes.map((e) => e.poly));
    }

    draw(ctx: CanvasRenderingContext2D) {
        for (const env of this.envelopes) {
            env.draw(ctx);
        }

    }
}