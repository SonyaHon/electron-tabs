
class AStar {
    constructor(pathMesh) {
        this.pathMesh = pathMesh;

        this.openSet = [];
        this.closedSet = [];
        this.savedPath = null;
    }

    findPath(startPoint, endPoint) {
        this.openSet = [];
        this.closedSet = [];
        this.openSet.push(this.pathMesh.getSpot(startPoint.x, startPoint.y));

        while(this.openSet.length > 0) {

        }

        this.savedPath = null;
        return null;
    }
}

export default AStar;