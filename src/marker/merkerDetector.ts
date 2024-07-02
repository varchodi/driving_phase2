import { distance } from ".";

export class Markerdetector{
    threshold: HTMLInputElement;
    constructor() { 
        this.threshold = document.createElement('input')!;
        this.threshold.type = 'range';
        this.threshold.min = '0';
        this.threshold.max = '255';
        this.threshold.value = '40';
    }

    // average points (find center point)
    private averagePoints(points:{x: number;y: number;blueness: number}[]) {
        const center = { x: 0, y: 0 ,blueness:0};
        for (const point of points) {
            center.x += point.x;
            center.y += point.y;
        }
        center.x /= points.length;
        center.y /= points.length;
        center.blueness = null!;

        return center;
    }
    
    public detect(imgData: ImageData) {
        const points = [];

        // ?? i+=4 (pixel by pixel)
        for (let i = 0; i < imgData.data.length; i += 4){
            const r = imgData.data[i + 0];
            const g = imgData.data[i + 1];
            const b = imgData.data[i + 2];
            
            // mesure bleness
            const blueness = b - Math.max(r, g);
            if (blueness > parseInt(this.threshold.value)) {
                const pIndex = i / 4;
                const y = Math.floor(pIndex / imgData.width);
                const x = pIndex % imgData.width;

                //loc x,loc y ,blueness
                points.push({x,y,blueness});
            }
        }
        let centroid1 = points[0];
        let centroid2 = points[points.length - 1];

        let group1:{x: number;y: number;blueness: number}[] = [];
        let group2:{x: number;y: number;blueness: number}[] = [];

        for (let i = 1; i <= 10; i++) {
            group1 = points.filter((p) => distance(p, centroid1) < distance(p, centroid2));
            group2 = points.filter((p) => distance(p, centroid1) >= distance(p, centroid2));
        
            //!!center point
            centroid1 = this.averagePoints(group1);
            centroid2 = this.averagePoints(group2);
        }
        //??find point measure
        const size1 = Math.sqrt(group1.length);
        const radius1 = size1 / 2;
        const size2 = Math.sqrt(group2.length);
        const radius2 = size2 / 2;

        points.sort((a, b) => b.blueness - a.blueness);

        const marker1 = {
            centroid: centroid1,
            points: group1,
            radius: radius1,
        };

        const marker2 = {
            centroid: centroid2,
            points: group2,
            radius: radius2,
        };
        
        return {
            leftMarker: centroid1.x < centroid2.x ? marker1 : marker2,
            rightMarker: centroid1.x < centroid2.x ? marker2 : marker1,
        }
    }
}