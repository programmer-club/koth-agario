
class Cell {
    x=0
    y=0
    mass=0
    player_id=0

    vel_x=0
    vel_y=0

    pixi_text=undefined

    get rad(){
        return 10*Math.pow(this.mass,0.4)
    }

    constructor(x,y,player_id,mass){
        this.x=x
        this.y=y
        this.player_id=player_id
        this.mass=mass
        this.pixi_text=new PIXI.Text("",{font:"arial",fill:"#FFFFFF",align:"center",stroke:"#FFFFFF",strokeThickness:0,fontSize:20})
        this.pixi_text.anchor.set(0.5)
        app.stage.addChild(this.pixi_text)
    }

    intersects(other){
        return utils.dist(this.x,this.y,other.x,other.y)<this.rad+other.rad
    }

}