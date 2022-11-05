var c = document.getElementById("render");
var ctx = c.getContext("2d");
c.width = window.innerWidth;
c.height = window.innerHeight;

function addObject(x=Math.floor(Math.random() * (window.innerWidth - 200))+100, y=Math.floor(Math.random() * (window.innerHeight - 200))+100, v=[2 - Math.random() * 4, 2 - Math.random() * 4], m=(Math.floor(Math.random()+1) * 1000)) {
    var obj = new Circle([x, y], 15, v, m+1);
}

function sleep(ms) {return new Promise(resolve => setTimeout(resolve, ms));}
async function demo() {
    await sleep(100);
}
function poof() {
    Circle.allInstances.forEach( obj => {
        Circle.allInstances.forEach( col => {
            var hypot = Math.hypot(col.pos[0] - obj.pos[0], col.pos[1] - obj.pos[1]);
            if (col.pos[1] > obj.pos[1]) {
                var vx = col.pos[0] - obj.pos[0];
                var vy = col.pos[1] - obj.pos[1];
                col.vel[0] += vx/1000;
                col.vel[1] += vy/200000;
                obj.vel[0] += -vx/1000;
                obj.vel[1] += -vy/1000;
            } else if (col.pos[1] < obj.pos[1]) {
                var vx = obj.pos[0] - col.pos[0];
                var vy = obj.pos[1] - col.pos[1];
                obj.vel[0] += vx/1000;
                obj.vel[1] += vy/200000;
                col.vel[0] += -vx/1000;
                col.vel[1] += -vy/1000;
            } else {
                var vx = col.pos[0] - obj.pos[0];
                col.vel[0] += vx/10000;
                obj.vel[0] += -vx/10000;
            }
        });
    });
}

