import { useEffect, useRef, useState } from 'react';
import { BrowserRouter, Route, Routes } from "react-router-dom";
import SignIn from './components/SignIn';
import SignUp from './components/SignUp';
import Avatars from './components/Avatars';
import Rooms from './components/Rooms';
import { Button } from './components/Buttons';
import './App.css'

function App() {

  return (
    <div>
      <div className='bg-blue-300 h-screen flex flex-col'>
        <div className='flex justify-center h-1/10 py-8'>
          Vaartaalaap
        </div>
        <div className='grid grid-cols-2 gap-12 mx-72 p-4 h-8/10'>
          <div>
            <div className='flex justify-center px-8 py-24'>
              Welcome! Connect with your homies over a chat! Ask that baddie out! Gossip about that bitch!
            </div>
            <div className='flex justify-between my-20'>
              <div className='px-8'>
                <Button disabled={true} onClick={
                  () => {
                    <Route path="/signin" element={<SignIn />}></Route>
                  }}>SignIn</Button>
              </div>
              <div className='px-8'>
                <Button disabled={true} onClick={
                  () => {
                    <Route path="/signup" element={<SignUp />}></Route>
                  }}>SignUp</Button>
              </div>
            </div>
          </div>
          <div className='flex justify-center items-center'>
            Image
          </div>
        </div>
        <div className='h-1/10 flex justify-center'>
          Footer
        </div>

      </div>
    </div>
  )
}

export default App
