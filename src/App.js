import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Header from './components/layout/Header';
import Home from './pages/Home'
import './App.css';

function App() {
  return (
    <>
      <Router>
        <div className="App">
            <Header />
            <main className="main-content">
              <Routes>
                <Route path="/" element={<Home />} /> 
              </Routes>
            </main>
        </div>
      </Router>
      <ToastContainer />
    </>
  );
}

export default App;
