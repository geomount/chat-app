import { WebSocketServer, WebSocket } from 'ws';
import jwt, { JwtPayload } from 'jsonwebtoken';
import {JWT_SECRET} from process.env.JWT_SECRET;

const wss = new WebSocketServer({ port: 8080 });

interface UserI {
  ws?: WebSocket,
  rooms: string[],
  userId: string
}

// Inefficent logic:
// ToDo: Implement Queuing 

const users: UserI[] = [];

function checkUser(token: string): string | null {

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    if (typeof decoded === "string") {
      return null 
    }
  
    if (!decoded || !(decoded.userId)) {
      return null 
    }
  
    return decoded.userId;


  } catch(e) {
    console.error(e);
    return null 
  }

}

wss.on('connection', function connection(ws, request) {

  const url = request.url;

  if (!url) return 

  const queryParameters = new URLSearchParams(url.split('?')[1]);
  const token = queryParameters.get('token') ?? "";
  const userId = checkUser(token);

  if (!userId || userId === null){
    ws.close();
    return null
  }

  users.push({
    userId,
    rooms: [],
    ws
    })


  ws.on('message', function message(data) {
    
    const parsedData = JSON.parse(data as unknown as string);

    if (parsedData.type === "join_room"){
      const user = users.find(x => x.ws === ws)
      const checkRoom = user?.rooms.filter(x => x === parsedData.roomId) || [];
      console.log(checkRoom);
      if (checkRoom?.length > 0){ 
        ws.send("Already in the room")
        return 
      }
      user?.rooms.push(parsedData.roomId)
      ws.send("Welcome to the room")
      return
    }

    if (parsedData.type === "leave_room") {
      const user = users.find(x => x.ws === ws)
      if (!user) {
        return 
      }
      user.rooms = user?.rooms.filter(x => x === parsedData.roomId);
    }

    if (parsedData.type === "chat") {
      const roomId = parsedData.roomId; 
      const message = parsedData.message;

      users.forEach(user => {
        if (user.rooms.includes(roomId)) {
          user.ws?.send(JSON.stringify({
            type: "chat",
            message: message, 
            roomId: roomId
          }))
        }
      }
      )

    }


  });

  ws.send('something');
});