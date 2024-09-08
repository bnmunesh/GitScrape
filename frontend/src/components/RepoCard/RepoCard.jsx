import React from "react";
import "./RepoCard.css";
import { useNavigate } from "react-router-dom";
const RepoCard = ({username ,data}) => {

  const navigate = useNavigate();

  const handleClick = () => {
    navigate(`/user/${username}/${data?.repo_id}`, { state: { repoData: data } });
  };

  return (
    <div className="repo_card" onClick={handleClick}>
      <h1 className="repo_header">{data?.name}</h1>
      {data?.private ? (
        <span className="visibility_span">Private</span>
      ) : (
        <span className="visibility_span">Public</span>
      )}
    </div>
  );
};

export default RepoCard;