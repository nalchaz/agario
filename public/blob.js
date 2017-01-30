/**
 * Created by nahel on 30/01/2017.
 */

function Blob(name, x, y, r, red, green, blue) {
    this.name=name;
    this.pos = createVector(x, y);
    this.r = r;
    this.vel = createVector(0,0);
    this.red=red;
    this.green=green;
    this.blue=blue;


    this.update = function() {
        var newvel = createVector(mouseX-width/2, mouseY-height/2);
        newvel.setMag(3);
        this.vel.lerp(newvel, 0.2);
        this.pos.add(this.vel);
        this.pos.x=constrain(this.pos.x, -width*4+this.r-50, width*4-this.r+50);
        this.pos.y=constrain(this.pos.y, -height*4+this.r-50, height*4-this.r+50);
    }

    this.eats = function(other) {
        var d = p5.Vector.dist(this.pos, other.pos);
        if (d < this.r + other.r) {
            var sum = PI * this.r * this.r + PI * other.r * other.r;
            this.r = sqrt(sum / PI);
            //this.r += other.r;
            return true;
        } else {
            return false;
        }
    }

    this.show = function() {
        fill(this.red,this.green,this.blue);
        ellipse(this.pos.x, this.pos.y, this.r*2, this.r*2);

        fill(0);
        textAlign(CENTER);
        textSize(12);
        text(this.name, this.pos.x, this.pos.y+this.r+15);

    }
}