
let game=new Game();

const app=new PIXI.Application({
    width:GAME_PARAMS.width,
    height:GAME_PARAMS.height,
    antialias:true,
    transparent:false,
    resolution:0.5,
    backgroundColor:0xAAAAAA
});

game.setup();

app.stage.interactive=true;

document.body.appendChild(app.view);

let g=new PIXI.Graphics();
app.stage.addChild(g);

let stats=new Stats();
stats.showPanel(0);
document.body.appendChild(stats.dom);


let render_cell=(cell)=>{
    g.beginFill(game.colors[cell.player_id]);
    g.lineStyle(1,0x000000);
    g.drawCircle(cell.render_x,cell.render_y,cell.render_rad);
    g.endFill();

    app.stage.removeChild(cell.pixi_text);

    cell.pixi_text.position.x=cell.render_x;
    cell.pixi_text.position.y=cell.render_y;
    cell.pixi_text.text=""+cell.mass;

    app.stage.addChild(cell.pixi_text)
};

let render_pellet=(pellet)=>{
    g.beginFill(pellet.color);
    g.lineStyle(0,0x000000)
    g.drawCircle(pellet.x,pellet.y,pellet.radius);
    g.endFill()
};

app.ticker.add(()=>{
    stats.begin();

    g.clear();

    for(let i=0;i<game.players.length;i++){
        for(let j=0;j<game.players[i].cells.length;j++){
            render_cell(game.players[i].cells[j])
        }
    }
    for(let i=0;i<game.pellets.length;i++){
        render_pellet(game.pellets[i])
    }

    game.frame();
    // game.frame();
    // game.frame();

    stats.end()
});