import Car from './car';
import './styles/style.css'
import { NeuralNetwork } from './network';
import { World } from './world/world';
import { Viewport } from './world/viewport';
import { angle, getNearestSegment, scale } from './world/math/utils';
import { Start } from './world/markings/start';
import { Point } from './world/primitives/point';
import { MiniMap } from './miniMap';
import { getRandomColor, loadData } from './util';
import { Target } from './world/markings/target';
import { Segment } from './world/primitives/segment';

const carCanvas = document.getElementById("carCanvas") as HTMLCanvasElement;
const miniMapCanvas = document.getElementById("minimapCanvas") as HTMLCanvasElement;

miniMapCanvas.width = 300;
miniMapCanvas.height = 300;
carCanvas.width = window.innerWidth;
carCanvas.height=window.innerHeight;

const carCtx = carCanvas.getContext("2d") as CanvasRenderingContext2D;

// Use the loaded world data
const worldy = await loadData("/src/world/items/worlds/path_finding.world");

const world = World.load(worldy);

//load external car 
const carInfo = await loadData("/src/saves/right_hand_rule.car");
//set viewport
const viewport = new Viewport(carCanvas, world.zoom, world.offset);
const minimap = new MiniMap(miniMapCanvas,world.graph,300);

const N=10;
const cars=generateCars(1,"KEYS").concat(generateCars(N,"AI"));
const myCar=cars[0];
if(localStorage.getItem("bestBrain")){
    for(let i=0;i<cars.length;i++){
        cars[i].brain=JSON.parse(
            localStorage.getItem("bestBrain")!);
        if(i!=0){
            NeuralNetwork.mutate(cars[i].brain!,0.1);
        }
    }
}


//?? fech target n ....
const target = world.markings.find((m) => m instanceof Target)
//make car world borders
let roadBorders:Point[][]=[]
if (target) {
    world.generateCorridor(new Point(myCar.x, myCar.y), target.center);
    roadBorders=world.corridor.borders.map((s)=>[s.p1,s.p2]) // assign car to corridor paths;
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
    console.log(myCar.brain);
    localStorage.setItem("bestBrain", JSON.stringify(myCar.brain));
}

function discard() {
    localStorage.removeItem("bestBrain");
}

function generateCars(N: number, type?: "DUMMY" | "AI" | "KEYS"): Car[] {
    const color = type == "AI" ? getRandomColor() : "blue";
    const startPoints = world.markings.filter((m) => m instanceof Start);
    const startPoint = startPoints.length > 0 ? startPoints[0].center : new Point(100, 100); 
    const cars = [];

    const dir = startPoints.length > 0 ? startPoints[0].directionVector : new Point(0, -1);
    const startAngle = -angle(dir)+Math.PI / 2;

    for (let i = 1; i <= N; i++){
        const car = new Car(startPoint.x, startPoint.y, 30, 50, type!, startAngle,7,color)!;
        car.load(carInfo);
        cars.push(car);
    }
    return cars;
}

function animate(time?:number) {

    for(let i=0;i<cars.length;i++){
        cars[i].update(roadBorders,[]);
    }

    //pass cars to world
    world.cars = cars;
    world.bestCar = myCar;

    //!! camera follows bestCar
    viewport.offset.x = -myCar.x;
    viewport.offset.y = -myCar.y;
    
    //draw world ??-------------------
    viewport.reset();
    //??
    //calculate the viewPoint
    const viewPoint = scale(viewport.getOffset(), -1);
    world.draw(carCtx, viewPoint,false);
    //-----------------------------------
    //?? draw minimap
    minimap.update(viewPoint);

    //---------------------
    myCar.progress = 0;
    const carSeg = getNearestSegment(new Point(myCar.x, myCar.y), world.corridor.skeleton);
    for (let i = 0; i < world.corridor.skeleton.length; i++){
        const s = world.corridor.skeleton[i];
        if (s.equals(carSeg)) {
            const proj = s.projectPoint(new Point(myCar.x, myCar.y));
            proj.point.draw(carCtx, { color: "yellow" });
            const firstPartofSegment = new Segment(s.p1, proj.point);
            firstPartofSegment.draw(carCtx, { color: "red", width: 5 });
            myCar.progress += firstPartofSegment.length();
            break; 
        } else {
            s.draw(carCtx, { color: "red", width: 5 });
            myCar.progress += s.length();
        }
    }
    const totalDistance = world.corridor.skeleton.reduce(
        (acc,s)=>acc+s.length(),0)
    myCar.progress /= totalDistance;
    console.log(myCar.progress)
    requestAnimationFrame(animate);
}

