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

const rightPanelWidth = 300;
const carCanvas = document.getElementById("carCanvas") as HTMLCanvasElement;
const statisticsEl = document.getElementById("statistics") as HTMLDivElement;
const miniMapCanvas = document.getElementById("minimapCanvas") as HTMLCanvasElement;

miniMapCanvas.width = rightPanelWidth;
miniMapCanvas.height = rightPanelWidth;
carCanvas.width = window.innerWidth;
carCanvas.height=window.innerHeight;

statisticsEl.style.width = rightPanelWidth + "px";
statisticsEl.style.height = window.innerHeight - rightPanelWidth-40 + "px";

const carCtx = carCanvas.getContext("2d") as CanvasRenderingContext2D;

// Use the loaded world data
const worldy = await loadData("/src/world/items/worlds/path_finding.world");

const world = World.load(worldy);

//load external car 
const carInfo = await loadData("/src/saves/right_hand_rule.car");
//set viewport
const viewport = new Viewport(carCanvas, world.zoom, world.offset);
const minimap = new MiniMap(miniMapCanvas,world.graph,rightPanelWidth);

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

//?? cars
for (let i = 0; i<cars.length; i++){
    const div = document.createElement('div');
    div.id = `stat_${i}`;
    div.innerText = `${i}`;
    div.style.color = cars[i].color;
    div.classList.add("stat");
    statisticsEl.appendChild(div);
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

let frameCount=0;

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
    const startPoints = world.markings.filter((m) => m instanceof Start);
    const startPoint = startPoints.length > 0 ? startPoints[0].center : new Point(100, 100); 
    const cars = [];

    const dir = startPoints.length > 0 ? startPoints[0].directionVector : new Point(0, -1);
    const startAngle = -angle(dir)+Math.PI / 2;
    
    for (let i = 1; i <= N; i++){
        const color = type == "AI" ? getRandomColor() : "blue";
        const car = new Car(startPoint.x, startPoint.y, 30, 50, type!, startAngle,7,color)!;
        car.load(carInfo);
        cars.push(car);
    }
    return cars;
}

function UpdateCarProgress(car:Car) {
    if (!car.finishTime) {
        car.progress = 0;
        const carSeg = getNearestSegment(new Point(car.x, car.y), world.corridor.skeleton);
        for (let i = 0; i < world.corridor.skeleton.length; i++) {
            const s = world.corridor.skeleton[i];
            if (s.equals(carSeg)) {
                const proj = s.projectPoint(new Point(car.x, car.y));
                proj.point.draw(carCtx, { color: "yellow" });
                const firstPartofSegment = new Segment(s.p1, proj.point);
                firstPartofSegment.draw(carCtx, { color: "red", width: 5 });
                car.progress += firstPartofSegment.length();
                break;
            } else {
                s.draw(carCtx, { color: "red", width: 5 });
                car.progress += s.length();
            }
        }
        const totalDistance = world.corridor.skeleton.reduce(
            (acc, s) => acc + s.length(), 0)
        car.progress /= totalDistance;
        if (car.progress >= 1) {
            car.progress = 1;
            car.finishTime = frameCount;
        }
    }
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
    for (let i = 0; i < cars.length; i++) {
        UpdateCarProgress(cars[i]);
    }
    cars.sort((a, b) => b.progress - a.progress);// sort cars by progress
    for (let i = 0; i < cars.length; i++) {
        const stat = document.getElementById(`stat_${i}`) as HTMLDivElement;
        stat.style.color = cars[i].color;
        stat.innerText=`${i+1}: ${(cars[i].progress*100).toFixed(1)}%`
    }
    //!! inc frame 
    frameCount++;
    requestAnimationFrame(animate);
}

