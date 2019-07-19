const app=new PIXI.Application({
    width:500,
    height:500,
    antialias:true,
    transparent:false,
    resolution:1,
    backgroundColor:0x1099bb
})

app.stage.interactive=true

document.body.appendChild(app.view)

let blob=new Cell(100,100,30)

let g=new PIXI.Graphics()

g.beginFill(0xFF5544)
g.drawCircle(blob.x,blob.y,blob.rad)
g.endFill()

app.stage.addChild(g)
