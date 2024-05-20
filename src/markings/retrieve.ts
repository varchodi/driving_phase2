import { Marking } from "./marking";
import { Point } from "../primitives/point";
import { Crossing } from "./crossing";
import { Light } from "./light";
import { Parking } from "./parking";
import { Start } from "./start";
import { Stop } from "./stop";
import { Target } from "./target";
import { Yield } from "./yield";

export function retrieve(info: Marking) {
    const point = new Point(info.center.x, info.center.y);
        const dir = new Point(info.directionVector.x, info.directionVector.y);

        switch (info.type) {
            case "crossing":
                return new Crossing(point, dir, info.width, info.height);
            case "light":
                return new Light(point, dir, info.width, info.height);
            case "parking":
                return new Parking(point, dir, info.width, info.height);
            case "start":
                return new Start(point, dir, info.width, info.height);
            case "stop":
                return new Stop(point, dir, info.width, info.height);
            case "target":
                return new Target(point, dir, info.width, info.height);
            case "yeild":
                return new Yield(point, dir, info.width, info.height);
        }
}