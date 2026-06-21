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
import GuestRoute from './components/GuestRoute';
import Navbar from './components/Navbar';
import TicketPage from './pages/TicketPage';
import  ManageRegistrationsPage from './pages/ManageRegistrationsPage';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Camera from './pages/Camera';
function App() {


  return (<div>
    <BrowserRouter>
    <Navbar />
<Routes>
  <Route path="/camera" element={
     <ProtectedRoute>
    <Camera></Camera>
     </ProtectedRoute>
   }></Route>
  <Route path="/" element={
    <GuestRoute>
      <Home></Home>
    </GuestRoute>
  }></Route>
  <Route path='/login' element={
    <GuestRoute>
      <LoginPage></LoginPage>
    </GuestRoute>
  }></Route>
  <Route path='/register' element={
    <GuestRoute>
      <RegisterPage></RegisterPage>
    </GuestRoute>
  }></Route>
  <Route path='/eventlisting' element={<EventListingPage></EventListingPage>}></Route>

<Route path="/events/:eventId/registrations" element={
  <ProtectedRoute>
  <ManageRegistrationsPage />
  </ProtectedRoute>
}></Route>


  <Route path='/dashboard' element={
    <ProtectedRoute>
    <DashBoard></DashBoard>
    </ProtectedRoute>
    }></Route>
  <Route path='/dashboard/' element={
    <ProtectedRoute>
    <DashBoard></DashBoard>
    </ProtectedRoute>
    }></Route>

<Route path="/ticket/:ticketToken" element={<TicketPage></TicketPage>} />
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
