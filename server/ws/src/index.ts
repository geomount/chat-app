import WebSocket, { WebSocketServer } from 'ws';

const wss = new WebSocketServer({ port: 8080 });

interface User {
  socket: WebSocket;
  room: string;
  val: string | null
}

let allSockets: User[] = [];

interface Response {
  message: string;
  val: string
}

wss.on('connection', function (socket) {
  socket.on('error', console.error);
  
  socket.on("message", (message: any) => {
    const parsedMessage = JSON.parse(message.toString());
    console.log(parsedMessage);

    if (parsedMessage.type === "join"){
      console.log("user joined room " + parsedMessage.payload.roomId);
    
    allSockets.push({
      socket, 
      room: parsedMessage.payload.roomId,
      val: null
    })
    }

    if (parsedMessage.type === "chat"){
      console.log("users want to chat");

      const currentUser = allSockets.find(user => user.socket === socket);
      let currentUserRoom = null;

      if (currentUser) currentUserRoom = currentUser.room;

      allSockets.forEach((user) => {
        if (user.room === currentUserRoom){
          if (user.socket === socket){
            user.val = "S";
          } else {
            user.val = "R"
          }
          const obj = {
            message: parsedMessage.payload.message,
            val: user.val
          };
          user.socket.send(JSON.stringify(obj))
        } 
    })
    }

  })

});