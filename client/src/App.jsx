import './App.css'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import Home from './pages/Home';
import { BrowserRouter, Routes, Route } from "react-router-dom";
function App() {



  return (<div>
    <BrowserRouter>
<Routes>
  <Route path="/" element={<Home></Home>}></Route>
  <Route path='/login' element={<LoginPage></LoginPage>}></Route>
  <Route path='/register' element={<RegisterPage></RegisterPage>}></Route>
</Routes>
</BrowserRouter>
  </div>
    


   
  )
}

export default App
