import React, { useState, useEffect } from "react";
import profile from "../../assets/profile.jpg";
import "./User.css";
import RepoCard from "../RepoCard/RepoCard";
import ListModal from "../ListModal/ListModal";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useParams } from 'react-router-dom'
import { useNavigate } from "react-router-dom";
import { FaArrowLeft } from "react-icons/fa";
import Loader from '../Loader/Loader'

const User = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const navigate = useNavigate();

  const { user } = useParams();
  const { data: userData, isLoading: userLoading, error: userError } = useQuery({
    queryKey: ["userData", user],
    queryFn: async () => {
      try {
        const res = await fetch(`http://localhost:8080/api/users/${user}`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Failed to fetch user data.");
        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
    enabled: !!user,
  });
  
  useEffect(()=>{

  },[user])

  const { data: followersData, followersLoading } = useQuery({
    queryKey: ["followersData",user],
    queryFn: async () => {
      try {
        const res = await fetch(`http://localhost:8080/api/users/followers/${user}`);
        const data = res.json();
        if (!res.ok)
        throw new Error(data.error || "failed to fetch notification");
        return data;
      } catch (error) {
        throw new Error(error);
      }
    },
    enabled: !!user, 
  });

  if (userLoading || followersLoading) return <Loader/>;


  return (
    <>
      <div className="profilecard">
        <div className="infoimages">
        <button className="backButton" onClick={() => navigate('/')}>
          <FaArrowLeft />
          <span className="backButtonText">Back</span>
        </button>
          <div className="cover"></div>
          <img src={userData?.avatar_url} alt="Profile" />
        </div>
        <div className="profileinfo">
          <span title='name'>{userData?.name ? userData?.name:userData?.username}</span>
          <span title='username'>{userData?.username}</span>
          <span title='bio'>{userData?.bio && userData?.bio}</span>
          <span title='company'>{userData?.company && userData?.company}</span>
          <span title='location'>{userData?.location && userData?.location}</span>
          <span title='email'>{userData?.email && userData?.email}</span>
        </div>
        <hr />
        <div className="followerinfo">
          <div className="following">
            <span>{userData?.following}</span>
            <span>Following</span>
          </div>
          <div className="vl"></div>
          <div className="follower" onClick={() => setModalOpen(!isModalOpen)}>
            <span>{userData?.followers}</span>
            <span>Followers</span>
          </div>
          <div className="vl"></div>
          <div className="post">
            <span>{userData?.public_repos}</span>
            <span>Repos</span>
          </div>
        </div>
        <hr />
        <div className="all_repos">
          {userData?.repositories.map((item,index)=> (
            <RepoCard key={index} username={userData?.username} data={item} />
          ))}
        </div>
        {isModalOpen && (
          <ListModal
            data={followersData}
            isOpen={isModalOpen}
            onClose={() => setModalOpen(!isModalOpen)}
          />
        )}
      </div>
    </>
  );
};

export default User;
