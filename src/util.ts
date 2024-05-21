//interpolation to find x_points  between two points
export function lerp(a: number, b: number, t: number) {
    return a + (b - a) * t;
}

export function getIntersection(
    A: { x: number; y: number },
    B: { x: number; y: number },
    C: { x: number; y: number },
    D: { x: number; y: number }
) {
    const tTop=(D.x-C.x)*(A.y-C.y)-(D.y-C.y)*(A.x-C.x);
    const uTop=(C.y-A.y)*(A.x-B.x)-(C.x-A.x)*(A.y-B.y);
    const bottom=(D.y-C.y)*(B.x-A.x)-(D.x-C.x)*(B.y-A.y);
    
    if(bottom!=0){
        const t=tTop/bottom;
        const u=uTop/bottom;
        if(t>=0 && t<=1 && u>=0 && u<=1){
            return {
                x:lerp(A.x,B.x,t),
                y:lerp(A.y,B.y,t),
                offset:t
            }
        }
    }

    return null;
}

//?? polylines 
export function polysIntersect(
    poly1: { x: number; y: number }[],
    poly2: { x: number; y: number }[]
): boolean {
    for(let i=0;i<poly1.length;i++){
        for(let j=0;j<poly2.length;j++){
            const touch=getIntersection(
                poly1[i],
                poly1[(i+1)%poly1.length],
                poly2[j],
                poly2[(j+1)%poly2.length]
            );
            if(touch){
                return true;
            }
        }
    }
    return false;
}

export function getRGBA(value: number): string{
    const alpha=Math.abs(value);
    const R=value<0?0:255;
    const G=R;
    const B=value>0?0:255;
    return "rgba("+R+","+G+","+B+","+alpha+")";
}

export function getRandomColor():string{
    const hue=290+Math.random()*260;
    return "hsl("+hue+", 100%, 60%)";
}
    