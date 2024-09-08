const db= require('../models');
const axios = require('axios');
const moment = require('moment');
const { Op } = require('sequelize');


//create main model
const User= db.users;
const Repository= db.repository;
const Followers = db.followers;

//save user to db
const fetchOrSaveUserDetails = async (req,res) => {
  const t= await db.sequelize.transaction();

  const {username}= req.params;
  try{
      let user = await User.findOne({where: {username: username}, raw: true});
      let userObj;
      if(!user){
      
        let response;
        try{
          response = await axios.get(`https://api.github.com/users/${username}`);
        }catch(error){
          console.log("error while fetching user details", error)
          return res.status(404).json({error: error.message})
        }
          const userData = response.data;
           userObj = {
            username: userData.login,
            github_id: userData.id,
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
        }
          user = await User.create(
              {...userObj},
              { transaction: t } 
          );


          //fetch and save repository details of user
          let reposResponse
          try{
            reposResponse= await axios.get(userData.repos_url);
          }catch(error){
            console.log("error while fetching user repositories", error)
            return res.status(404).json(error.message)
          }
          const repositories = reposResponse.data;
          const destructuredRepositories = []
          for(const repo of repositories){
              const obj = {
                user_id: user.github_id,
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
                default_branch: repo.default_branch
            }
            destructuredRepositories.push(obj)
          }
          const repos = await Repository.bulkCreate(destructuredRepositories,
            { transaction: t}
          );

          // userObj = {...userObj, repositories: destructuredRepositories}
          userObj.repositories= destructuredRepositories
          await t.commit();
          getUserFollowersAndFriends(username)
      }else{
          console.log('\n\n\ninside else',user)
        const userRepos = await Repository.findAll({where: {user_id: user.github_id}, raw: true})
          userObj = {...user, repositories: userRepos}
      }
      
      
      res.status(201).json(userObj);
    }catch(error) {
      await t.rollback();
      res.status(500).json({error: error.message})
    }
}



