import { useEffect, useRef, useState } from 'react'
import './App.css'

function App() {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [socket, setSocket] = useState<WebSocket | undefined>(undefined);
  
  interface Response {
    message: string;
    val: string
  }
  const [allMessages, setAllMessages] = useState<Response []>([]);



  function sendMessage(){
    if (!socket || !inputRef.current){
      return
    }

    const val = inputRef.current.value;

    socket.send(JSON.stringify({
      type: "chat",
      payload: {
        message: val
      }
    }));
    inputRef.current.value = "";

  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") sendMessage();
  }

  useEffect(() => {
    const ws = new WebSocket('ws://localhost:8080');
    setSocket(ws);

    ws.onopen = () => {
      ws.send(JSON.stringify({
        type: "join",
        payload: {
          roomId: "red"
        }
      }))
    }

    ws.onmessage = (ev) => {
      const data: string = ev.data;
      const parsedData: Response = JSON.parse(data);

      const obj: Response = {
        message: parsedData.message,
        val: parsedData.val
      };
    
      setAllMessages((prevMessages) => [...prevMessages, obj])
    }
    
  }, []);

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "center",   color: "#ffffff", fontWeight: "500", fontSize: "64px", textShadow: "3px 3px #646cffaa" }}> Vaartaalaap </div>
      
      {/* <div>
        {allMessages.map((msg, idx) => {
          if (msg.val === "S"){
            return(
              <div style={{ textAlign: "right" }}>
                <strong>You:</strong> {msg.message}
              </div>
            );
          } else {
            return (
              <div style={{ textAlign: "left" }}>
                <strong>User:</strong> {msg.message}
              </div>
            );
          }

        })}
      </div> */}
      <div style={{ display: "flex", flexDirection: "column", maxHeight: "400px", overflowY: "auto" }}>
        {allMessages.map((msg, idx) => (
          <div
            key={`message-${idx}`}
            style={{
              display: "flex",
              justifyContent: msg.val === "S" ? "flex-end" : "flex-start",
              marginBottom: "10px",
              maxWidth: "80%", // Maximum width of the message
              alignSelf: msg.val === "S" ? "flex-end" : "flex-start", // Align sent messages to the right and received to the left
            }}
          >
            <div
              style={{
                backgroundColor: msg.val === "S" ? "#DCF8C6" : "#77CDFF", // Different background for sent/received
                padding: "10px",
                borderRadius: "10px",
                maxWidth: "80%",
                wordWrap: "break-word", 
                textAlign: "left",
                display: "inline-block",
              }}
            >
              <strong>{msg.val === "S" ? "You" : "User"}:</strong> {msg.message}
            </div>
          </div>
        ))}
      </div>

      <input type="text" placeholder='Enter your message' ref={inputRef} onKeyDown={handleKeyDown}></input>
      <button onClick={sendMessage}> Send </button>
    </div>
  )
}

export default App
