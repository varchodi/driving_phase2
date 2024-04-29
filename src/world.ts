import { Graph } from "./math/graph";
import { add, scale } from "./math/utils";
import { Envelope } from "./primitives/envelope";
import { Polygon } from "./primitives/polygon";
import { Segment } from "./primitives/segment";

export class World{
    private envelopes: Envelope[];
    private roadBoarders:Segment[] = [];
    private buildings: any[];
    constructor(public graph: Graph, private roadWidth: number = 100, public roadRoundness: number = 10,public buildingWidth:number=150,public buildingMinLength:number=150,public spacing =50) {
        this.graph = graph;
        this.roadWidth = roadWidth;
        this.roadRoundness = roadRoundness;
        
        this.buildingWidth = buildingWidth;
        this.buildingMinLength = buildingMinLength;
        this.spacing = spacing;

        this.envelopes = [];
        this.roadBoarders = [];
        this.buildings = [];        

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
        this.buildings = this.generateBuildings();
    }

    //building generator
    private generateBuildings():Segment[] {
        const tmpEnvelopes = [];
        for (const seg of this.graph.segments) {
            tmpEnvelopes.push(
                new Envelope(
                    seg,
                    this.roadWidth + this.buildingWidth + this.spacing * 2,
                    this.roadRoundness
                )
            )
        }

        const guides = Polygon.union(tmpEnvelopes.map(e => e.poly));

        for (let i = 0; i < guides.length; i++){
            const seg = guides[i];
            if (seg.length() < this.buildingMinLength) {
                guides.splice(i, 1);
                i--;
            }
        }

        const supports = [];
        for (const seg of guides) {
            const len = seg.length() + this.spacing;
            const buildingCount = Math.floor(
                len / (this.buildingMinLength + this.spacing)
            );

            const buildingLength = len / buildingCount - this.spacing;
            
            const dir = seg.directionVector();

            let q1 = seg.p1;
            let q2 = add(q1, scale(dir, buildingLength));
            supports.push(new Segment(q1, q2));
        }

        return supports;
    }

    draw(ctx: CanvasRenderingContext2D) {
        for (const env of this.envelopes) {
            env.draw(ctx,{fill:"#bbb",stroke:"#bbb",lineWidth:15});
        }

        //draw middle line of the road
        for (const seg of this.graph.segments) {
            seg.draw(ctx, { color: "white", width: 4, dash: [10, 10] });
        }

        for (const seg of this.roadBoarders) {
            seg.draw(ctx,{color:"white",width:4});
        }

        //display building enveloppes
        for (const bld of this.buildings) {
            bld.draw(ctx);
        }

    }
}