//soft delete
const softDeleteUser = async (req, res) => {
    try {
      const { username } = req.params;
      const user = await User.findOne({ where: { username: username } });
  
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }

      await user.destroy();
  
      res.status(200).json({ message: 'User and associated repositories soft deleted' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };




//force or hard delete from db
const forceDeleteUser = async (req, res) => {
  
    try {
      const { username } = req.query;
      const user = await User.findOne({ where: { username: username } });
  
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      // Force destroy the user and its repositories
      await user.destroy({ force: true});
  
      res.status(200).json({ message: 'User and associated repositories permanently deleted' });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  };






//get all users sorted by preference
const getUsers = async (req, res) => {
  try {
    const { sort, by } = req.query;

    let queryOptions = {
      attributes: [
        'github_id', 'username', 'name', 'company', 'blog', 'location', 'email',
        'bio', 'twitter_username', 'public_repos', 'public_gists', 'followers',
        'following', 'github_created_at', 'github_updated_at'
      ]
    };

    if (sort) {
      const validSortFields = [
        'github_id', 'username', 'name', 'company', 'location', 'email',
         'twitter_username', 'public_repos', 'public_gists', 'followers',
        'following', 'github_created_at', 'github_updated_at'
      ];

      if (!validSortFields.includes(sort)) {
        return res.status(400).json({ error: 'Invalid sort field' });
      }

      const validSortOrders = ['ASC', 'DESC'];
      const sortOrder = by.toUpperCase();
      
      if (!validSortOrders.includes(sortOrder)) {
        return res.status(400).json({ error: 'Invalid sort order. Use ASC or DESC' });
      }

      queryOptions.order = [[sort, sortOrder]];
    }

    let users = await User.findAll(queryOptions);

    res.status(200).json(users);

  } catch (error) {
    console.error('Error in getUsers:', error);
    res.status(500).json({ error: 'An error occurred while fetching users' });
  }
};




//fetch followers list
const fetchFollowersController = async (req,res)=>{
  const list = await fetchFollowers(req.params.username)
  return res.status(list?200:404).json(list)
}

const fetchFollowers = async (username) => {
  try {
    const followers = await Followers.findAll({where: {username}, raw: true})
    const followersKeyMap = {}
    const followeresArr = followers.map(el =>{
      followersKeyMap[el.username2] = {hydrated: false}
      return el.username2
    })
    const hydratedFollowers = await User.findAll({where:{username: {[Op.in]:followeresArr}}, raw: true})
    hydratedFollowers.forEach(el=>{
      if(followersKeyMap[el.username]){
        followersKeyMap[el.username].hydrated = true
      } 
    })
    const apiHydratedFollowers = []

    const keyArr = Object.keys(followersKeyMap) 
    for(let i=0; i<keyArr.length; i++){
      const el = followersKeyMap[keyArr[i]]
      if(!el.hydrated){
        try{
          const res = await axios.get(`https://api.github.com/users/${keyArr[i]}`)
          const userData = res.data
          const userObj = {
            username: userData.login,
            github_id: userData.id,
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
        }
        apiHydratedFollowers.push(userObj)
        }catch(error){
          console.log("couldn't fetch user details through api when fetching list of followers", error)
        }        
      }
    }
    
    return [...hydratedFollowers, ...apiHydratedFollowers]
  }catch(error){
    console.log("Error while fetching user's followeres:", error);
    return null
  }
} 




//display friends
const getUserFollowersAndFriends = async (username) => {
  try {
    console.log("\n\n@!@!@!@!@@!@!\n\n")
    const [response1, response2] = await Promise.all([
      axios.get(`https://api.github.com/users/${username}/followers`),
      axios.get(`https://api.github.com/users/${username}/following`)
    ])

    const followers = response1.data
    const following = response2.data

    const followersFriendsMap = {}
    followers.forEach(el=>{
      followersFriendsMap[el.login] = {isFriend: false};
    })
    following.forEach(el=>{
      if(followersFriendsMap[el.login]){
        followersFriendsMap[el.login] = {isFriend: true};
      }
    })
    // Create followerers-Friend Structure - array of followers
    const arr = followers.map(el =>{
      return {username, username2: el.login, isFriend: followersFriendsMap[el.login].isFriend}
    })

    const result = await Followers.bulkCreate(arr)
    // console.log("\n\n After inserting, before commiting",{result})
    
    return true;
  }catch(error){
    console.log("\n\nerror while generating followeres/friends list:", error)
    return false
  }
} 





//search db based on username, location, 
const searchUsersInDatabase = async (req,res) => {
  try{
    const { location, company } = req.query;
    
    let whereClause = {};
    
    if (location) {
      whereClause.location = {
        [Op.like]: `%${location}%`
      };
    }
    
    if (company) {
      whereClause.company = {
        [Op.like]: `%${company}%`
      };
    }
    
    const users = await User.findAll({
      where: whereClause,
      attributes: ['github_id', 'username', 'name', 'location', 'company']
    });
    
    res.json(users);
  }catch(error){
    console.error('Error searching users:', error);
    res.status(500).json({ error: 'An error occurred while searching users', details: error.message });
  }
}




//compare and update user details
const updateUserDetails = async (req, res) => {
    try{
        const { username } = req.params;
        const user = await User.findOne({ where: { username: username } });
    
        if (!user) {
          return res.status(404).json({ error: 'User not found' });
        }

        let response;
        try{
            response = await axios.get(`https://api.github.com/users/${username}`);
        }catch(error){
            console.log("error while fetching user details from api", error)
            return res.status(404).json({error: error.message})
        }
        const userData = response.data;
        const dbUpdatedAt = moment(user.github_updated_at);
        const responseUpdatedAt = moment(userData.updated_at);
        if(dbUpdatedAt.isAfter(responseUpdatedAt)){
              console.log("Database updated_at is greater (more recent)")
              return res.status(200).send('Database updated_at is greater (more recent)');
        }
        else if(dbUpdatedAt.isBefore(responseUpdatedAt)){
              console.log("Resposne updated_at is greater (more recent). Update User Details");

              await User.update({
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
            }, {
                where: { username: username }
            });

              return res.status(200).send('Response updated_at is greater (more recent). Update User Details');
        }
        else{
            console.log("Both dates are equal");
            return res.status(200).send('Both are equal');
        }

    }
    catch(error){
        console.log("Error while updating user details:", error);
        return res.status(500).json({ error: 'An error occurred while updating user details' });
    }
};

module.exports={
  fetchOrSaveUserDetails,
  softDeleteUser,
  forceDeleteUser,
  searchUsersInDatabase,
  getUsers,
  updateUserDetails,
  fetchFollowersController,
  getUserFollowersAndFriends
}