
let GAME_PARAMS={
    width: 4000,
    height: 4000
};


class Game{

    players = [];

    colors=[
        0xFF5544,
        0x4455FF,
        0x55FF44,
        0x44FF55
    ];

    pellets=[];


    constructor(){
    }

    setup(){
        this.players.push(new Player(0, 200, 500));
        this.players.push(new Player(1, 800, 500));
        this.players.push(new Player(2, 500, 200));
        this.players.push(new Player(3, 500, 800));
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

            if(action.do_split){
                const MIN_SPLIT_MASS = 50;
                let new_cells=[];
                let del_cells=[];
                let old_cells=this.players[index].cells;
                for(let i=0;i<old_cells.length;i++){
                    if(old_cells[i].mass>=MIN_SPLIT_MASS){
                        del_cells.push(old_cells[i]);
                        new_cells.push(new Cell(old_cells[i].x,old_cells[i].y,index,Math.floor(old_cells[i].mass/2)));
                        new_cells.push(new Cell(old_cells[i].x,old_cells[i].y,index,old_cells[i].mass-Math.floor(old_cells[i].mass/2)))
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
                cells[i].vel_x *= SLOWDOWN;
                cells[i].vel_y *= SLOWDOWN;
                for (let j = 0; j < cells.length; j++) {
                    if (i === j) continue;
                    if (cells[i].intersects(cells[j])) {
                        Game.seperate(cells[i], cells[j])
                    } else {
                        // Game.go_closer(cells[i],cells[j])
                    }
                }
                let MOVE_FACTOR = 1 / cells[i].rad;
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

        this.resolve_eats()

        if(Math.random()<0.75) this.summon_pellet()
        // this.summon_pellet()
        // this.summon_pellet()

    }

    resolve_eats() {
        let recurse=false
        let done=false
        this.foreach_cell((i0, j0, _) => {
            if(done)return
            this.foreach_cell((i1, j1, _) => {
                if(done)return
                if (i0 === i1 && j0 === j1) return;
                let cell0 = this.players[i0].cells[j0]
                let cell1 = this.players[i1].cells[j1]
                // console.log(cell0,cell1)
                if (cell0.can_kill(cell1)) {
                    this.cell_kill(i0, j0, i1, j1, cell0, cell1)
                    done=true
                    recurse=true
                } else if (cell1.can_kill(cell0)) {
                    this.cell_kill(i1, j1, i0, j0, cell1, cell0)
                    done=true
                    recurse=true
                }
            })
        })
        if(recurse)this.resolve_eats()
    }

    cell_kill(i0,j0,i1,j1,c0,c1){
        // i0,j0,c0 kills i1,j1,c1
        this.players[i0].cells[j0].mass+=this.players[i1].cells[j1].mass
        app.stage.removeChild(this.players[i1].cells[j1].pixi_text)
        this.players[i1].cells.splice(j1,1)
    }

}