import { Point } from "../primitives/point";
import { Segment } from "../primitives/segment";
import { Graph } from "./graph";
import { degToRad, inveLerp } from "./utils";

export type Node = { type: string, id: number, lat: number, lon: number };

export type Tags = {
    oneway:boolean,
    highway:string
    lanes:number
    lit:'yes'|"no",
    maxspeed:number
    name:string,
    "name:fi":string,
    surface:string
}

export type Way = {
    id: number,
    nodes: number[],
    tags: Tags,
    type:string
}

export const Osm = {
    points:[],
    parseRoads: (data: any) => {
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
        const height = deltaLat * 111000 * 10; //?? road 10 meter
        const width = height * ar *Math.cos(degToRad(maxLat)); // to fit any long
     
        const points: Point[] = [];
        const segments: Segment[] = [];
        for (const node of nodes) {
            const y = inveLerp(maxLat,minLat,node.lat)*height;
            const x = inveLerp(minLon,maxLon,node.lon)*width;
            const point = new Point(x, y);
            point.id = node.id;
            points?.push(point);
        }

        const ways = data.elements.filter((w: any) => w.type == "way") as Way[];
        //connect points to way
        for (const way of ways) {
            const ids = way.nodes;
            for (let i = 1; i < ids.length; i++){
                const prev = points.find((p) => p.id == ids[i - 1]);
                const current = points.find((p) => p.id == ids[i]);
                const oneWay = way.tags.oneway || way.tags.lanes == 1;
                segments.push(new Segment(prev!, current!,oneWay));
            }
        }

        return {points, segments}
    }

}