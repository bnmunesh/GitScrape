import React from "react";
import { Routes, Route } from "react-router-dom";
import Home from "./pages/Home/Home";
import "./App.css";
import Repo from "./pages/RepoPage/Repo";
import User from "./components/User/User";
// import { Toaster } from "react-hot-toast";



const App = () => {
  return (
    <>
    <div className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/user/:user" element={<User />} />
          <Route path="/user/:username/:repo" element={<Repo />} />
        </Routes>
    </div>
    {/* <Toaster /> */}
    </>
  );
};

export default App;
