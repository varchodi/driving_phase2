import { Stop } from "../markings/stop";
import { Point } from "../primitives/point";
import { Viewport } from "../viewport";
import { World } from "../world";
import { MarkingEditor } from "./markingEditor";

export class StopEditor extends MarkingEditor{
    
    constructor( viewport: Viewport,  world: World) {
        super(viewport,world,world.laneGuides)
    }

    public createMarking(center: Point, directionVector: Point) {
        return new Stop(
            center,
            directionVector,
            this.world.roadWidth / 2,
            this.world.roadWidth/2
        )
    }
}