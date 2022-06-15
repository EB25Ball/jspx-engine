var c = document.getElementById("render");
var ctx = c.getContext("2d");
c.width = window.innerWidth;
c.height = window.innerHeight;

function addObject(x=Math.floor(Math.random() * (window.innerWidth - 200))+100, y=Math.floor(Math.random() * (window.innerHeight - 200))+100, v=[2 - Math.random() * 4, 2 - Math.random() * 4], m=Math.floor(Math.random() * 1000)) {
    var obj = new Circle([x, y], Math.floor(Math.random() * 20)+5, v, m);
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
    Circle.allInstances.forEach(obj => {
        Circle.allInstances.forEach(obj2 => {
            if (obj != obj2) {
                dist = Math.hypot(obj.pos[0] - obj2.pos[0], obj.pos[1] - obj2.pos[1]);
                if (dist <= obj.rad + obj2.rad) {
                    obj.mass = 1000;
                }
            }
        });
    });

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
                obj.pos[0] = ((obj.pos[1] - b) / - m) + a;
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
                obj.pos[0] = ((obj.pos[1] - b) / - m) + a;
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
                obj.pos[1] = ((obj.pos[0] - b) / - m) + a;
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
                obj.pos[1] = ((obj.pos[0] - b) / - m) + a;
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

c.addEventListener("click", function(e) { 
    var cX = Math.round(e.clientX/c.getBoundingClientRect().width * window.innerWidth);
    var cY = Math.round(e.clientY/c.getBoundingClientRect().height * window.innerHeight);
    mouseCoords = [cX, cY];
    addObject(mouseCoords[0], mouseCoords[1], /**/[1, 1]/*[2 - Math.floor(Math.random() * 4), 2 - Math.floor(Math.random() * 4)]/**/, (Circle.allInstances.length + 1) * 10);
});

const world = new Render(ctx, window.innerWidth, window.innerHeight, 9.8);

Circle.allInstances = [];
world.render();