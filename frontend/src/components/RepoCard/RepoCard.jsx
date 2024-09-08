import React from "react";
import "./RepoCard.css";
const RepoCard = () => {
  const repo = {
    name: "Repo Name",
    private: false,
  };
  return (
    <div className="repo_card">
      <h1 className="repo_header">{repo.name}</h1>
      {repo.private ? (
        <span className="visibility_span">Private</span>
      ) : (
        <span className="visibility_span">Public</span>
      )}
    </div>
  );
};

export default RepoCard;