import './style.css'
import { Graph } from './math/graph';
import { Point } from './primitives/point';
import { Segment } from './primitives/segment';
import { GraphEditor } from './graphEditor';
import { Viewport } from './viewport';

const myCanvas = document.getElementById("myCanvas") as HTMLCanvasElement;
const saveBtn = document.getElementById("save") as HTMLButtonElement;
const disposeBtn = document.getElementById("dispose") as HTMLButtonElement;

//load graph from local storage
const graphString = localStorage.getItem("graph");
const graphInfo = graphString ? JSON.parse(graphString) as Graph : null;

const graph = graphInfo ? Graph.load(graphInfo) : new Graph();

const viewport = new Viewport(myCanvas);
const graphEditor = new GraphEditor(viewport, graph);

animate();
function animate() {
    viewport.reset();
    graphEditor.display();

    requestAnimationFrame(animate);
}

//btn evnts
saveBtn.onclick = save;
disposeBtn.onclick = dispose;

//!! dispose
function dispose() {
    graphEditor.dispose();
}

//!! save 
function save() {
    localStorage.setItem("graph", JSON.stringify(graph));
}