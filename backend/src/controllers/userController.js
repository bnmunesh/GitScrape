const UserService = require('../services/userService');

class UserController {
  static async fetchOrSaveUserDetails(req, res) {
    try {
      const { username } = req.params;
      const userObj = await UserService.fetchOrSaveUserDetails(username);
      res.status(201).json(userObj);
    } catch (error) {
      console.error('Error in fetchOrSaveUserDetails:', error);
      res.status(error.statusCode || 500).json({ error: error.message || 'An error occurred while fetching or saving user details' });
    }
  }


  static async softDeleteUser(req, res) {
    try {
      const { username } = req.params;
      await UserService.softDeleteUser(username);
      res.status(200).json({ message: 'User and associated repositories soft deleted' });
    } catch (error) {
      console.error('Error in softDeleteUser:', error);
      res.status(error.statusCode || 500).json({ error: error.message || 'An error occurred while soft deleting the user' });
    }
  }


  static async forceDeleteUser(req, res) {
    try {
      const { username } = req.params;
      await UserService.forceDeleteUser(username);
      res.status(200).json({ message: 'User and associated repositories permanently deleted' });
    } catch (error) {
      console.error('Error in forceDeleteUser:', error);
      res.status(error.statusCode || 500).json({ error: error.message || 'An error occurred while force deleting the user' });
    }
  }


  static async getUsersSorted(req, res) {
    try {
      const { sort, by } = req.query;
      const users = await UserService.getUsers(sort, by);
      res.status(200).json(users);
    } catch (error) {
      console.error('Error in getUsers:', error);
      res.status(500).json({ error: 'An error occurred while fetching users' });
    }
  }


  static async fetchFollowersController(req, res) {
    try {
      const list = await UserService.fetchFollowers(req.params.username);
      if (!list) {
        return res.status(404).json({ error: 'Followers not found' });
      }
      res.status(200).json(list);
    } catch (error) {
      console.error('Error in fetchFollowersController:', error);
      res.status(500).json({ error: error.message || 'An error occurred while fetching followers' });
    }
  }


  static async searchUsersInDatabase(req, res) {
    try {
      const { name, location, company, username } = req.query;
      const users = await UserService.searchUsersInDatabase(name, location, company, username);
      res.json(users);
    } catch (error) {
      console.error('Error in searchUsersInDatabase:', error);
      res.status(500).json({ error: 'An error occurred while searching users', details: error.message });
    }
  }


  static async updateUserDetails(req, res) {
    try {
      const { username } = req.params;
      const result = await UserService.updateUserDetails(username);
      res.status(200).send(result);
    } catch (error) {
      console.error('Error in updateUserDetails:', error);
      res.status(error.statusCode || 500).json({ error: error.message || 'An error occurred while updating user details' });
    }
  }


  static async getFriendsofUser(req, res) {
    try {
      const { username } = req.params;
      const usernames = await UserService.getFriendsofUser(username);
      res.status(200).json(usernames);
    } catch (error) {
      console.error('Error in getMutualsofUser:', error);
      res.status(500).json({ error: error.message || 'An error occurred while fetching mutual users' });
    }
  }
}

module.exports = UserController;