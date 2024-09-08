import React, { useState } from "react";
import { CiSearch } from "react-icons/ci";

import "./Search.css";
const Search = () => {
  const [username, setUsername] = useState("");
  const handleSearch = () => {
    console.log("search", username);
    setUsername("");
  };
  return (
    <div className="search_user">
      <input
        className="search"
        type="text"
        placeholder="Enter Github Username...."
        value={username}
        required
        onChange={(e) => setUsername(e.target.value)}
        onKeyPress={(e) => e.key === "Enter" && handleSearch()}
      />
      <CiSearch className="button" onClick={handleSearch} />
    </div>
  );
};

export default Search;
