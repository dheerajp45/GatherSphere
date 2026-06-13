import './App.css'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import Home from './pages/Home';
import EventListingPage from './pages/EventListingPage';
import EventDetailPage from './pages/EventDetailPage';
import DashBoard from './pages/DashBoard';
import CreateEvent from './pages/CreateEvent';
import EditEvent from './pages/EditEvent';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Navbar';
import  ManageRegistrationsPage from './pages/ManageRegistrationsPage';
import { BrowserRouter, Routes, Route } from "react-router-dom";
function App() {


  return (<div>
    <BrowserRouter>
    <Navbar />
<Routes>
  <Route path="/" element={<Home></Home>}></Route>
  <Route path='/login' element={<LoginPage></LoginPage>}></Route>
  <Route path='/register' element={<RegisterPage></RegisterPage>}></Route>
  <Route path='/eventlisting' element={<EventListingPage></EventListingPage>}></Route>

<Route path="/events/:eventId/registrations" element={
  <ProtectedRoute>
  <ManageRegistrationsPage />
  </ProtectedRoute>
}></Route>


  <Route path='/dashboard/' element={
    <ProtectedRoute>
    <DashBoard></DashBoard>
    </ProtectedRoute>
    }></Route>


  <Route path='/event/:slug' element={<EventDetailPage> </EventDetailPage>}></Route>

  <Route path='/events/create' element={
    <ProtectedRoute>
    <CreateEvent> </CreateEvent>
    </ProtectedRoute>
    }></Route>
  
  
  <Route path='/events/edit/:event_ID' element={
    <ProtectedRoute>
    <EditEvent> </EditEvent>
    </ProtectedRoute>
    }></Route>

</Routes>

</BrowserRouter>
  </div>
    


   
  )
}

export default App
