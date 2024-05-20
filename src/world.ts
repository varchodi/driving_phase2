import { Graph } from "./math/graph";
import { add, distance, lerp, scale } from "./math/utils";
import { Envelope } from "./primitives/envelope";
import { Polygon } from "./primitives/polygon";
import { Segment } from "./primitives/segment";
import { Point } from "./primitives/point";
import { Tree } from "./items/tree";
import { Building } from "./items/building";
import { Stop } from "./markings/stop";
import { Crossing } from "./markings/crossing";

export class World{
    private envelopes: Envelope[];
    private roadBoarders:Segment[] = [];
    private buildings: Building[];
    private trees: Tree[] = [];
    public laneGuides: any;
    public markings: ( any| Stop | Crossing)[];

    constructor(public graph: Graph, public roadWidth: number = 100, public roadRoundness: number = 10,public buildingWidth:number=150,public buildingMinLength:number=150,public spacing =50,private treeSize=160) {
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
        this.laneGuides = [];

        this.markings = [];
        
        this.generate();
    }

    //load a pregenerated world 
    static load(info: World) {
        return new World(
            Graph.load(info.graph)
        );
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
        this.trees = this.generateTrees();
        
        this.laneGuides.len = 0;
        this.laneGuides.push(...this.generateLineGuides());

    }

    //gen line guides
    private generateLineGuides() {
        const tmpEnvelopes = [];
        for (const seg of this.graph.segments) {
           tmpEnvelopes.push(
              new Envelope(
                 seg,
                 this.roadWidth / 2,
                 this.roadRoundness
              )
           );
        }  
        
        const segments = Polygon.union(tmpEnvelopes.map((e) => e.poly));
        return segments;
    }

    //trees generator 
    private generateTrees():Tree[] {
        const points = [
            ...this.roadBoarders.map(s => [s.p1, s.p2]).flat(),
            ...this.buildings.map(b=>b.base.points).flat()
        ];

        const left = Math.min(...points.map(p => p.x));
        const right = Math.max(...points.map(p => p.x));
        const top = Math.min(...points.map(p => p.y));
        const bottom = Math.max(...points.map(p => p.y));
        
        const illegalPolys = [
            ...this.buildings.map((b)=>b.base),
            ...this.envelopes.map(e=>e.poly)
        ]

        const trees = [];
        let tryCount = 0;

        while (tryCount<100) {
            const p = new Point(
                lerp(left, right, Math.random()),
                lerp(bottom,top,Math.random())
            )

            //prevent from adding a tree on building or road poly
            let keep = true;
            for (const poly of illegalPolys) {
                if (poly.containsPoint(p)||poly.distanceToPoint(p)<this.treeSize/2) {
                    keep = false;
                    break;
                }
            }
            //prevent tree overlaping(intercept trees)
            if (keep) {
                for (const tree of trees) {
                    if (distance(tree.center, p) < this.treeSize) {
                        keep = false;
                        break;
                    }        
                }
            }
            //keep tree wich are close to samething only
            if(keep){
                let closeToSamething = false;
                for (const poly of illegalPolys) {
                    if (poly.distanceToPoint(p) < this.treeSize * 2) {
                        closeToSamething = true;
                        break;
                    }
                }
                keep = closeToSamething;
            }

            if (keep) {
                trees.push(new Tree(p,this.treeSize));
                tryCount = 0;
            }
            tryCount++;
        }
        return trees;
    }

    //building generator
    private generateBuildings():Building[] {
        const tmpEnvelopes = [];
      for (const seg of this.graph.segments) {
         tmpEnvelopes.push(
            new Envelope(
               seg,
               this.roadWidth + this.buildingWidth + this.spacing * 2,
               this.roadRoundness
            )
         );
      }

      const guides = Polygon.union(tmpEnvelopes.map((e) => e.poly));

      for (let i = 0; i < guides.length; i++) {
         const seg = guides[i];
         if (seg.length() < this.buildingMinLength) {
            guides.splice(i, 1);
            i--;
         }
      }

      const supports = [];
      for (let seg of guides) {
         const len = seg.length() + this.spacing;
         const buildingCount = Math.floor(
            len / (this.buildingMinLength + this.spacing)
         );
         const buildingLength = len / buildingCount - this.spacing;

         const dir = seg.directionVector();

         let q1 = seg.p1;
         let q2 = add(q1, scale(dir, buildingLength));
         supports.push(new Segment(q1, q2));

         for (let i = 2; i <= buildingCount; i++) {
            q1 = add(q2, scale(dir, this.spacing));
            q2 = add(q1, scale(dir, buildingLength));
            supports.push(new Segment(q1, q2));
         }
      }

      const bases = [];
      for (const seg of supports) {
         bases.push(new Envelope(seg, this.buildingWidth).poly);
      }

      const eps = 0.001;
      for (let i = 0; i < bases.length - 1; i++) {
         for (let j = i + 1; j < bases.length; j++) {
            if (
               bases[i].intersectPoly(bases[j]) ||
               bases[i].distanceToPoly(bases[j]) < this.spacing - eps
            ) {
               bases.splice(j, 1);
               j--;
            }
         }
      }

      return bases.map((b) => new Building(b));
        
    }

    draw(ctx: CanvasRenderingContext2D,viewPoint:Point) {
        for (const env of this.envelopes) {
            env.draw(ctx, { fill: "#BBB", stroke: "#BBB", lineWidth: 15 });
        }
        //draw markings
        for (const marking of this.markings) {
            marking.draw(ctx);
        }
         for (const seg of this.graph.segments) {
            seg.draw(ctx, { color: "white", width: 4, dash: [10, 10] });
         }
         for (const seg of this.roadBoarders) {
            seg.draw(ctx, { color: "white", width: 4 });
         }
   
         const items = [...this.buildings, ...this.trees];
         items.sort(
            (a, b) =>
               b.base.distanceToPoint(viewPoint) -
               a.base.distanceToPoint(viewPoint)
         );
         for (const item of items) {
            item.draw(ctx, viewPoint);
        }
        
        
      }
}