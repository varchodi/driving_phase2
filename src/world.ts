import { Graph } from "./math/graph";
import { add, distance, lerp, scale } from "./math/utils";
import { Envelope } from "./primitives/envelope";
import { Polygon } from "./primitives/polygon";
import { Segment } from "./primitives/segment";
import { Point } from "./primitives/point";
export class World{
    private envelopes: Envelope[];
    private roadBoarders:Segment[] = [];
    private buildings: Polygon[];
    private trees: Point[] = [];

    constructor(public graph: Graph, private roadWidth: number = 100, public roadRoundness: number = 10,public buildingWidth:number=150,public buildingMinLength:number=150,public spacing =50,private treeSize=50) {
        this.graph = graph;
        this.roadWidth = roadWidth;
        this.roadRoundness = roadRoundness;
        
        this.buildingWidth = buildingWidth;
        this.buildingMinLength = buildingMinLength;
        this.spacing = spacing;
        this.treeSize = treeSize;

        this.envelopes = [];
        this.roadBoarders = [];
        this.buildings = [];        
        this.trees = [];
        
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
        this.trees=this.generateTrees();

    }

    //trees generator 
    private generateTrees(count:number=10):Point[] {
        const points = [
            ...this.roadBoarders.map(s => [s.p1, s.p2]).flat(),
            ...this.buildings.map(b=>b.points).flat()
        ];

        const left = Math.min(...points.map(p => p.x));
        const right = Math.max(...points.map(p => p.x));
        const top = Math.min(...points.map(p => p.y));
        const bottom = Math.max(...points.map(p => p.y));
        
        const illegalPolys = [
            ...this.buildings,
            ...this.envelopes.map(e=>e.poly)
        ]

        const trees = [];
        while (trees.length < count) {
            const p = new Point(
                lerp(left, right, Math.random()),
                lerp(bottom,top,Math.random())
            )

            //prevent from adding a tree on building or road poly
            let keep = true;
            for (const poly of illegalPolys) {
                if (poly.containsPoint(p)) {
                    keep = false;
                    break;
                }
            }
            //prevent tree overlaping
            if (keep) {
                for (const tree of trees) {
                    if (distance(tree, p) < this.treeSize) {
                        keep = false;
                    }        
                }
            }

            if (keep) {
                trees.push(p);
            }
        }
        return trees;
    }

    //building generator
    private generateBuildings():Polygon[] {
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

            for (let i = 2; i <= buildingCount; i++){
                q1 = add(q2, scale(dir, this.spacing));
                q2 = add(q1, scale(dir, buildingLength));

                supports.push(new Segment(q1, q2));
            }
        }

        const bases:Polygon[] = [];
        for (const seg of supports) {
            bases.push(new Envelope(seg,this.buildingWidth).poly)
        }

        for (let i = 0; i < bases.length;i++){
            for (let j = i + 1; j < bases.length; j++){
                if (bases[i].intersectPoly(bases[j])) {
                    bases.splice(j, 1);
                    j--;
                }
            }
        }
        
        return bases;
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

        //draw trees 
        for (const tree of this.trees) {
            tree.draw(ctx,{size:this.treeSize,color:"rgba(0,0,0,0.5)"});
        }

        //display building enveloppes
        for (const bld of this.buildings) {
            bld.draw(ctx);
        }

    }
}