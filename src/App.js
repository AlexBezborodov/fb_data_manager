import React from "react";

import { HashRouter as Router, Routes, Route } from "react-router-dom";

import { Login } from "./components/login";
import { SignUp } from "./components/sign_up";
import { StartPage } from "./components/start_page";
import "./App.css";

function App() {
  return (
    <div className="App">
      <>
        <Router>
          <Routes>
            <Route path="/" element={<StartPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/sign-up" element={<SignUp />} />
          </Routes>
        </Router>
      </>
    </div>
  );
}

export default App;
