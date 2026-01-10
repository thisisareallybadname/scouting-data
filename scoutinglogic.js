function tick() {
    requestAnimationFrame(tick)

    //alert("HELP ME")
    // console.log("smth")
    let x = Math.random() * innerWidth
    let y = Math.random() * innerHeight
    moveTo(x, y)

}

tick()