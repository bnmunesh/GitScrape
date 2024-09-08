import React, { useState } from "react";
import profile from "../../assets/profile.jpg";
import "./User.css";
import RepoCard from "../RepoCard/RepoCard";
import ListModal from "../ListModal/ListModal";

const User = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const data = [
    {
      avatar_url: "https://avatars.githubusercontent.com/u/141001469?v=4",
      login: "bnmunesh",
    },
    {
      avatar_url: "https://avatars.githubusercontent.com/u/50866431?s=48&v=4",
      login: "alohe",
    },
  ];
  return (
    <>
      <div className="profilecard">
        <div className="infoimages">
          <div className="cover"></div>
          <img src={profile} alt="Profile" />
        </div>
        <div className="profileinfo">
          <span>Full Name</span>
          <span>Username</span>
        </div>
        <hr />
        <div className="followerinfo">
          <div className="following" onClick={() => setModalOpen(!isModalOpen)}>
            <span>1232</span>
            <span>Following</span>
          </div>
          <div className="vl"></div>
          <div className="follower" onClick={() => setModalOpen(!isModalOpen)}>
            <span>3424</span>
            <span>Followers</span>
          </div>
          <div className="vl"></div>
          <div className="post">
            <span>34</span>
            <span>Repos</span>
          </div>
        </div>
        <hr />
        <div className="all_repos">
          {Array.from({ length: 6 }, (_, i) => (
            <RepoCard key={i} />
          ))}
        </div>
        {isModalOpen && (
          <ListModal
            data={data}
            isOpen={isModalOpen}
            onClose={() => setModalOpen(!isModalOpen)}
          />
        )}
      </div>
    </>
  );
};

export default User;
