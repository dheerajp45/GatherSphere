import { Link } from "react-router-dom";

function Home() {
    return <div className="bg-black text-white h-screen flex justify-center items-center">
      <h1 className="text-5xl font-bold">
      GatherSphere Home Page
      </h1>
      <Link to="/register">Dont have an account?</Link>
      <Link to="/login">Have an account</Link>
    </div>

}
export default Home