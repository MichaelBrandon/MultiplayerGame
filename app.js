var io = require('socket.io')(process.env.PORT||5000);
var shortid = require('shortid');

var players = [];
var playerCount = 0;

console.log("SERVER LOG: Server Running");

io.on('connection', function(socket){
    console.log("SERVER LOG: Connected to Unity");
    var thisPlayerId = shortid.generate();

    var player = {
        id:thisPlayerId,
        position:{
            v:0
        }
    }

    players[thisPlayerId] = player;

    socket.broadcast.emit('spawn', {id:thisPlayerId});
     console.log("SERVER LOG: Sending spawn to new with ID ",thisPlayerId);
     console.log("players array length: ", players.length);

    for(var i = 0; i < players.length; i++){
        socket.emit('spawn');
       
        playerCount++;
    }

    socket.on('sayhello', function(data){
        console.log("SERVER LOG: Unity Game says hello");
        socket.emit('talkback');
    });

    socket.on('disconnect', function(){
        console.log("SERVER LOG: player disconnected");
        //playerCount--;
    });

    socket.on('move', function(data){
        //console.log("UNITY -> SERVER: Player moved", JSON.stringify(data));
        data.id = thisPlayerId;
        socket.broadcast.emit("move", data);
    });

    console.log("SERVER LOG --> Number of players connected: " + players.length);
});