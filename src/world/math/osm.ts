export const Osm = {
    parseRoads: (data: any) => {
        const nodes = data.elements.filter((n: any) => n.type == "node");
        console.log(nodes);
    }
}