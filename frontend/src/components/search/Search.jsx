import React, { useState } from "react";
import { CiSearch } from "react-icons/ci";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import "./Search.css";

const Search = () => {
  const [username, setUsername] = useState("");
  const navigate = useNavigate();

  const { data: user, isLoading, error, refetch } = useQuery({
    queryKey: ["user", username],
    queryFn: async () => {
      const res = await fetch(`http://localhost:8080/api/users/${username}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to fetch user.");
      return data;
    },
    enabled: false,
  });

  const handleSearch = async() => {
    if (!username.trim()) {
      alert("Username cannot be empty.");
      return;
    }
    const { data: fetchedUser } = await refetch();
    if (fetchedUser?.username) {
      navigate(`/user/${fetchedUser.username}`);
    }
  };

  if (isLoading) return <div>Loading...</div>;
  if (error) alert('Error',error)

  return (
    <div className="search_user">
      <input
        className="search"
        type="text"
        placeholder="Enter Github Username..."
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        onKeyPress={(e) => e.key === "Enter" && handleSearch()}
        required
      />
      <CiSearch className="button" onClick={handleSearch} />
    </div>
  );
};

export default Search;
