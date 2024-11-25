import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from './components/layout/Header';
import Home from './pages/Home'
import './App.css';
import Subsection from "./pages/Subsection";
import Profile from "./pages/Profile";

function App() {
  return (
    <div>
      <Router>
        <div className="App">
              <Routes>
                  <Route path="/" element={<Header />}>
                      <Route path="/" element={<Home />} />
                      <Route path="/profile" element={<Profile />} />
                      <Route path="/subsection/:id" element={<Subsection />} />
                  </Route>
              </Routes>
        </div>
      </Router>
      <ToastContainer />
    </div>
  );
}

export default App;