// physics
function physics(render) {
    render.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    
    // gravity
    Circle.allInstances.forEach(obj => {
        obj.vel[1] += render.gravity;
    });

    // move
    Circle.allInstances.forEach(obj => {
        obj.pos[1] += obj.vel[1];
        obj.pos[0] += obj.vel[0];
    });

    // collisions between objects
    /*
    Circle.allInstances.forEach( col => {
        Circle.allInstances.forEach( obj => {
            if (col.type == 'circle' && obj.type == 'circle') {
                var hypot = Math.hypot(col.pos[0] - obj.pos[0], col.pos[1] - obj.pos[1]);
                if (hypot < col.rad + obj.rad) {
                    if (hypot < obj.rad + col.rad + .1 && hypot > obj.rad + col.rad - .1) {
                        //addObject();
                    }
                    if (obj2.pos[1] > obj.pos[1]) {
                        var vx = obj2.pos[0] - obj.pos[0];
                        var vy = obj2.pos[1] - obj.pos[1];
                        obj2.vel[0] += vx/100;
                        obj2.vel[1] += vy/200;
                        obj.vel[0] += -vx/100;
                        obj.vel[1] += -vy/100;
                    } else if (obj2.pos[1] < obj.pos[1]) {
                        var vx = obj.pos[0] - obj2.pos[0];
                        var vy = obj.pos[1] - obj2.pos[1];
                        obj.vel[0] += vx/100;
                        obj.vel[1] += vy/200;
                        obj2.vel[0] += -vx/100;
                        obj2.vel[1] += -vy/100;
                    } else {
                        var vx = obj2.pos[0] - obj.pos[0];
                        obj2.vel[0] += vx/1000;
                        obj.vel[0] += -vx/1000;
                    }
                }
            }
        });
    });
    */
    /* */
    //for (i = 0; i < 24; i++) {
        /*
    Circle.allInstances.forEach(obj => {
        Circle.allInstances.forEach(obj2 => {
            if (obj != obj2) {
                dist = Math.hypot(obj.pos[0] - obj2.pos[0], obj.pos[1] - obj2.pos[1]);
                if (dist <= obj.rad + obj2.rad) {
                    /*
                    if (obj2.pos[1] > obj.pos[1]) {
                        var vx = obj2.pos[0] - obj.pos[0];
                        var vy = obj2.pos[1] - obj.pos[1];
                        obj2.vel[0] += vx/100 / 24;
                        obj2.vel[1] += vy/200 / 24;
                        obj.vel[0] += -vx/100 / 24;
                        obj.vel[1] += -vy/100 / 24;
                    } else if (obj2.pos[1] < obj.pos[1]) {
                        var vx = obj.pos[0] - obj2.pos[0];
                        var vy = obj.pos[1] - obj2.pos[1];
                        obj.vel[0] += vx/100 / 24;
                        obj.vel[1] += vy/200 / 24;
                        obj2.vel[0] += -vx/100 / 24;
                        obj2.vel[1] += -vy/100 / 24;
                    } else {
                        var vx = obj2.pos[0] - obj.pos[0];
                        obj2.vel[0] += vx/1000 / 24;
                        obj.vel[0] += -vx/1000 / 24;
                    }
                    /*
                    var objsca = Math.hypot(obj.vel[0], obj.vel[1]);
                    var obj2sca =Math.hypot(obj2.vel[0], obj2.vel[1]);
                    var objtheta = Math.atan(obj.vel[1] / obj.vel[0]);
                    var obj2theta = Math.atan(obj2.vel[1] / obj2.vel[0]);
                    var phi = Math.atan(obj.pos[0] - obj2.pos[0], obj.pos[1] - obj2.pos[1]);
                    var objmass = obj.mass;
                    var obj2mass = obj2.mass;
                    var objfvx = ((((objsca * Math.cos(objtheta - phi) * (objmass - obj2mass)) + (2 * (obj2mass * obj2sca * Math.cos(obj2theta - phi)))) / (objmass + obj2mass)) * Math.cos(phi)) + (objsca * Math.sin(objtheta - phi) * Math.cos(phi + (Math.PI / 2)));
                    var objfvy = ((((objsca * Math.cos(objtheta - phi) * (objmass - obj2mass)) + (2 * (obj2mass * obj2sca * Math.cos(obj2theta - phi)))) / (objmass + obj2mass)) * Math.sin(phi)) + (objsca * Math.sin(objtheta - phi) * Math.sin(phi + (Math.PI / 2)));
                    var obj2fvx = ((((obj2sca * Math.cos(obj2theta - phi) * (obj2mass - objmass)) + (2 * (objmass * objsca * Math.cos(objtheta - phi)))) / (obj2mass + objmass)) * Math.cos(phi)) + (obj2sca * Math.sin(obj2theta - phi) * Math.cos(phi + (Math.PI / 2)));
                    var obj2fvy = ((((obj2sca * Math.cos(obj2theta - phi) * (obj2mass - objmass)) + (2 * (objmass * objsca * Math.cos(objtheta - phi)))) / (obj2mass + objmass)) * Math.sin(phi)) + (obj2sca * Math.sin(obj2theta - phi) * Math.sin(phi + (Math.PI / 2)));
                    obj.vel = [objfvx, objfvy];
                    obj2.vel = [obj2fvx, obj2fvy];

                }
            }
        });
    });
    //}
    /**/
    // walls
    Circle.allInstances.forEach(obj => {
        // while not all do :
        while (obj.pos[0] < obj.rad || obj.pos[0] > window.innerWidth - obj.rad || obj.pos[1] < obj.rad || obj.pos[1] > window.innerHeight - obj.rad) {
            if (obj.pos[0] <= obj.rad) {
                //left
                // get gradient
                var m;
                obj.vel[0] == 0
                    ? m = 0
                    : m = obj.vel[1] / obj.vel[0];
                // get position on line r from wall
                var u = obj.pos[0];
                var v = obj.pos[1];
                var a = obj.rad;
                var b = - m * (u - a) + v;
                // set new pos
                if (m == 0) {
                    obj.pos[0] = a - (obj.pos[0] - a);
                } else {
                    obj.pos[0] = ((obj.pos[1] - b) / - m) + a;
                }
                obj.vel[1] *= .9995;
                obj.vel[0] = -obj.vel[0] * 0.6 * (1 - 10/obj.mass);
            }
            if (obj.pos[0] >= window.innerWidth - obj.rad) {
                //right
                // get gradient
                var m;
                obj.vel[0] == 0
                    ? m = 0
                    : m = obj.vel[1] / obj.vel[0];
                // get position on line r from wall
                var u = obj.pos[0];
                var v = obj.pos[1];
                var a = window.innerWidth - obj.rad;
                var b = - m * (u - a) + v;
                // set new pos
                if (m == 0) {
                    obj.pos[0] = a - (obj.pos[0] - a);
                } else {
                    obj.pos[0] = ((obj.pos[1] - b) / - m) + a;
                }
                obj.vel[1] *= .9995;
                obj.vel[0] = -obj.vel[0] * 0.6 * (1 - 10/obj.mass);
            }
            if (obj.pos[1] <= obj.rad) {
                //top
                // get gradient
                var m;
                obj.vel[0] == 0
                    ? m = 0
                    : m = obj.vel[1] / obj.vel[0];
                // get position on line r from wall
                var u = obj.pos[1];
                var v = obj.pos[0];
                var a = obj.rad;
                var b = - m * (u - a) + v;
                // set new pos
                if (m == 0) {
                    obj.pos[1] = a - (obj.pos[1] - a);
                } else {
                    obj.pos[1] = ((obj.pos[0] - b) / - m) + a;
                }
                obj.vel[0] *= .9995;
                obj.vel[1] = -obj.vel[1] * 0.6 * (1 - 10/obj.mass);
            }
            if (obj.pos[1] >= window.innerHeight - obj.rad) {
                //bottom
                // get gradient
                var m;
                obj.vel[0] == 0
                    ? m = 0
                    : m = obj.vel[1] / obj.vel[0];
                // get position on line r from wall
                var u = obj.pos[1];
                var v = obj.pos[0];
                var a = window.innerHeight - obj.rad;
                var b = - m * (u - a) + v;
                // set new pos
                if (m == 0) {
                    obj.pos[1] = a - (obj.pos[1] - a);
                } else {
                    obj.pos[1] = ((obj.pos[0] - b) / - m) + a;
                }
                obj.vel[0] *= .9995;
                obj.vel[1] = -obj.vel[1] * 0.6 * (1 - 10/obj.mass);
            }
        }
    });
    // draw
    Circle.allInstances.forEach(obj => {
        render.circle(render.ctx, obj.pos[0], obj.pos[1], obj.rad, obj.mass);
    });
}


