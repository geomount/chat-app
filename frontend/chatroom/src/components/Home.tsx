import { Link } from "react-router-dom"; 
import { Button } from "./Buttons"; 

export default function Home() {
  return (
    <div className="bg-blue-300 h-screen flex flex-col">
      <div className="flex justify-center h-1/10 py-8">
        Vaartaalaap
      </div>
      <div className="grid grid-cols-2 gap-12 mx-72 p-4 h-8/10">
        <div>
          <div className="flex justify-center px-8 py-24">
            Welcome! Connect with your homies over a chat!
          </div>
          <div className="flex justify-between my-20">
            <div className="px-8">

              <Link to="/signin">
                <Button disabled={false}>SignIn</Button>
              </Link>
            </div>
            <div className="px-8">

              <Link to="/signup">
                <Button disabled={false}>SignUp</Button>
              </Link>
            </div>
          </div>
        </div>
        <div className="flex justify-center items-center">
          Image
        </div>
      </div>
      <div className="h-1/10 flex justify-center">
        Footer
      </div>
    </div>
  );
}
