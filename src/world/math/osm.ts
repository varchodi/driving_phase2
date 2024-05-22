import { Point } from "../primitives/point";
import { Graph } from "./graph";
import { inveLerp } from "./utils";

export type Node = { type: string, id: number, lat: number, lon: number };
export const Osm = {
    points:[],
    parseRoads: (data: any,graph:Graph,canvas:HTMLCanvasElement) => {
        const nodes = data.elements.filter((n: any) => n.type == "node") as Node[];
        const lats = nodes.map(n => n.lat);
        const lons = nodes.map(n => n.lon);

        const minLat = Math.min(...lats);
        const maxLat = Math.max(...lats);
        const minLon = Math.min(...lons);
        const maxLon = Math.max(...lons);

        const deltaLat = maxLat - minLat;
        const deltaLon = maxLon - minLon;
        const ar = deltaLon / deltaLat; //Aspect ratio
     
        const points: Point[]=[];
        for (const node of nodes) {
            const y = inveLerp(maxLat,minLat,node.lat)*canvas.height;
            const x = inveLerp(minLon,maxLon,node.lon)*canvas.width;

            points?.push(new Point(x, y));
        }

        graph.points = points!;
    }

}