// classes

class Circle {
    constructor([x, y], rad, [vx, vy]) {
        this.pos = [x, y];
        this.rad = rad;
        this.vel = [vx, vy];
        this.mass = rad;
        Circle.allInstances.push(this);
    }
}

class Render {
    constructor(ctx, w, h, g) {
        this.ctx = ctx;
        this.width = w;
        this.height = h;
        this.gravity = g/100;
    }
    render() {
        clearInterval(this.run);
        this.run = setInterval(() => {physics(this)}, 1/60);
    }
    pause() {
        clearInterval(this.run);
    }
    step() {
        physics(this);
    }
    circle(ctx, x, y, r, m) {
        ctx.beginPath();
        ctx.strokeStyle = 'rgb(' + (255*(m/1000)) + ', 0, 0)';
        ctx.fillStyle = 'rgb(' + (255*(m/1000)) + ', 0, 0)';
        ctx.arc(x, y, r, 0, 2 * Math.PI, false);
        ctx.fill();
    }
}

// run

c.addEventListener("mousedown", function(e) { 
    var cX = Math.round(e.clientX/c.getBoundingClientRect().width * window.innerWidth);
    var cY = Math.round(e.clientY/c.getBoundingClientRect().height * window.innerHeight);
    mouseCoords = [cX, cY];

    c.addEventListener("mouseup", (event) => {
        var cX2 = Math.round(event.clientX/c.getBoundingClientRect().width * window.innerWidth);
        var cY2 = Math.round(event.clientY/c.getBoundingClientRect().height * window.innerHeight);
        mouseCoords2 = [-(cX2 - cX)/100, -(cY2 - cY)/10];
    });
    
    addObject(mouseCoords[0], mouseCoords[1], mouseCoords2, 100);
});

const world = new Render(ctx, window.innerWidth, window.innerHeight, 9.8);

Circle.allInstances = [];
world.render();