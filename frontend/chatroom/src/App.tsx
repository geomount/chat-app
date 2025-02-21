import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from './components/Home';
import './App.css'
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";

function App() {

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<SignUp />} />
        </Routes> 
      </BrowserRouter>
    </div>
  )
}

export default App
