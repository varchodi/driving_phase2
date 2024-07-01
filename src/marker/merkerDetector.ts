export class Markerdetector{
    constructor() { }
    
    public detect(imgData: ImageData) {
        const points = [];
        
        // ?? i+=4 (pixel by pixel)
        for (let i = 0; i < imgData.data.length; i += 4){
            const r = imgData.data[i + 0];
            const g = imgData.data[i + 1];
            const b = imgData.data[i + 2];
            
            // mesure bleness
            const blueness = b - Math.max(r, g);
            points.push(blueness);
        }
    }
}