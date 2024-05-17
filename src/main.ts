import './style.css'
import { Graph } from './math/graph';
import { GraphEditor } from './editors/graphEditor';
import { Viewport } from './viewport';
import { World } from './world';
import { scale } from './math/utils';
import { StopEditor } from './editors/stopEditor';
import { CrossingEditor } from './editors/crossingEdito';

const myCanvas = document.getElementById("myCanvas") as HTMLCanvasElement;
const saveBtn = document.getElementById("save") as HTMLButtonElement;
const disposeBtn = document.getElementById("dispose") as HTMLButtonElement;
const graphBtn = document.getElementById("graphBtn") as HTMLButtonElement;
const stopBtn = document.getElementById("stopBtn") as HTMLButtonElement;
const crossingBtn = document.getElementById("crossingBtn") as HTMLButtonElement;

const ctx = myCanvas.getContext("2d")!;

//load graph from local storage
const graphString = localStorage.getItem("graph");
const graphInfo = graphString ? JSON.parse(graphString) as Graph : null;

const graph = graphInfo ? Graph.load(graphInfo) : new Graph();

const world = new World(graph);

const viewport = new Viewport(myCanvas);


const tools = {
    graph: { button: graphBtn, editor: new GraphEditor(viewport, graph) },
    stop: { button: stopBtn, editor:  new StopEditor(viewport, world) },
    crossing:{button:crossingBtn,editor: new CrossingEditor(viewport, world)},
};

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

    //display editors
    for (const tool of Object.values(tools)) {
        tool.editor.display();
    }

    requestAnimationFrame(animate);
}

//btn evnts
saveBtn.onclick = save;
disposeBtn.onclick = dispose;
graphBtn.onclick = ()=>setMode("graph");
stopBtn.onclick = () => setMode("stop");
crossingBtn.onclick = () => setMode("crossing");

//!! dispose
function dispose() {
    tools["graph"].editor.dispose();
    localStorage.removeItem("graph");
    world.markings.length = 0;
}

//!! save 
function save() {
    localStorage.setItem("graph", JSON.stringify(graph));
}

//??
function setMode(mode: keyof typeof tools) {
    disableEditors();
    tools[mode].button.style.backgroundColor = "white";
    tools[mode].button.style.filter = "";
    tools[mode].editor.enable();
}


function disableEditors() {
    //disable tools
    for (const tool of Object.values(tools)) {
        tool.button.style.backgroundColor = "gray";
        tool.button.style.filter = "grayscale(100%)";
        tool.editor.disable();
    }
}