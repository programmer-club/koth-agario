
class BotMackycheese2 extends Player{

    get name(){
        return "BotMackycheese2"
    }

    constructor(id,x,y){
        super(id,x,y)
    }


    get_vector_for_cell(x,y,rad,mass){
        const HUNGRINESS=5
        const FEAR=2
        let vec={x:0,y:0}
        this.for_each_cell(cell_index=>{
            // console.log("SOMETHING SPOTTED")
            // console.log("cell")
            let cell=this.cells[cell_index]
            let dist=utils.dist(x,y,cell.x,cell.y)
            // if(utils.dist(cell.x,cell.y,x,y)>300)return
            if(dist>300)return
            let dist_sq=dist*dist
            let dx=x-cell.x
            let dy=y-cell.y
            if(rad*1.25<cell.rad){
                vec.x+=dx*HUNGRINESS*mass/dist
                vec.y+=dy*HUNGRINESS*mass/dist
                // console.log("EDIBLE SPOTTED")
            }else{//RUN
                vec.x-=dx*FEAR*mass/dist_sq
                vec.y-=dy*FEAR*mass/dist_sq
            }
        })
        return vec
    }

    next_action(game){
        let vec={x:0,y:0};
        let vecs=[]
        for(let i=0;i<game.pellets.length;i++){
            let v=this.get_vector_for_cell(game.pellets[i].x,game.pellets[i].y,game.pellets[i].rad,game.pellets[i].mass)
            vecs.push(v)
            vec.x+=v.x;
            vec.y+=v.y;
        }
        // vecs.sort((a,b)=>{
        //     a=a.x*a.x+a.y*a.y
        //     b=b.x*b.x+b.y*b.y
        //     if(a>b)return -1
        //     if(b>a)return 1
        //     return 0
        // })
        game.foreach_cell((player_id,cell_id,cell)=>{
            if(this.id===player_id)return;
            let v=this.get_vector_for_cell(cell.x,cell.y,cell.rad,cell.mass)
            vecs.push(v)
            vec.x+=v.x;
            vec.y+=v.y;
        })
        if(isNaN(vec.x))vec.x=0;
        if(isNaN(vec.y))vec.y=0;
        let m=Math.sqrt(vec.x*vec.x+vec.y*vec.y)*0.001;
        vec.x/=m;
        vec.y/=m;
        if(isNaN(vec.x))vec.x=0;
        if(isNaN(vec.y))vec.y=0;
        // vec=vecs[0]
        // console.log(vec.x,vec.y)
        return new Action(this.center_x_mass()+vec.x*0.1,this.center_y_mass()+vec.y*0.1,false)
    }

}