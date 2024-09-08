import React from "react";
import { useNavigate } from "react-router-dom";
import { FaArrowLeft, FaCopy, FaGithub, FaLink } from "react-icons/fa";
import { IoMdCheckmark } from "react-icons/io";
import "./Repo.css";

const RepoDetails = () => {
  const navigate = useNavigate();

  // Repository data
  const repoData = {
    repo_id: 853937437,
    name: "gitscrape",
    private: false,
    html_url: "https://github.com/bnmunesh/gitscrape",
    description:
      "Lorem ipsum dolor sit amet consectetur adipisicing elit. Delectus molestias quasi quisquam consectetur autem rem voluptates aliquam, quam voluptatibus assumenda, consequuntur porro ipsam nesciunt, eveniet nobis blanditiis incidunt sapiente nam.",
    url: "https://api.github.com/repos/bnmunesh/gitscrape",
    forks_url: "https://api.github.com/repos/bnmunesh/gitscrape/forks",
    contributors_url:
      "https://api.github.com/repos/bnmunesh/gitscrape/contributors",
    git_created_at: "2024-09-08T00:29:55.000Z",
    git_updated_at: "2024-09-08T00:32:40.000Z",
    git_pushed_at: "2024-09-08T00:32:37.000Z",
    ssh_url: "git@github.com:bnmunesh/gitscrape.git",
    clone_url: "https://github.com/bnmunesh/gitscrape.git",
    size: 0,
    archived: false,
    disabled: false,
    visibility: "public",
    forks: 0,
    open_issues: 0,
    watchers: 0,
    default_branch: "main",
    user_id: "141001469",
  };

  // Format date
  const formatDate = (dateString) => new Date(dateString).toLocaleDateString();

  // Handle copy to clipboard
  const handleCopy = (text) => {
    navigator.clipboard.writeText(text).then(() => {
      alert("Copied to clipboard!");
    });
  };

  return (
    <div className="repoContainer">
      <header className="header">
        <button className="backButton" onClick={() => navigate(-1)}>
          <FaArrowLeft />
          <span className="backButtonText">Back</span>
        </button>
        <h1 className="repoName">
          <a
            href={repoData.html_url}
            className="link"
            target="_blank"
            rel="noopener noreferrer"
          >
            {repoData.name}
          </a>
        </h1>
        <p className="repoMeta">
          <span className="visibility_span">
            {repoData.private ? "Private" : "Public"}
          </span>{" "}
          |{" "}
          <span className="visibility_span">
            Default branch: {repoData.default_branch}
          </span>
        </p>
      </header>

      <div className="detailsSection">
        <p className="description">
          {repoData.description || "No description available"}
        </p>

        <ul className="infoList">
          <div className="infoDates">
            <li className="visibility_span">
              Created At:{formatDate(repoData.git_created_at)}
            </li>
            <li className="visibility_span">
              Last Updated: {formatDate(repoData.git_updated_at)}
            </li>
            <li className="visibility_span">
              Last Pushed:{formatDate(repoData.git_pushed_at)}
            </li>
          </div>
          <div className="InfoStats">
            <li className="visibility_span">Forks: {repoData.forks}</li>
            <li className="visibility_span">
              Open Issues: {repoData.open_issues}
            </li>
            <li className="visibility_span">Watchers: {repoData.watchers}</li>
          </div>
        </ul>

        <div className="linksSection">
          <div className="linkItem">
            <strong className="visibility_span">SSH URL</strong>
            <FaCopy
              className="copyIcon"
              onClick={() => handleCopy(repoData.ssh_url)}
            />
          </div>
          <div className="linkItem">
            <strong className="visibility_span">Clone URL</strong>
            <FaCopy
              className="copyIcon"
              onClick={() => handleCopy(repoData.clone_url)}
            />
          </div>
          <div className="linkItem">
            <a
              href={repoData.contributors_url}
              className="visibility_span"
              target="_blank"
              rel="noopener noreferrer"
            >
              <FaGithub /> View Contributors
            </a>
          </div>

          <div className="linkItem">
            <a
              href={repoData.forks_url}
              className="visibility_span"
              target="_blank"
              rel="noopener noreferrer"
            >
              {" "}
              <FaLink /> View Forks
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RepoDetails;
