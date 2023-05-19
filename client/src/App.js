import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import Navbar from './components/Navbar';
import Landing from './components/Landing';
import Login from './components/Login';
import Register from './components/Register';
import Ticket from './components/Ticket';
import userProfile from './components/userProfile';
import ShowTickets from './components/TicketShow';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route path="/addTicket" element={<Ticket />} />
          <Route path="/tickets" element={<ShowTickets />} />
          <Route path="/userProfile" element={<userProfile />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
