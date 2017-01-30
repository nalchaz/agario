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
    this.vitesse=Math.round(16-Math.round(this.r/120));

    this.update = function() {
        var newvel = createVector(mouseX-width/2, mouseY-height/2);
        newvel.setMag(this.vitesse);
        this.vel.lerp(newvel, 0.2);
        this.pos.add(this.vel);
        this.pos.x=constrain(this.pos.x, -mapsize+this.r-50, mapsize-this.r+50);
        this.pos.y=constrain(this.pos.y, -mapsize+this.r-50, mapsize-this.r+50);
    }

    this.eats = function(other) {

            other.pos=createVector(other.pos.x,other.pos.y);

            if (this.r > other.r*1.3) {

                var d = p5.Vector.dist(this.pos, other.pos);
                if (d < this.r + other.r/2) {
                    var sum = PI * this.r * this.r + PI * other.r * other.r;
                    this.r = sqrt(sum / PI);
                    this.vitesse = Math.round(16 - Math.round(this.r / 120));
                    return true;
                }
            }

        else {
            return false;
        }
    }

    this.dead=function (other) {

        if(other==undefined) return false;
        other.pos=createVector(other.pos.x,other.pos.y);

        if (other.r > this.r*1.3) {
            var d = p5.Vector.dist(this.pos, other.pos);
                if (d < this.r/2 + other.r) {
                    return true;
                }
        }
        else{
            return false;
        }
    }

    this.show = function() {
        fill(this.red,this.green,this.blue);
        ellipse(this.pos.x, this.pos.y, this.r*2, this.r*2);

        fill(0);
        textAlign(CENTER);
        textSize(r/4);
        text(this.name, this.pos.x, this.pos.y+this.r+15);

    }
}