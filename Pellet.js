
class Pellet {
    x=0;
    y=0;
    color=0;
    radius=5;
    mass=5
    pixi_circle=undefined;

    get rad(){
        return 5
    }

    constructor(x,y,color){
        this.x=x;
        this.y=y;
        this.color=color;
        this.pixi_circle=new PIXI.Circle(this.x,this.y,this.radius)
        // app.stage.addChild(this.pixi_circle)
    }

    intersects(cell){
        return utils.dist(this.x,this.y,cell.x,cell.y)<cell.rad
    }

}