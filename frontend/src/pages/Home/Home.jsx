import React from "react";
import Search from "../../components/search/Search";
import "./Home.css";
import Logo from "../../components/Logo/Logo";
const Home = () => {
  return (
    <>
      <div className="home">
        <div>
          <Logo />
        </div>
        <header>
          <h1 className="github_header">GitScrape</h1>
          <p className="github_description">
            Effortlessly search and retrieve information about GitHub users,
            including their repositories, contributions, and profile details.
            Streamline your research or data gathering process with this
            powerful tool, designed to save time and provide valuable insights
            into user activity on the GitHub platform.
          </p>
        </header>
        <Search />
      </div>
    </>
  );
};

export default Home;
