import Car from './car';
import './styles/style.css'
import { Visualizer } from './visualizer';
import { NeuralNetwork } from './network';
import { World } from './world/world';
import { Viewport } from './world/viewport';
import { angle, scale } from './world/math/utils';
import { Start } from './world/markings/start';
import { Point } from './world/primitives/point';

const carCanvas = document.getElementById("carCanvas") as HTMLCanvasElement;
const networkCanvas = document.getElementById("networkCanvas") as HTMLCanvasElement;
const miniMapCanvas = document.getElementById("minimapCanvas") as HTMLCanvasElement;

miniMapCanvas.width = 300;
miniMapCanvas.height = 300;
networkCanvas.width = 300;
networkCanvas.height = window.innerHeight-300;
carCanvas.width = window.innerWidth-330;
carCanvas.height=window.innerHeight;

const carCtx = carCanvas.getContext("2d") as CanvasRenderingContext2D;
const networkCtx = networkCanvas.getContext("2d") as CanvasRenderingContext2D;

// load world
// const worldString = localStorage.getItem("world");
// const worldInfo = worldString ? JSON.parse(worldString) as World : null;

// //load .../ if not def new world with empty graph
// const world = worldInfo ? World.load(worldInfo) as World : new World(new Graph());
// const graph = world.graph;


async function loadWorldData() {
  try {
    const response = await fetch("/src/world/items/worlds/big.world");
    const data = await response.json();
    return data // Assuming data represents your world data structure
  } catch (error) {
    console.error("Error loading world data:", error);
    // Handle loading a default world or displaying an error message
  }
}

// Use the loaded world data
const worldy = await loadWorldData();
const world = World.load(worldy);
// Now you can use the 'world' object for world generation


console.log(worldy)
//set viewport
const viewport = new Viewport(carCanvas, world.zoom, world.offset);


const N=1;
const cars=generateCars(N);
let bestCar=cars[0];
if(localStorage.getItem("bestBrain")){
    for(let i=0;i<cars.length;i++){
        cars[i].brain=JSON.parse(
            localStorage.getItem("bestBrain")!);
        if(i!=0){
            NeuralNetwork.mutate(cars[i].brain!,0.1);
        }
    }
}


const traffic: Car[] = [];
//make car world borders
const roadBorders = world.roadBoarders.map(s=>[s.p1,s.p2]);


//animate ...
animate();

//save n styff;
document.getElementById("save")?.addEventListener("click", () => {
    save();
})

document.getElementById("retry")?.addEventListener("click", () => {
    console.log("brain saved");
    discard();
    console.log("load")
})

document.getElementById("discard")?.addEventListener("click",()=>{discard()});

function save() {
    console.log(bestCar.brain);
    localStorage.setItem("bestBrain", JSON.stringify(bestCar.brain));
}

function discard() {
    localStorage.removeItem("bestBrain");
}

function generateCars(N: number): Car[] {
    const startPoints = world.markings.filter((m) => m instanceof Start);
    const startPoint = startPoints.length > 0 ? startPoints[0].center : new Point(100, 100); 
    const cars = [];

    const dir = startPoints.length > 0 ? startPoints[0].directionVector : new Point(0, -1);
    const startAngle = -angle(dir)+Math.PI / 2;

    for(let i=1;i<=N;i++){
        cars.push(new Car(startPoint.x,startPoint.y,30,50,"AI",startAngle)!);
    }
    return cars;
}

function animate(time?:number) {

    for(let i=0;i<traffic.length;i++){
        traffic[i].update(roadBorders,[]);
    }
    for(let i=0;i<cars.length;i++){
        cars[i].update(roadBorders,traffic);
    }
    bestCar=cars.find(
        c=>c.fittness==Math.max(
            ...cars.map(c=>c.fittness)
        ))!;

    //pass cars to world
    world.cars = cars;
    world.bestCar = bestCar;

    //!! camera follows bestCar
    viewport.offset.x = -bestCar.x;
    viewport.offset.y = -bestCar.y;
    
    //draw world ??-------------------
    viewport.reset();
    //??
    //calculate the viewPoint
    const viewPoint = scale(viewport.getOffset(), -1);
    world.draw(carCtx, viewPoint,false);
    //-----------------------------------


    for(let i=0;i<traffic.length;i++){
        traffic[i].draw(carCtx);
    }

    networkCtx.lineDashOffset = -time! / 50;
    networkCtx.clearRect(0, 0, networkCanvas.width, networkCanvas.height);
    Visualizer.drawNetwork(networkCtx, bestCar.brain!);
    
    requestAnimationFrame(animate);
}

