const db = require('../models');
const axios = require('axios');
const moment = require('moment');
const { Op } = require('sequelize');
require('dotenv').config();

const token = process.env.GITHUB_TOKEN;

// Log the contents of db to see what models are available
console.log('Available models:', Object.keys(db));

//create main model
const User = db.User;
const Repository = db.Repository;
const Follower = db.Follower;


const fetchOrSaveUserDetails = async (username) => {
  const t = await db.sequelize.transaction();

  try {

    console.log('\n\n\n@@@@@@@@@@@@@@@@@@@@@@@@@@@\n\n\n')
    let user = await User.findOne({
      where: { username: username},
      include: 'repositories'
    });

    if (!user) {
      const response = await axios.get(`https://api.github.com/users/${username}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const userData = response.data;
      
      const userObj = {
        username: userData.login,
        user_id: userData.id,
        avatar_url: userData.avatar_url,
        url: userData.url,
        html_url: userData.html_url,
        followers_url: userData.followers_url,
        following_url: userData.following_url,
        repos_url: userData.repos_url,
        name: userData.name,
        company: userData.company,
        blog: userData.blog,
        location: userData.location,
        email: userData.email,
        bio: userData.bio,
        twitter_username: userData.twitter_username,
        public_repos: userData.public_repos,
        public_gists: userData.public_gists,
        followers: userData.followers,
        following: userData.following,
        github_created_at: userData.created_at,
        github_updated_at: userData.updated_at
      };

      user = await User.create(userObj, { transaction: t });

      //fetch and save repository details of user
      const reposResponse = await axios.get(userData.repos_url, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const repositories = reposResponse.data;

      const destructuredRepositories = repositories.map(repo => ({
        repo_id: repo.id,
        name: repo.name,
        private: repo.private,
        html_url: repo.html_url,
        description: repo.description,
        url: repo.url,
        forks_url: repo.forks_url,
        contributors_url: repo.contributors_url,
        git_created_at: repo.created_at,
        git_updated_at: repo.updated_at,
        git_pushed_at: repo.pushed_at,
        ssh_url: repo.ssh_url,
        clone_url: repo.clone_url,
        size: repo.size,
        archived: repo.archived,
        disabled: repo.disabled,
        visibility: repo.visibility,
        forks: repo.forks,
        open_issues: repo.open_issues,
        watchers: repo.watchers,
        default_branch: repo.default_branch,
        username: userData.login
      }));

      await Repository.bulkCreate(destructuredRepositories, { transaction: t });
      await t.commit();
      
      user = await User.findOne({
        where: { username: username },
        include: 'repositories'
      });
      
      await getUserFollowersAndFriends(username);
    }

    return user;
  } catch (error) {
    console.error('Error in fetchOrSaveUserDetails:', error);
    await t.rollback();
    throw new Error('Failed to fetch or save user details');
  }
};


// ----------------------------------------------------------------------------------


const softDeleteUser = async (username) => {
  try {
    const user = await User.findOne({ where: { username } });
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }
    await user.destroy();
  } catch (error) {
    console.error('Error in softDeleteUser:', error);
    throw error;
  }
};


// ----------------------------------------------------------------------------------


const forceDeleteUser = async (username) => {
  try {
    const user = await User.findOne({ where: { username }, paranoid: false });
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }
    await user.destroy({ force: true });
  } catch (error) {
    console.error('Error in forceDeleteUser:', error);
    throw error;
  }
};


// ----------------------------------------------------------------------------------


const getUsers = async (sort, by) => {
  try {
      const validSortFields = [
        'user_id', 'username', 'name', 'company', 'location', 'email',
        'twitter_username', 'public_repos', 'public_gists', 'followers',
        'following', 'github_created_at', 'github_updated_at'
      ];

      const queryOptions = {
        attributes: [
          'user_id', 'username', 'name', 'company', 'blog', 'location', 'email',
          'bio', 'twitter_username', 'public_repos', 'public_gists', 'followers',
          'following', 'github_created_at', 'github_updated_at'
        ]
      };

      if (sort && validSortFields.includes(sort)) {
        const validSortOrders = ['ASC', 'DESC'];
        const sortOrder = by?.toUpperCase();
        
        if (validSortOrders.includes(sortOrder)) {
          queryOptions.order = [[sort, sortOrder]];
        }
        else
        queryOptions.order = [[sort]];
      }

      return await User.findAll(queryOptions);
  } catch (error) {
    console.error('Error in getUsers:', error);
    throw new Error('Failed to fetch users');
  };
}


// ----------------------------------------------------------------------------------


const fetchFollowers = async (username) => {
  try {
    const followers = await Follower.findAll({where: {username}, raw: true})
    return followers;
  } catch (error) {
    console.error("Error while fetching user's followers:", error);
    throw new Error("Failed to fetch user's followers");
  }
};


// ----------------------------------------------------------------------------------


const getUserFollowersAndFriends = async (username) => {
  try {
    const [response1, response2] = await Promise.all([
      axios.get(`https://api.github.com/users/${username}/followers`, {
          headers: { 'Authorization': `Bearer ${token}` }
      }),
      axios.get(`https://api.github.com/users/${username}/following`, {
        headers: { 'Authorization': `Bearer ${token}` }
      })
    ]);

    const followers = response1.data;
    const following = response2.data;

    const followersFriendsMap = followers.reduce((acc, el) => {
      acc[el.login] = { isFriend: false };
      return acc;
    }, {});

    following.forEach(el => {
      if (followersFriendsMap[el.login]) {
        followersFriendsMap[el.login].isFriend = true;
      }
    });

    const arr = followers.map(el => ({
      username,
      follower_username: el.login,
      avatar_url: el.avatar_url,
      isFriend: followersFriendsMap[el.login].isFriend
    }));

    await Follower.bulkCreate(arr);
    return true;
  } catch (error) {
    console.error("Error while generating followers/friends list:", error);
    throw new Error("Failed to generate followers/friends list");
  }
};


