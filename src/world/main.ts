import './style.css'
import { Graph } from './math/graph';
import { GraphEditor } from './editors/graphEditor';
import { Viewport } from './viewport';
import { World } from './world';
import { scale } from './math/utils';
import { StopEditor } from './editors/stopEditor';
import { CrossingEditor } from './editors/crossingEdito';
import { StartEditor } from './editors/startEditor';
import { ParkingEditor } from './editors/parkingEditor';
import { LightEditor } from './editors/lightEditor';
import { TargetEditor } from './editors/targetEditor';
import { YieldEditor } from './editors/yeildEditor';
import { Osm } from './math/osm';
import { Point } from './primitives/point';
import { loadData } from '../util';

const myCanvas = document.getElementById("myCanvas") as HTMLCanvasElement;
const saveBtn = document.getElementById("save") as HTMLButtonElement;
const disposeBtn = document.getElementById("dispose") as HTMLButtonElement;
const graphBtn = document.getElementById("graphBtn") as HTMLButtonElement;
const stopBtn = document.getElementById("stopBtn") as HTMLButtonElement;
const crossingBtn = document.getElementById("crossingBtn") as HTMLButtonElement;
const startBtn = document.getElementById("startBtn") as HTMLButtonElement;
const yieldBtn = document.getElementById("yieldBtn") as HTMLButtonElement;
const parkingBtn = document.getElementById("parkingBtn") as HTMLButtonElement;
const lightBtn = document.getElementById("lightBtn") as HTMLButtonElement;
const targetBtn = document.getElementById("targetBtn") as HTMLButtonElement;
const loadBtn = document.getElementById("load") as HTMLButtonElement;
const parseOsmDataBtn = document.getElementById("parseOsmData") as HTMLButtonElement;
const closeOsmPanelBtn = document.getElementById("closeOsmPanel") as HTMLButtonElement;
const osmDataContainer = document.getElementById("osmDataContainer") as HTMLTextAreaElement;
const osmPanel = document.getElementById("osmPanel") as HTMLDivElement;
const fileInput = document.getElementById("fileInput") as HTMLInputElement;

const ctx = myCanvas.getContext("2d")!;

//load graph from local storage
const worldString = localStorage.getItem("world");
//const worldInfo = worldString ? JSON.parse(worldString) as World : null;
const worldInfo = await loadData('/src/world/items/worlds/big2.world');

//load .../ if not def new world with empty graph
export let world = worldInfo ? World.load(worldInfo) as World : new World(new Graph());

// const worldy = await loadData("/src/world/items/worlds/big.world");
// const world = World.load(worldy);

const graph = world.graph;

const viewport = new Viewport(myCanvas,world.zoom,world.offset);


const tools = {
    graph: { button: graphBtn, editor: new GraphEditor(viewport, graph) },
            stop: { button: stopBtn, editor: new StopEditor(viewport, world) },
            crossing: { button: crossingBtn, editor: new CrossingEditor(viewport, world) },
            start: { button: startBtn, editor: new StartEditor(viewport, world) },
            parking: { button: parkingBtn, editor: new ParkingEditor(viewport, world) },
            light: { button: lightBtn, editor: new LightEditor(viewport, world) },
            target: { button: targetBtn, editor: new TargetEditor(viewport, world) },
            yield: { button: yieldBtn, editor: new YieldEditor(viewport, world) },
    
};

let oldGraphHash = graph.hash();
setMode("graph");
animate();

function animate() {
    viewport.reset();

    //??
    //regenerate graph only if graph changes
    if (graph.hash() != oldGraphHash){
        // world.generate();
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
fileInput.onchange = (e: any)=>load(e)
for (const mode of Object.keys(tools)) {
    const mody = mode as keyof typeof tools;
    tools[mody].button.onclick = () => setMode(mody);
}

//OpenSteetMap stuffs
loadBtn.onclick = openOsmPanel;
parseOsmDataBtn.onclick = parseOsmData;
closeOsmPanelBtn.onclick = closeOsmPanel;


//!! dispose
function dispose() {
    tools["graph"].editor.dispose();
    localStorage.removeItem("graph");
    world.markings.length = 0;
}

//!! save 
function save() {
    world.zoom = viewport.zoom;
    world.offset = viewport.offset;

    const element = document.createElement("a");
    //element.href = `data:application/json;charset=utf-8;${encodeURIComponent(JSON.stringify(world))}`;
    const fileName = `name_${Math.random()*100+1}.world`;
    //element.download = fileName;
    
    const blob = new Blob([JSON.stringify(world)], { type: "application/json", });
    const url = window.URL.createObjectURL(blob);
    element.href = url;
    element.download = fileName;
    element.click();
  // Revoke the temporary URL after download (optional)
    window.URL.revokeObjectURL(url);
    localStorage.setItem("world", JSON.stringify(world));
}

//?? load from file 
function load(event:Event & { target: HTMLInputElement, files: FileList}) {
    const files = event?.target?.files as unknown as FileList;
    const file = files[0]! as File;

    if (!file) {
        alert("No file Selected");
        return;
    }

    //read world as text
    const reader = new FileReader();
    reader.readAsText(file);
    
    //convert to Object
    reader.onload = (event: ProgressEvent<FileReader>)=>{
        const fileContent = event.target?.result;
        const jsonData = JSON.parse(fileContent as string);

        world = World.load(jsonData);
        //save new in LS
        localStorage.setItem("world", JSON.stringify(world));
        //reload page
        location.reload();
    }
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
//open OsmPannel
function openOsmPanel() {
    osmPanel.style.display = "block";
};

function parseOsmData() {
    if (osmDataContainer.value == "") {
        alert("paste data first");
        return;
    }

    const result = Osm.parseRoads(JSON.parse(osmDataContainer.value));
    graph.points = result.points;
    graph.segments = result.segments;
    
    closeOsmPanel();
}

//close modal
function closeOsmPanel() {
    osmPanel.style.display = "none";
}