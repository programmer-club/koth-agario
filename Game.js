
let GAME_PARAMS={
    width: 1500,
    height: 1000
};

const randColor=()=>Math.floor(0xFFFFFF*Math.random());

const rand=(x)=>Math.floor(Math.random()*x)
const comp2hex=(c)=>{
    let h=c.toString(16)
    return (h.length===1?"0":"")+h
}
const make_color=(r,g,b)=>{
    let h=comp2hex(r)+comp2hex(g)+comp2hex(b)
    return parseInt(h, 16);
}


class Game{

    players = [];

    colors=[
    ];

    pellets=[];


    constructor(){
    }

    instantiate(i,m,bot,col){
        this.players.push(new bot(i, Math.random()*(GAME_PARAMS.width-m*2)+m,Math.random()*(GAME_PARAMS.height-m*2)+m));
        this.colors.push(col)
    }

    // START BOTS
    bots=[
        {
            bot: BotMackycheese0,
            count: 5,
            color: ()=>make_color(255,rand(100),rand(100))
        },
        {
            bot: BotMackycheese1,
            count: 5,
            color: ()=>make_color(rand(100),255,rand(100))
        },
        {
            bot: BotMackycheese2,
            count: 5,
            color: ()=>make_color(rand(100),rand(100),255)
        },
        {
            bot: BotPlayer,
            count: 1,
            color: ()=>make_color(150,150,150)
        }
    ];
    //END BOTS

    setup(){
        // this.players.push(new Player(0, 200, 500));
        // this.players.push(new Player(1, 800, 500));
        // this.players.push(new Player(2, 500, 200));
        // this.players.push(new Player(3, 500, 800));
        let m=20;
        let id=0;
        for(let i=0;i<this.bots.length;i++){
            // console.log("ID "+i+" = "+color);
            for(let j=0;j<this.bots[i].count;j++){
                let color=this.bots[i].color()
                this.instantiate(id++,m,this.bots[i].bot,color)
            }
        }
    }

    summon_pellet(){
        let m=50;
        this.pellets.push(new Pellet(Math.random()*(GAME_PARAMS.width-m*2)+m,Math.random()*(GAME_PARAMS.height-m*2)+m,Math.floor(0xFFFFFF*Math.random())))
    }

    update_player(index){
        let dead_pellets=new Array(this.pellets.length);
        for(let i=0;i<this.pellets.length;i++){
            dead_pellets[i]=false
        }
        for(let iter=0;iter<10;iter++) {
            const SLOWDOWN = 0.9;

            let action = this.players[index].next_action(this);
            if(!action)continue;
            let num_cells=this.players[index].cells.length;
            if(action.do_split){
                const MIN_SPLIT_MASS = 50;
                let new_cells=[];
                let del_cells=[];
                let old_cells=this.players[index].cells;
                for(let i=0;i<old_cells.length;i++){
                    if(old_cells[i].mass>=MIN_SPLIT_MASS){
                        del_cells.push(old_cells[i]);
                        let DELAY=5000;
                        let dx=action.target_x-old_cells[i].x;
                        let dy=action.target_y-old_cells[i].y;
                        if(dx*dx+dy*dy>5){
                            let m=Math.sqrt(dx*dx+dy*dy);
                            dx/=m;
                            dy/=m
                        }
                        num_cells+=1;
                        // if(num_cells>16)continue;
                        new_cells.push(new Cell(old_cells[i].x+dx,old_cells[i].y+dy,index,Math.floor(old_cells[i].mass/2),new Date().getTime()+DELAY));
                        new_cells.push(new Cell(old_cells[i].x,old_cells[i].y,index,old_cells[i].mass-Math.floor(old_cells[i].mass/2),new Date().getTime()+DELAY))
                    }
                }
                this.players[index].cells=this.players[index].cells.filter(cell => !del_cells.includes(cell));
                for(let i=0;i<new_cells.length;i++)this.players[index].cells.push(new_cells[i]);
                for(let i=0;i<del_cells.length;i++){
                    app.stage.removeChild(del_cells[i].pixi_text)
                }
            }

            let cells = this.players[index].cells;
            for (let i = 0; i < cells.length; i++) {
                // cells[i].mass = Math.ceil(0.999*cells[i].mass)
                cells[i].vel_x *= SLOWDOWN;
                cells[i].vel_y *= SLOWDOWN;
                cells[i].update();
                for (let j = 0; j < cells.length; j++) {
                    if (i === j) continue;
                    if (cells[i].intersects(cells[j])&&!Game.should_merge(cells[i],cells[j])) {
                        Game.seperate(cells[i], cells[j])
                    } else {
                        // Game.go_closer(cells[i],cells[j])
                    }
                }
                let MOVE_FACTOR = 1 / Math.pow(cells[i].rad,1.1);
                cells[i].x += cells[i].vel_x;
                cells[i].y += cells[i].vel_y;
                Game.move_cell(cells[i],action,MOVE_FACTOR);
                // cells[i].vel_x += action.move_x * MOVE_FACTOR;
                // cells[i].vel_y += action.move_y * MOVE_FACTOR;
                Game.bounds_check(cells[i]);
                for(let j=0;j<this.pellets.length;j++){
                    if(dead_pellets[j])continue;
                    if(this.pellets[j].intersects(cells[i])){
                        cells[i].mass+=2;
                        dead_pellets[j]=true
                    }
                }
            }
        }
        let new_pellets=[];
        for(let i=0;i<this.pellets.length;i++){
            if(!dead_pellets[i])new_pellets.push(this.pellets[i])
        }
        this.pellets=new_pellets
    }

