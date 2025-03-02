import { WebSocketServer, WebSocket } from 'ws';
import express, {Request} from 'express';
import cookieParser from 'cookie-parser'
import jwt, { JwtPayload } from 'jsonwebtoken';
import {JWT_SECRET} from './config';
import * as http from 'http';
// import { prismaClient } from './../../db/src/';


const wss = new WebSocketServer({ noServer: true });

interface RequestWithUser extends Request {
  cookies: Record<string, string>;
}

interface ApplicationWithServer extends express.Application {
  server?: http.Server;  // Adding server property of type http.Server
}

interface UserI {
  ws?: WebSocket,
  rooms: string[],
  userId: string
}

const app: ApplicationWithServer = express();
app.use(cookieParser()); // To parse cookies

// Inefficent logic:
// ToDo: Implement Queuing (Kafka? idk will have to read about it)

// ToDO: Find some other way for Auth in WebSockets bc passing as query parameters isn't safe

// Pass token through cookies

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

wss.on('connection', function connection(ws, request: RequestWithUser) {

  // const url = request.url;

  // if (!url) return 

  // const queryParameters = new URLSearchParams(url.split('?')[1]);
  // const token = queryParameters.get('token') ?? "";
  // const userId = checkUser(token);

  const token = request.cookies.token;

  if (!token) {
    ws.close(1008, 'No token provided');
    return;
  }

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

});

app.server = app.listen(8080, () => {
  console.log('Server listening on port 8080');
});

app.server.on('upgrade', (req, socket, head) => {
  // Make sure to include the cookies during WebSocket upgrade
  wss.handleUpgrade(req, socket, head, (ws) => {
    wss.emit('connection', ws, req);
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
});