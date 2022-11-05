var c = document.getElementById("render");
var ctx = c.getContext("2d");
c.width = window.innerWidth;
c.height = window.innerHeight;

const BOUNCE_CONST = .9;


function physics(renderer) {
    renderer.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
    
    Circle.allInstances.forEach(obj => {
        // gravity
        obj.vel.y += renderer.gravity * obj.mass;

        // move
        obj.pos.y += obj.vel.y;
        obj.pos.x += obj.vel.x;

        // collisions
        Circle.allInstances.forEach(obj2 => {
            if (obj != obj2) {
                // if distance between obj2 and obj is less than obj.rad
                if (Math.sqrt(Math.pow(obj2.pos.x - obj.pos.x, 2) + Math.pow(obj2.pos.y - obj.pos.y, 2)) < obj.rad) {
                    // move both objects away from each other until they are no longer touching
                    while (Math.sqrt(Math.pow(obj2.pos.x - obj.pos.x, 2) + Math.pow(obj2.pos.y - obj.pos.y, 2)) < obj.rad) {
                        obj.pos.y -= obj.vel.y;
                        obj.pos.x -= obj.vel.x;
                        obj2.pos.y -= obj2.vel.y;
                        obj2.pos.x -= obj2.vel.x;
                    }
                    // get angle between obj and obj2
                    let angle = Math.atan2(obj2.pos.y - obj.pos.y, obj2.pos.x - obj.pos.x);
                    // get velocity of obj and obj2
                    let vel1 = Math.sqrt(Math.pow(obj.vel.x, 2) + Math.pow(obj.vel.y, 2));
                    let vel2 = Math.sqrt(Math.pow(obj2.vel.x, 2) + Math.pow(obj2.vel.y, 2));
                    // get direction of obj and obj2
                    let dir1 = Math.atan2(obj.vel.y, obj.vel.x);
                    let dir2 = Math.atan2(obj2.vel.y, obj2.vel.x);
                    // get new velocity of obj and obj2
                    let newVel1 = vel1 * Math.cos(dir1 - angle) * (obj.mass - obj2.mass) / (obj.mass + obj2.mass) + vel2 * Math.cos(dir2 - angle) * 2 * obj2.mass / (obj.mass + obj2.mass * BOUNCE_CONST);
                    let newVel2 = vel1 * Math.cos(dir1 - angle) * 2 * obj.mass / (obj.mass + obj2.mass * BOUNCE_CONST) + vel2 * Math.cos(dir2 - angle) * (obj2.mass - obj.mass) / (obj.mass + obj2.mass);
                    // get new direction of obj and obj2
                    let newDir1 = Math.atan2(obj.vel.y, obj.vel.x) + Math.PI;
                    let newDir2 = Math.atan2(obj2.vel.y, obj2.vel.x) + Math.PI;
                    // set new velocity of obj and obj2
                    obj.vel.x = newVel1 * Math.cos(newDir1 - angle);
                    obj.vel.y = newVel1 * Math.sin(newDir1 - angle);
                    obj2.vel.x = newVel2 * Math.cos(newDir2 - angle);
                    obj2.vel.y = newVel2 * Math.sin(newDir2 - angle);
                }
            }
        });

        // walls 
        if (obj.pos.y + obj.rad > window.innerHeight) {
            obj.pos.y = window.innerHeight - obj.rad;
            obj.vel.y *= -BOUNCE_CONST;
        }
        if (obj.pos.y < obj.rad) {
            obj.pos.y = obj.rad;
            obj.vel.y *= -BOUNCE_CONST;
        }
        if (obj.pos.x + obj.rad > window.innerWidth) {
            obj.pos.x = window.innerWidth - obj.rad;
            obj.vel.x *= -BOUNCE_CONST;
        }
        if (obj.pos.x < obj.rad) {
            obj.pos.x = obj.rad;
            obj.vel.x *= -BOUNCE_CONST;
        }

        // draw
        renderer.DrawCircle(renderer.ctx, obj.pos.x, obj.pos.y, obj.rad);
    });
}

class Circle {
    constructor(x, y, rad, vx, vy) {
        this.pos = {
            x: x,
            y: y
        };
        this.rad = rad;
        this.vel = {
            x: vx,
            y: vy
        };
        this.mass = .01;
        Circle.allInstances.push(this);
    }
}

class Renderer {
    constructor(ctx, w, h, g) {
        this.ctx = ctx;
        this.width = w;
        this.height = h;
        this.gravity = g;
    }
    render() {
        clearInterval(this.run);
        this.run = setInterval(() => {physics(this)}, 1000 / 60);
    }
    pause() {
        clearInterval(this.run);
    }
    step() {
        physics(this);
    }
    DrawCircle(ctx, x, y, r) {
        ctx.beginPath();
        ctx.strokeStyle = 'rgb(0, 0, 0)';
        ctx.fillStyle = 'rgb(0, 0, 0)';
        ctx.arc(x, y, r, 0, 2 * Math.PI, false);
        ctx.fill();
    }
}

c.addEventListener("mousedown", function(e) { 
    var cX = Math.round(e.clientX/c.getBoundingClientRect().width * window.innerWidth);
    var cY = Math.round(e.clientY/c.getBoundingClientRect().height * window.innerHeight);
    for (var i = 0; i < 1; i++) {
        var obj = new Circle(cX, cY, 15, i, 0);
    }
});

const world = new Renderer(ctx, window.innerWidth, window.innerHeight, 9.8);

Circle.allInstances = [];
world.render();