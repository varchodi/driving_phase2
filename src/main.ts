import './style.css'
import { Graph } from './math/graph';
import { GraphEditor } from './graphEditor';
import { Viewport } from './viewport';
import { World } from './world';

const myCanvas = document.getElementById("myCanvas") as HTMLCanvasElement;
const saveBtn = document.getElementById("save") as HTMLButtonElement;
const disposeBtn = document.getElementById("dispose") as HTMLButtonElement;

const ctx = myCanvas.getContext("2d")!;

//load graph from local storage
const graphString = localStorage.getItem("graph");
const graphInfo = graphString ? JSON.parse(graphString) as Graph : null;

const graph = graphInfo ? Graph.load(graphInfo) : new Graph();

const world = new World(graph);

const viewport = new Viewport(myCanvas);
const graphEditor = new GraphEditor(viewport, graph);

animate();
function animate() {
    viewport.reset();

    //??
    world.generate();
    world.draw(ctx);

    graphEditor.display();

    // new Envelope(graph.segments[0],200,20).draw(ctx)

    //draw polygon on segments ??points 
    // new Polygon(graph?.points).draw(ctx);

    requestAnimationFrame(animate);
}

//btn evnts
saveBtn.onclick = save;
disposeBtn.onclick = dispose;

//!! dispose
function dispose() {
    graphEditor.dispose();
    localStorage.removeItem("graph");
}

//!! save 
function save() {
    localStorage.setItem("graph", JSON.stringify(graph));
}