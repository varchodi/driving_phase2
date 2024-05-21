import Car from './car';
import './styles/style.css'
import { Visualizer } from './visualizer';
import { NeuralNetwork } from './network';
import { getRandomColor } from './util';
import { World } from './world/world';
import { Graph } from './world/math/graph';
import { Viewport } from './world/viewport';
import { angle, scale } from './world/math/utils';
import { Start } from './world/markings/start';
import { Point } from './world/primitives/point';

const carCanvas = document.getElementById("carCanvas") as HTMLCanvasElement;
const networkCanvas = document.getElementById("networkCanvas") as HTMLCanvasElement;

networkCanvas.width = 300;
networkCanvas.height = window.innerHeight;
carCanvas.width = window.innerWidth-330;
carCanvas.height=window.innerHeight;

const carCtx = carCanvas.getContext("2d") as CanvasRenderingContext2D;
const networkCtx = networkCanvas.getContext("2d") as CanvasRenderingContext2D;

//load world
const worldString = localStorage.getItem("world");
const worldInfo = worldString ? JSON.parse(worldString) as World : null;

//load .../ if not def new world with empty graph
const world = worldInfo ? World.load(worldInfo) as World : new World(new Graph());
const graph = world.graph;
//set viewport
const viewport = new Viewport(carCanvas,world.zoom,world.offset);

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
const roadBorders: any[] = [];


//animate ...
animate();

//save n styff;
document.getElementById("save")?.addEventListener("click", () => {
    save();
    console.log("brain saved");
})

document.getElementById("retry")?.addEventListener("click", () => {
    discard();
    console.log("load")
})

document.getElementById("discard")?.onclick != discard;

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
        cars.push(new Car(startPoint.x,startPoint.y,30,50,"KEYS",startAngle)!);
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
        c=>c.y==Math.min(
            ...cars.map(c=>c.y)
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

