/**
 * Created by nahel on 30/01/2017.
 */
var socket;

var mapsize=8000;
var spawnzone=7800;
var yourname="user";

var blob;
var blobs = [];
var blobsbot = [];
var deadBlobsbot = [];

var zoom = 1;
var timingDead=0;
var messageDead="";

function setup() {
    createCanvas(windowWidth, windowHeight);

    socket = io();

    blob = new Blob(yourname, random(-spawnzone,spawnzone), random(-spawnzone,spawnzone), 64, 255,255,255);

    var data ={
        name: blob.name,
        x: blob.pos.x,
        y: blob.pos.y,
        r: blob.r,
        red: blob.red,
        green: blob.green,
        blue: blob.blue
    }

    socket.emit('start', data);


    socket.on('create',
        function (data) {
            blob.name=data.name;
            blob.red=data.red;
            blob.green=data.green;
            blob.blue=data.blue;
        }
    );

    socket.on('heartbeat',
        // When we receive data
        function(data) {
            blobs = data;
        }
    );

    socket.on('bots',
        // When we receive data
        function(data) {
            blobsbot = data;
        }
    );

    socket.on('deadbots',
        // When we receive data
        function(data) {
            deadBlobsbot = data;
        }
    );


}

function draw() {
    background(255);

    translate(width/2, height/2);
    var newzoom = 54 / blob.r;
    zoom = lerp(zoom, newzoom, 0.1);
    scale(zoom);
    translate(-blob.pos.x, -blob.pos.y);

    if(timingDead>0){
        fill(0);
        textAlign(CENTER);
        textSize(40);
        text(messageDead, blob.pos.x, blob.pos.y-100);
        timingDead--;
    }

    //AUTRES JOUEURS
    for (var i = blobs.length-1; i >=0; i--) {
        var id=blobs[i].id;
        if(id != socket.id) {
            var displayBlob = new Blob(blobs[i].name, blobs[i].pos.x, blobs[i].pos.y, blobs[i].r, blobs[i].red, blobs[i].green, blobs[i].blue);
            displayBlob.show();
            if (blob.eats(blobs[i])) {
                blobs.splice(i, 1);
            }
            if(blobs[i]==undefined){
                console.log(blobs);
            }
            if(blob.dead(blobs[i])){
                blob.pos.x=random(-spawnzone,spawnzone);
                blob.pos.y=random(-spawnzone,spawnzone);
                blob.r=64;
                messageDead="T'es mort comme une grosse merde mangé par ce fils de pute de "+blobs[i].name;
                timingDead=200;
            }
        }
    }

    //BLOB BOTS
    for (var i = blobsbot.length-1; i >=0; i--) {

        var displayBlobBot=new Blob("", blobsbot[i].x, blobsbot[i].y, 16, blobsbot[i].red, blobsbot[i].green, blobsbot[i].blue);
        displayBlobBot.show();
        if (blob.eats(displayBlobBot)) {
            socket.emit('atebot', i);
            blobsbot.splice(i, 1);
        }
    }

    //DEADBLOB BOTS
    for (var i = deadBlobsbot.length-1; i >=0; i--) {

        var deadBlobBot=new Blob("DEADBLOB", deadBlobsbot[i].x, deadBlobsbot[i].y, 160, 0, 230, 0);
        deadBlobBot.show();

        if (blob.eats(deadBlobBot)) {
            socket.emit('atedeadbot', i);
            deadBlobsbot.splice(i, 1);
            blob.r=blob.r/2;
        }
    }


    blob.show();
    blob.update();

    var data ={
        name: blob.name,
        x: blob.pos.x,
        y: blob.pos.y,
        r: blob.r,
        red: blob.red,
        green: blob.green,
        blue: blob.blue
    }

    socket.emit('update', data);


}

function windowResized() {
    resizeCanvas(windowWidth, windowHeight);
}