import './style.css'
import { Graph } from './math/graph';
import { GraphEditor } from './editors/graphEditor';
import { Viewport } from './viewport';
import { World } from './world';
import { scale } from './math/utils';
import { StopEditor } from './editors/stopEditor';

const myCanvas = document.getElementById("myCanvas") as HTMLCanvasElement;
const saveBtn = document.getElementById("save") as HTMLButtonElement;
const disposeBtn = document.getElementById("dispose") as HTMLButtonElement;
const graphBtn = document.getElementById("graphBtn") as HTMLButtonElement;
const stopBtn = document.getElementById("stopBtn") as HTMLButtonElement;

const ctx = myCanvas.getContext("2d")!;

//load graph from local storage
const graphString = localStorage.getItem("graph");
const graphInfo = graphString ? JSON.parse(graphString) as Graph : null;

const graph = graphInfo ? Graph.load(graphInfo) : new Graph();

const world = new World(graph);

const viewport = new Viewport(myCanvas);
const graphEditor = new GraphEditor(viewport, graph);
const stopEditor = new StopEditor(viewport, world);


let oldGraphHash = graph.hash();
setMode("graph");
animate();

function animate() {
    viewport.reset();

    //??
    //regenerate graph only if graph changes
    if (graph.hash() != oldGraphHash){
        world.generate();
        oldGraphHash = graph.hash()
    }
    //calculate the viewPoint
    const viewPoint = scale(viewport.getOffset(), -1);

    world.draw(ctx,viewPoint);

    //add transparency
    ctx.globalAlpha = 0.2;

    graphEditor.display();
    stopEditor.display();

    requestAnimationFrame(animate);
}

//btn evnts
saveBtn.onclick = save;
disposeBtn.onclick = dispose;
graphBtn.onclick = ()=>setMode("graph");
stopBtn.onclick = () => setMode("stop");

//!! dispose
function dispose() {
    graphEditor.dispose();
    localStorage.removeItem("graph");
    world.markings.length = 0;
}

//!! save 
function save() {
    localStorage.setItem("graph", JSON.stringify(graph));
}

//??
function setMode(mode: string) {
    disableEditors();
    switch (mode) {
        case "graph":
            graphBtn.style.backgroundColor = "white";
            graphBtn.style.filter = "";
            graphEditor.enable();
            break;
        case "stop":
            stopBtn.style.backgroundColor = "white";
            stopBtn.style.filter = "";
            stopEditor.enable(); //enable stop marking dragging ...
            break;
    
        default:
            break;
    }
}

function disableEditors() {
    graphBtn.style.backgroundColor = "gray";
    graphBtn.style.filter = "grayscale(100%)";
    graphEditor.disable();
    stopBtn.style.backgroundColor = "gray";
    stopBtn.style.filter = "grayscale(100%)";
    stopEditor.disable();
}