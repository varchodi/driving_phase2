import './style.css'
import { Graph } from './math/graph';
import { Point } from './primitives/point';
import { Segment } from './primitives/segment';
import { GraphEditor } from './graphEditor';
import { Viewport } from './viewport';

const myCanvas = document.getElementById("myCanvas") as HTMLCanvasElement;

const ctx = myCanvas.getContext("2d") as CanvasRenderingContext2D;


const p1 = new Point(200, 200);
const p2 = new Point(500, 200);
const p3 = new Point(400, 400);
const p4 = new Point(100, 300);

const s1 = new Segment(p1, p2);
const s2 = new Segment(p1, p3);
const s3 = new Segment(p1, p4);
const s4 = new Segment(p2, p3);

const graph = new Graph([p1, p2, p3, p4], [s1, s2, s3, s4]);
const viewport = new Viewport(myCanvas);
const graphEditor = new GraphEditor(viewport, graph);

animate();
function animate() {
    ctx.clearRect(0, 0, myCanvas.width, myCanvas.height);
    ctx.save();//save stat
    ctx.scale(1 / viewport.zoom, 1 / viewport.zoom);//scale
    
    ctx.translate(viewport.offset.x, viewport.offset.y);//focus on point while scaling
    graphEditor.display();
    ctx.restore();//restore ??

    requestAnimationFrame(animate);
}