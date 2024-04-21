import './style.css'
import { Graph } from './math/graph';
import { Point } from './primitives/point';
import { Segment } from './primitives/segment';

const myCanvas = document.getElementById("myCanvas") as HTMLCanvasElement;
const addRanPointBtn = document.getElementById("addRanPoint") as HTMLButtonElement;
const addRanSegmentBtn = document.getElementById("addRanSegment") as HTMLButtonElement;
const removeRanSegmentBtn = document.getElementById("removeRanSegment") as HTMLButtonElement;
const removeRanPointBtn = document.getElementById("removeRanPoint") as HTMLButtonElement;
const removeAllBtn = document.getElementById("removeAll") as HTMLButtonElement;

const ctx = myCanvas.getContext("2d") as CanvasRenderingContext2D;

//remove a random Point
function removeRandomPoint() {
    if (graph.points.length == 0) {
        console.log("no point");
        return
    }
    const indx = Math.floor(Math.random() * graph.points.length);
    graph.removePoint(graph.points[indx]);
    
    ctx.clearRect(0, 0, myCanvas.width, myCanvas.height);
    graph.draw(ctx);
}

function removeAll() {
    graph.dispose();

    ctx.clearRect(0, 0, myCanvas.width, myCanvas.height);
    graph.draw(ctx);
}

//remove a random segment
function removeRandomSegment() {
    if (graph.segments.length == 0) {
        console.log("no segment");
        return
    }
    const indx = Math.floor(Math.random() * graph.points.length);
    graph.removeSegment(graph.segments[indx]);
    
    ctx.clearRect(0, 0, myCanvas.width, myCanvas.height);
    graph.draw(ctx);
}

//add a random segment
function addRandomSegment() {
    const indx1 = Math.floor(Math.random() * graph.points.length);
    const indx2 = Math.floor(Math.random() * graph.points.length);
    
    const success = graph.tryAddSegment(
            new Segment(graph.points[indx1],graph.points[indx2])
        )

        
    ctx.clearRect(0, 0, myCanvas.width, myCanvas.height);
    graph.draw(ctx);
    //
    console.log(`suc: ${success}`);
}

//add a random point 
function addRandomPoint()
{
    const sucess = graph.tryAddPoint(
        new Point(
            Math.random() * myCanvas.width,
            Math.random() * myCanvas.height
        )
    );
    ctx.clearRect(0, 0, myCanvas.width, myCanvas.height);
    graph.draw(ctx);
    //
    console.log(`add: ${sucess}`);
}
//add rndom point on click;
addRanPointBtn.onclick = addRandomPoint;
addRanSegmentBtn.onclick = addRandomSegment;
removeRanSegmentBtn.onclick=removeRandomSegment;
removeRanPointBtn.onclick = removeRandomPoint;
removeAllBtn.onclick = removeAll;

const p1 = new Point(200, 200);
const p2 = new Point(500, 200);
const p3 = new Point(400, 400);
const p4 = new Point(100, 300);

const s1 = new Segment(p1, p2);
const s2 = new Segment(p1, p3);
const s3 = new Segment(p1, p4);
const s4 = new Segment(p2, p3);

const graph = new Graph([p1, p2, p3, p4],[s1,s2,s3,s4]);

graph.draw(ctx);