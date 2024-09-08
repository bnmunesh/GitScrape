import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import "./App.css";
import Repo from "./components/RepoPage/Repo";
import User from "./components/User/User";
const App = () => {
  return (
    <div className="container">
      <Router>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="user/:user" element={<User />} />
          <Route path="/repo/:repo" element={<Repo />} />
        </Routes>
      </Router>
    </div>
  );
};

export default App;
