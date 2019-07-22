
class Cell {
    x=0;
    y=0;
    mass=0;
    player_id=0;

    vel_x=0;
    vel_y=0;

    render_x=0
    render_y=0
    render_mass=0

    pixi_text=undefined;

    merge_end=undefined

    get rad(){
        return 10*Math.pow(this.mass,0.4)
    }

    get render_rad(){
        return 10*Math.pow(this.render_mass,0.4)
    }

    constructor(x,y,player_id,mass,merge_end){
        this.x=x;
        this.y=y;
        this.player_id=player_id;
        this.mass=mass;
        this.pixi_text=new PIXI.Text("",{font:"arial",fill:"#FFFFFF",align:"center",stroke:"#FFFFFF",strokeThickness:0,fontSize:20});
        this.pixi_text.anchor.set(0.5);
        app.stage.addChild(this.pixi_text)

        this.render_x=x
        this.render_y=y
        this.render_mass=mass

        this.merge_end=new Date().getTime()+1000
        if(!!merge_end)this.merge_end=merge_end
    }

    can_merge(){
        return new Date().getTime()>this.merge_end
    }

    update(){
        let FACTOR=0.1
        this.render_x=utils.lerp(this.render_x,this.x,FACTOR)
        this.render_y=utils.lerp(this.render_y,this.y,FACTOR)
        this.render_mass=utils.lerp(this.render_mass,this.mass,FACTOR)
    }

    intersects(other){
        return utils.dist(this.x,this.y,other.x,other.y)<this.rad+other.rad
    }

    can_kill(other_cell){
        return this.mass>=other_cell.mass*1.25&&utils.dist(this.x,this.y,other_cell.x,other_cell.y)<this.rad/2+other_cell.rad/2
    }

}