// ----------------------------------------------------------------------------------


const searchUsersInDatabase = async (name, location, company, username) => {
  try {
    let whereClause = {};
      
    if (location) {
        whereClause.location = { [Op.like]: `%${location}%` };
    }
    if (username) {
        whereClause.username = { [Op.like]: `%${username}%` };
    }
    if (name) {
        whereClause.name = { [Op.like]: `%${name}%` };
    }
    if (company) {
        whereClause.company = { [Op.like]: `%${company}%` };
    }
    return await User.findAll({
      where: whereClause,
      attributes: ['user_id', 'username', 'name', 'location', 'company', 'html_url']
    });
  } 
  catch (error) {
    console.error('Error in searchUsersInDatabase:', error);
    throw new Error('Failed to search users in database');
  }
};


// ----------------------------------------------------------------------------------


const updateUserDetails = async (username) => {
  try {
    const user = await User.findOne({ where: { username } });
    if (!user) {
      const error = new Error('User not found');
      error.statusCode = 404;
      throw error;
    }

    const response = await axios.get(`https://api.github.com/users/${username}`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });
    const userData = response.data;

    const dbUpdatedAt = moment(user.github_updated_at);
    const responseUpdatedAt = moment(userData.updated_at);

    if (dbUpdatedAt.isAfter(responseUpdatedAt)) {
      return 'Database updated_at is greater (more recent)';
    } 
    else if (dbUpdatedAt.isBefore(responseUpdatedAt)) {
      await User.update({
          avatar_url: userData.avatar_url,
          url: userData.url,
          html_url: userData.html_url,
          repos_url: userData.repos_url,
          name: userData.name,
          company: userData.company,
          blog: userData.blog,
          location: userData.location,
          email: userData.email,
          bio: userData.bio,
          twitter_username: userData.twitter_username,
          public_repos: userData.public_repos,
          public_gists: userData.public_gists,
          followers: userData.followers,
          following: userData.following,
          github_updated_at: userData.updated_at
      }, {
        where: { username: username }
      });
      return 'Updated User Details';
    } else {
      return 'Both dates are equal';
    }  
  } catch (error) {
    console.error('Error in updateUserDetails:', error);
    throw error;
  }
};


// ----------------------------------------------------------------------------------


const getMutualsofUser = async (username) => {
  try {
    const friends = await Follower.findAll({
        where: {
          username: username,
          isFriend: true
        },
        attributes: ['follower_username']
      });

      return friends.map(f => f.follower_username);
  } catch (error) {
    console.error('Error in getMutualsofUser:', error);
    throw new Error('Failed to get mutual users');
  }
};


// ---------------------------------------------------------------------


module.exports = {
  fetchOrSaveUserDetails,
  softDeleteUser,
  forceDeleteUser,
  getUsers,
  fetchFollowers,
  searchUsersInDatabase,
  updateUserDetails,
  getMutualsofUser
};