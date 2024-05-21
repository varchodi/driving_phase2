import Car from './car';
import './styles/style.css'
import { Visualizer } from './visualizer';
import { NeuralNetwork } from './network';
import { getRandomColor } from './util';

const carCanvas = document.getElementById("carCanvas") as HTMLCanvasElement;
const networkCanvas = document.getElementById("networkCanvas") as HTMLCanvasElement;

carCanvas.height = window.innerHeight - 330;
carCanvas.width = 200;

networkCanvas.height = window.innerHeight;
networkCanvas.width = 450;

const carCtx = carCanvas.getContext("2d") as CanvasRenderingContext2D;
const networkCtx = networkCanvas.getContext("2d") as CanvasRenderingContext2D;


const road: any = null;
//add controlType prop to car
// const car = new Car(100, 100, 30, 50,"AI");
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

function generateCars(N:number):Car[] {
    const cars=[];
    for(let i=1;i<=N;i++){
        cars.push(new Car(100,100,30,50,"KEYS")!);
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

    carCanvas.height=window.innerHeight;
    networkCanvas.height=window.innerHeight;

    for(let i=0;i<traffic.length;i++){
        traffic[i].draw(carCtx);
    }
    carCtx.globalAlpha=0.2;
    for(let i=0;i<cars.length;i++){
        cars[i].draw(carCtx);
    }
    carCtx.globalAlpha=1;
    bestCar.draw(carCtx,true);

    networkCtx.lineDashOffset=-time!/50;
    Visualizer.drawNetwork(networkCtx,bestCar.brain!);
    requestAnimationFrame(animate);
}

