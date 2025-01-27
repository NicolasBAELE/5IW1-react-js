import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { Login } from "./pages/Login";
import { User } from "./pages/User";
import { Matchs } from "./pages/Matchs";
import { NavigationProvider } from "./contexts/NavigationProvider";
import { UserProvider } from './contexts/UserContext'
import RouteProtection from "./components/RouteProtection";

export default function App() {
  return (
    <Router>
      <NavigationProvider>
        <UserProvider>
          <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/user" element={<RouteProtection><User /></RouteProtection>} />
            <Route path="/matchs" element={<RouteProtection><Matchs /></RouteProtection>} />
          </Routes>
        </UserProvider>
      </NavigationProvider>
    </Router>
  );
}
