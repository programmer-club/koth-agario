
let game=new Game()

const app=new PIXI.Application({
    width:game.width,
    height:game.height,
    antialias:true,
    transparent:false,
    resolution:1,
    backgroundColor:0xBFAAAA
})

game.setup()

app.stage.interactive=true

document.body.appendChild(app.view)

let g=new PIXI.Graphics()
app.stage.addChild(g)

let stats=new Stats()
stats.showPanel(0)
document.body.appendChild(stats.dom)


let render_cell=(cell)=>{
    g.beginFill(game.colors[cell.player_id])
    g.lineStyle(1,0x000000)
    g.drawCircle(cell.x,cell.y,cell.rad)
    g.endFill()


    // txt=new PIXI.Text(""+cell.mass,{font:"arial",fill:"#FFFFFF",align:"center",stroke:"#FFFFFF",strokeThickness:0,fontSize:20})
    // txt.position.x=cell.x
    // txt.position.y=cell.y

    app.stage.removeChild(cell.pixi_text)

    cell.pixi_text.position.x=cell.x
    cell.pixi_text.position.y=cell.y
    cell.pixi_text.text=""+cell.mass

    app.stage.addChild(cell.pixi_text)

    // cell.pixi_text.text=""+cell.mass
    // cell.pixi_text.position.x=cell.x
    // cell.pixi_text.position.y=cell.y
    // g.addChild(cell.pixi_text)

    return cell

}

app.ticker.add(()=>{
    stats.begin()

    g.clear()
    while(g.children.length>0)g.removeChild(g.children[0])

    for(let i=0;i<game.players.length;i++){
        for(let j=0;j<game.players[i].cells.length;j++){
            game.players[i].cells[j]=render_cell(game.players[i].cells[j])
        }
    }

    game.frame()

    stats.end()
})