import Car from './car';
import './styles/style.css'
import { Visualizer } from './visualizer';
import { NeuralNetwork } from './network';

const carCanvas = document.getElementById("carCanvas") as HTMLCanvasElement;
const networkCanvas = document.getElementById("networkCanvas") as HTMLCanvasElement;

carCanvas.height = window.innerHeight-330;
carCanvas.width = 200;

networkCanvas.height = window.innerHeight;
networkCanvas.width = 450;

const carCtx = carCanvas.getContext("2d") as CanvasRenderingContext2D;
const networkCtx = networkCanvas.getContext("2d") as CanvasRenderingContext2D;


const N = 250;
const cars = generateCars(N);
//add controlType prop to car
// const car = new Car(100, 100, 30, 50,"AI");

const traffic = [
    new Car(100, -100, 30, 50,"DUMMY",2)
];
//??best car 

let bestCar = cars[0];
//! load previous bestcar Brain from localStorage
if (localStorage.getItem("bestBrain")) {
    for (let i = 0; i < cars.length; i++){
        console.log("load from storage")
        //set all cars to the best one
        cars[i].brain = JSON.parse(localStorage.getItem("bestBrain")!);
        if (i >= 0) {
            NeuralNetwork.mutate(cars[i].brain!,0.1)
        }
    }
}

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


function animate() {

    for (let i = 0; i < traffic.length; i++){
        traffic[i].update([],[]);
    }

    

    // //?? car with minimun Y value 
    // bestCar = cars.find(c => c.y == Math.min(...cars.map(c => c.y)))!;

    // //??moved up ...
    // //this one reset the size (height of canvas when windows resized)
    // // and it also clear the canvas on car move ?? maybe 
    // carCanvas.height = window.innerHeight;

    // carCanvas.height = window.innerHeight;
    // networkCanvas.height = window.innerHeight;
    
    // //?? make camera move with the car
    // carCtx.translate(0, -bestCar.y+carCanvas.height*.7); 


    // // draw traffic (cars others)
    // for (let i = 0; i < traffic.length; i++) {
    //     traffic[i].draw(carCtx);
    // }
    // //?? make other cars transparents 
    // carCtx.globalAlpha = 0.2; 
    // for (let i = 0; i < cars.length; i++) {
    //     cars[i].draw(carCtx);
    // }
    // carCtx.globalAlpha = 1;
    //  bestCar.draw(carCtx,true);

    // show car nn network (for the first one only)
    Visualizer.drawNetwork(networkCtx, bestCar?.brain!);
    //?? this one call animate func as many of possible , in continious 
    requestAnimationFrame(animate);
}

function generateCars(N:number):Car[] {
    const cars: Car[] = [];
    for (let i = 1; i <=N; i++) {
        cars.push(new Car(100, 100, 30, 50, "AI"));
    }
    return cars;
}

//??
function save() {
    console.log(bestCar.brain);
    localStorage.setItem("bestBrain", JSON.stringify(bestCar.brain));
}

function discard() {
    localStorage.removeItem("bestBrain");
}
