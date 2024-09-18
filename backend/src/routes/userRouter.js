const userController = require('../controllers/userController.js');

//router
const router = require('express').Router()

//------------------------------ ENDPOINTS-----------------------------

// fetch User from DB or fetch&save User to DB.
// API Endpoint: http://localhost:8080/api/users/bnmunesh
router.get('/users/:username', userController.fetchOrSaveUserDetails);

//sorted users from db: http://localhost:8080/api/users?sort=username&by=asc
router.get('/users', userController.getUsersSorted);

//fetch a user's followers: http://localhost:8080/api/users/followers/digitronik
router.get('/users/followers/:username', userController.fetchFollowersController);

//fetch user's friends: http://localhost:8080/api/users/digitronik/mutuals
router.get('/users/:username/friends', userController.getFriendsofUser);

//Search: get users from db based on location,company,etc
//API Endpoint: http://localhost:8080/api/users_search?location=pune&company=xyz&name=abc
router.get('/users_search',userController.searchUsersInDatabase);

//update user details in DB
//API Endpoint: http://localhost:8080/api/users_search?location=pune&company=xyz&name=abc
router.put('/users/:username', userController.updateUserDetails);

//soft delete: http://localhost:8080/api/delete/bnmunesh
router.delete('/delete/:username', userController.softDeleteUser);

//hard or force delete: http://localhost:8080/api/delete/force/bnmunesh
router.delete('/delete/force/:username', userController.forceDeleteUser);


module.exports = router;