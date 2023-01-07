import React from "react";

import { HashRouter as Router, Routes, Route } from "react-router-dom";

import { Login } from "./components/login";
import { MainPage } from "./components/main_page/main_page";
import {
  Integrations,
  Members,
  Emails,
  WelcomeMessage,
  Lists,
  Groups,
  Settings,
} from "./components/menu_items";
import { SignUp } from "./components/sign_up";
import { StartPage } from "./components/start_page";
import "./App.css";
import { CurrentUserProvider } from "./providers/current_user";

function App() {
  return (
    <div className="App">
      <CurrentUserProvider>
        <Router>
          <Routes>
            <Route path="/" element={<StartPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/sign-up" element={<SignUp />} />
            <Route path="/main/*" element={<MainPage />}>
              <Route path="*" element={<Integrations />} />
              <Route path="members" element={<Members />} />
              <Route path="emails" element={<Emails />} />
              <Route path="welcome-message" element={<WelcomeMessage />} />
              <Route path="lists" element={<Lists />} />
              <Route path="groups" element={<Groups />} />
              <Route path="settings" element={<Settings />} />
            </Route>
          </Routes>
        </Router>
      </CurrentUserProvider>
    </div>
  );
}

export default App;
