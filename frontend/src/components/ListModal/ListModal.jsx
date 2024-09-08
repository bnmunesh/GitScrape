import React from "react";
import { useNavigate } from "react-router-dom";
import "./ListModal.css";
import { useQuery } from "@tanstack/react-query";


const ListModal = ({ data, isOpen, onClose }) => {
  const navigate = useNavigate();

  if (!isOpen) return null;

  

  const handleClick = (username) => {
    navigate(`/user/${username}`);
    onClose();
  };

  return (
    <div className="modalBackdrop">
      <div className="modalContent">
        <button className="closeButton" onClick={onClose}>
          &times;
        </button>
        <div className="listContainer">
          {data?.map((item, index) => (
            <div
              key={index}
              className="listItem"
              onClick={() => handleClick(item.username)}
            >
              <img src={item.avatar_url} alt={item.login} className="avatar" />
              <h1 className="username"> @ {item.username}</h1>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ListModal;