    static should_merge(c0,c1){
        return c0.can_merge()&&c1.can_merge()
    }

    static move_cell(cell,action,MOVE_FACTOR){
        let dx=action.target_x-cell.x;
        let dy=action.target_y-cell.y;
        let mag=utils.dist(0,0,dx,dy);
        if(mag>=1){
            dx/=mag;
            dy/=mag
        }
        cell.vel_x+=dx*MOVE_FACTOR;
        cell.vel_y+=dy*MOVE_FACTOR
    }

    static bounds_check(cell) {
        let dx = 0;
        let dy = 0;
        if (cell.x < cell.rad) cell.x = cell.rad;
        if (cell.y < cell.rad) cell.y = cell.rad;
        if (cell.x > GAME_PARAMS.width - cell.rad) cell.x = GAME_PARAMS.width - cell.rad;
        if (cell.y > GAME_PARAMS.height - cell.rad) cell.y = GAME_PARAMS.height - cell.rad
    }

    static operate(cell0,cell1,AMOUNT,iters){
        AMOUNT/=iters;
        for(let i=0;i<iters;i++) {
            let dx = cell0.x - cell1.x;
            let dy = cell0.y - cell1.y;
            // AMOUNT*=Math.sqrt(dx*dx+dy*dy)
            dx *= AMOUNT;
            dy *= AMOUNT;
            cell0.vel_x += dx;
            cell0.vel_y += dy;
            cell1.vel_x -= dx;
            cell1.vel_y -= dy
        }
    }

    static seperate(cell0,cell1){
        Game.operate(cell0,cell1,0.0025,10)
    }

    // static go_closer(cell0,cell1){
    //     Game.operate(cell0,cell1,-0.01,10)
    // }

    foreach_cell(f){
        for(let i=0;i<this.players.length;i++){
            for(let j=0;j<this.players[i].cells.length;j++){
                f(i,j,this.players[i].cells[j])
            }
        }
    }

    frame(){

        for(let i=0;i<this.players.length;i++){
            this.update_player(i)
        }

        this.resolve_eats();

        if(Math.random()<0.5) this.summon_pellet()
        // this.summon_pellet()
        // this.summon_pellet()

    }

    resolve_eats() {
        let recurse=false;
        let done=false;
        this.foreach_cell((i0, j0, _) => {
            if(done)return;
            this.foreach_cell((i1, j1, _) => {
                if(done)return;
                if (i0 === i1 && j0 === j1) return;
                let cell0 = this.players[i0].cells[j0];
                let cell1 = this.players[i1].cells[j1];
                // console.log(cell0,cell1)
                if (cell0.can_kill(cell1)) {
                    this.cell_kill(i0, j0, i1, j1, cell0, cell1);
                    done=true;
                    recurse=true
                } else if (cell1.can_kill(cell0)) {
                    this.cell_kill(i1, j1, i0, j0, cell1, cell0);
                    done=true;
                    recurse=true
                }
            })
        });
        if(recurse)this.resolve_eats()
    }

    cell_kill(i0,j0,i1,j1,c0,c1){
        // i0,j0,c0 kills i1,j1,c1
        let LOSS;
        if(i0===i1)LOSS=1.0;
        else LOSS=0.8;
        this.players[i0].cells[j0].mass+=Math.floor(this.players[i1].cells[j1].mass*LOSS);
        if(i0===i1){
            this.players[i0].cells[j0].merge_end+=5000
        }
        app.stage.removeChild(this.players[i1].cells[j1].pixi_text);
        this.players[i1].cells.splice(j1,1)
    }

}