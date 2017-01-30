/**
 * Created by nahel on 30/01/2017.
 */
var socket;
var mapsize=4000;
var blob;
var yourname="user";
var blobs = [];
var blobsbot = [];
var zoom = 1;

function setup() {
    createCanvas(windowWidth, windowHeight);

    socket = io();

    blob = new Blob(yourname, 0, 0, 64, 255,255,255);

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

    socket.on('eaten',
        // When we receive data
        function(data) {
            fill(255,0,0);
            textAlign(CENTER);
            textSize(20);
            text("T'es qu'une merde");
            blob.x=0;
            blob.y=0;
            blob.r=64;
        }
    );

}

function draw() {
    background(255);

    translate(width/2, height/2);
    var newzoom = 64 / blob.r;
    zoom = lerp(zoom, newzoom, 0.1);
    scale(zoom);
    translate(-blob.pos.x, -blob.pos.y);

    for (var i = blobs.length-1; i >=0; i--) {
        var id=blobs[i].id;
        if(id != socket.id) {
            var displayBlob = new Blob(blobs[i].name, blobs[i].x, blobs[i].y, blobs[i].r, blobs[i].red, blobs[i].green, blobs[i].blue);
            displayBlob.show();
            if (blob.eats(blobs[i])) {
                blobs.splice(i, 1);
                socket.emit('ateplayer', blobs[i]);
            }
        }
    }
    for (var i = blobsbot.length-1; i >=0; i--) {

        var displayBlobBot=new Blob("", blobsbot[i].x, blobsbot[i].y, 16, blobsbot[i].red, blobsbot[i].green, blobsbot[i].blue);
        displayBlobBot.show();
        if (blob.eats(displayBlobBot)) {
            socket.emit('atebot', i);
            blobsbot.splice(i, 1);

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