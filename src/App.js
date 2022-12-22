import React from "react";

import { HashRouter as Router, Routes, Route } from "react-router-dom";

import { Login } from "./components/login";
import { MainPage } from "./components/main_page/main_page";
import {
  Integrations,
  Members,
  Emails,
  Customize,
  Lists,
  Groups,
  Settings,
} from "./components/menu_items";
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
            <Route path="/main/*" element={<MainPage />}>
              <Route path="*" element={<Integrations />} />
              <Route path="members" element={<Members />} />
              <Route path="emails" element={<Emails />} />
              <Route path="customize" element={<Customize />} />
              <Route path="lists" element={<Lists />} />
              <Route path="groups" element={<Groups />} />
              <Route path="settings" element={<Settings />} />
            </Route>
          </Routes>
        </Router>
      </>
    </div>
  );
}

export default App;
