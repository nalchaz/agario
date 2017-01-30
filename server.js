var blobs =[];
var nom;
var red=0;
var green=0;
var blue=0;

function Blob(id, name, x, y, r, red, green, blue){
    this.id=id;
    this.name=name;
    this.r=r;
    this.x = x;
    this.y = y;
    this.red=red;
    this.green=green;
    this.blue=blue;
}

var express = require('express');
var path = require('path');

// Create the app
var app = express();

// Set up the server

var server = app.listen(process.env.PORT || 2000);
var bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use(express.static('public'));

app.post('/agario.html', function(request, response) {
    nom=request.body.nom;
    var couleur=request.body.couleur;

    switch (couleur){
        case "Rouge":
            red=255;
            green=0;
            blue=0;
            break;
        case "Vert":
            red=0;
            green=255;
            blue=0;
            break;
        case "Bleu":
            red=0;
            green=0;
            blue=255;
            break;
    }

    response.sendFile('public/agario.html', { root: __dirname });
});


// WebSocket Portion
// WebSockets work with the HTTP server
var io = require('socket.io')(server);

setInterval(heartbeat, 33);

function heartbeat(){
    io.sockets.emit('heartbeat', blobs);
}


// Register a callback function to run when we have an individual connection
// This is run for each individual user that connects
io.sockets.on('connection',
    // We are given a websocket object in our function
    function (socket) {

        console.log("We have a new client: " + socket.id);


        // When this user emits, client side: socket.emit('otherevent',some data);
        socket.on('start',
            function(data) {
                var datacreate ={
                    name: nom,
                    red: red,
                    green: green,
                    blue: blue
                }
                socket.emit('create', datacreate);
                var blob = new Blob(socket.id, nom, data.x, data.y, data.r, red, green, blue);
                blobs.push(blob);
            }
        );

        socket.on('update',
            function (data) {

                var blob=new Blob(0,"",0,0,0,255,255,255);
                for(var i = 0; i < blobs.length; i++){
                    if(socket.id == blobs[i].id){
                        blob=blobs[i];
                        blob.name=data.name;
                        blob.x=data.x;
                        blob.y=data.y;
                        blob.r=data.r;
                        blob.red=data.red;
                        blob.green=data.green;
                        blob.blue=data.blue;
                    }
                }



            }
        );

        socket.on('disconnect', function() {
            for(var i = 0; i < blobs.length; i++) {
                if (socket.id == blobs[i].id) {
                    blobs.splice(i,1);
                }
            }
            console.log("Client has disconnected");
        });
    }
);