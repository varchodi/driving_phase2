import { Light } from "../markings/light";
import { Point } from "../primitives/point";
import { Viewport } from "../viewport";
import { World } from "../world";
import { MarkingEditor } from "./markingEditor";

export class LightEditor extends MarkingEditor{
    
    constructor( viewport: Viewport,  world: World) {
        super(viewport,world,world.laneGuides)
    }

    public createMarking(center: Point, directionVector: Point) {
        return new Light(
            center,
            directionVector,
            this.world.roadWidth / 2,
            this.world.roadWidth / 2
        )
    }
}