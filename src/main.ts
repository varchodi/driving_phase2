import Car from './car';
import './styles/style.css'
import { Visualizer } from './visualizer';
import { NeuralNetwork } from './network';
import { World } from './world/world';
import { Viewport } from './world/viewport';
import { angle, scale } from './world/math/utils';
import { Start } from './world/markings/start';
import { Point } from './world/primitives/point';
import { MiniMap } from './miniMap';
import { loadData } from './util';
import { Target } from './world/markings/target';

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




// Use the loaded world data
const worldy = await loadData("/src/world/items/worlds/path_finding.world");

const world = World.load(worldy);

//load external car 
const carInfo = await loadData("/src/saves/right_hand_rule.car");
//set viewport
const viewport = new Viewport(carCanvas, world.zoom, world.offset);
const minimap = new MiniMap(miniMapCanvas,world.graph,300);

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
//?? fech target n ....
const target = world.markings.find((m) => m instanceof Target)
//make car world borders
let roadBorders:Point[][]=[]
if (target) {
    world.generateCorridor(new Point(bestCar.x, bestCar.y), target.center);
    roadBorders=world.corridor.map((s)=>[s.p1,s.p2]) // assign car to corridor paths;
} else {
    roadBorders=world.roadBoarders.map(s=>[s.p1,s.p2])
}
    


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

    for (let i = 1; i <= N; i++){
        const car = new Car(startPoint.x, startPoint.y, 30, 50, "AI", startAngle)!;
        car.load(carInfo);
        cars.push(car);
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
    //?? draw minimap
    minimap.update(viewPoint);

    for(let i=0;i<traffic.length;i++){
        traffic[i].draw(carCtx);
    }

    networkCtx.lineDashOffset = -time! / 50;
    networkCtx.clearRect(0, 0, networkCanvas.width, networkCanvas.height);
    Visualizer.drawNetwork(networkCtx, bestCar.brain!);
    
    requestAnimationFrame(animate);
}

