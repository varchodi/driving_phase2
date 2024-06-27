import Controls from "./controls";
import Sensor from "./sensor";
import { polysIntersect } from "./util";
import { NeuralNetwork } from "./network";
import { Engine, explode } from "./sound";
export default class Car {
    controls: Controls;
    speed: number;
    acceleration: number;
    maxSpeed: number;
    friction: number;
    sensor: Sensor;
    brain?: NeuralNetwork;
    polygon: { x: number; y: number; }[]=[];
    damaged: boolean;
    useBrain?: boolean;
    img: HTMLImageElement;
    mask: HTMLCanvasElement;
    fittness: number;
    public type:'AI'|'DUMMY'|'KEYS'
    public progress: number = null!;
    public finishTime: number = null!;
    public name: string = null!;
    public engine: Engine = null!;

    constructor(public x: number, public y: number, public width: number, public height: number,public controlType:'AI'|'DUMMY'|'KEYS',public angle:number=0,maxSpeed:number=7,public color:string="blue") {
        this.x=x;
        this.y=y;
        this.width=width;
        this.height = height;
        this.color = color;
        this.type = controlType;

        this.speed=0;
        this.acceleration=0.2;
        this.maxSpeed=maxSpeed;
        this.friction=0.05;
        this.angle=angle;
        this.damaged = false;
        
        this.sensor = new Sensor(this);

        //?? Hoe much car move(travel)<->Still exist
        this.fittness = 0;

        this.useBrain=controlType==="AI";

        if(controlType==="AI"){
            this.sensor=new Sensor(this);
            this.brain=new NeuralNetwork(
                [this.sensor.rayCount,6,4]
            );
        }
        this.controls=new Controls(controlType);

        this.img=new Image();
        this.img.src = "/src/world/items/images/car.png";

        this.mask=document.createElement("canvas");
        this.mask.width=width;
        this.mask.height=height;

        const maskCtx=this.mask.getContext("2d")!;
        this.img.onload=()=>{
            maskCtx.fillStyle=color;
            maskCtx.rect(0,0,this.width,this.height);
            maskCtx.fill();

            maskCtx.globalCompositeOperation="destination-atop";
            maskCtx.drawImage(this.img,0,0,this.width,this.height);
        }

        // this.update([], []);
    }

    // ?? load car
    public load(info: any) {
        try {
            this.brain = info.brain;
        this.maxSpeed = info.maxSpeed;
        this.friction = info.friction;
        this.acceleration = info.acceleration;
        this.sensor.rayCount = info.sensor.rayCount;
        this.sensor.raySpread = info.sensor.raySpread;
        this.sensor.rayLength = info.sensor.rayLength;
            this.sensor.rayOffset = info.sensor.rayOffset;
        } catch (error) {
            console.log("oups, samething in here")
        }
        

    }

    //update stuff while car control
    update(roadBorders: {
        x: number;
        y: number;
    }[][],traffic:typeof this[]) {
        //?? if car not damaged ; can't move anymore ... (car stop)
        if(!this.damaged){
            this.#move();
            //update 
            this.fittness += this.speed;
            
            this.polygon=this.#createPolygon();
            this.damaged = this.assessDamage(roadBorders, traffic);
            
            if (this.damaged) {
                this.speed = 0;
                if (this.type == 'KEYS') explode();
            }
        }
        if(this.sensor){
            this.sensor.update(roadBorders,traffic);
            const offsets=this.sensor.readings.map(
                s=>s==null?0:1-s.offset
            ).concat([this.speed/this.maxSpeed]);
            const outputs=NeuralNetwork.feedForward(offsets,this.brain!);

            if(this.useBrain){
                this.controls.forward=outputs[0];
                this.controls.left=outputs[1];
                this.controls.right=outputs[2];
                this.controls.reverse=outputs[3];
            }
        }
        if (this.engine) {
            const percent = Math.abs(this.speed / this.maxSpeed);
            this.engine.setVolume(percent);
            this.engine.setPitch(percent);
            
        }
    }

    private assessDamage(roadBorders: Array<typeof this.polygon>, traffic: Car[]): boolean {
        for(let i=0;i<roadBorders.length;i++){
            if(polysIntersect(this.polygon,roadBorders[i])){
                return true;
            }
        }
        for(let i=0;i<traffic.length;i++){
            if(polysIntersect(this.polygon,traffic[i].polygon)){
                return true;
            }
        }
        return false;
    }

    #createPolygon() {
        const points=[];
        const rad=Math.hypot(this.width,this.height)/2;
        const alpha=Math.atan2(this.width,this.height);
        points.push({
            x:this.x-Math.sin(this.angle-alpha)*rad,
            y:this.y-Math.cos(this.angle-alpha)*rad
        });
        points.push({
            x:this.x-Math.sin(this.angle+alpha)*rad,
            y:this.y-Math.cos(this.angle+alpha)*rad
        });
        points.push({
            x:this.x-Math.sin(Math.PI+this.angle-alpha)*rad,
            y:this.y-Math.cos(Math.PI+this.angle-alpha)*rad
        });
        points.push({
            x:this.x-Math.sin(Math.PI+this.angle+alpha)*rad,
            y:this.y-Math.cos(Math.PI+this.angle+alpha)*rad
        });
        return points;

    }
    //move
    #move() {
        if(this.controls.forward){
            this.speed+=this.acceleration;
        }
        if(this.controls.reverse){
            this.speed-=this.acceleration;
        }

        if(this.speed>this.maxSpeed){
            this.speed=this.maxSpeed;
        }
        if(this.speed<-this.maxSpeed/2){
            this.speed=-this.maxSpeed/2;
        }

        if(this.speed>0){
            this.speed-=this.friction;
        }
        if(this.speed<0){
            this.speed+=this.friction;
        }
        if(Math.abs(this.speed)<this.friction){
            this.speed=0;
        }

        if(this.speed!=0){
            const flip=this.speed>0?1:-1;
            if(this.controls.left){
                this.angle+=0.03*flip;
            }
            if(this.controls.right){
                this.angle-=0.03*flip;
            }
        }

        this.x-=Math.sin(this.angle)*this.speed;
        this.y-=Math.cos(this.angle)*this.speed;
    }

    public draw(ctx: CanvasRenderingContext2D,drawSensor:boolean=false) {
        if(this.sensor && drawSensor){
            this.sensor.draw(ctx);
        }

        ctx.save();
        ctx.translate(this.x,this.y);
        ctx.rotate(-this.angle);
        if(!this.damaged){
            ctx.drawImage(this.mask,
                -this.width/2,
                -this.height/2,
                this.width,
                this.height);
            ctx.globalCompositeOperation="multiply";
        }
        ctx.drawImage(this.img,
            -this.width/2,
            -this.height/2,
            this.width,
            this.height);
        ctx.restore();

    }
}
