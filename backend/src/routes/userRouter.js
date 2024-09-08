const userController = require('../controllers/userController.js');

//router
const router = require('express').Router()



// fetch User from DB or fetch&save User to DB from api: http://localhost:8080/api/users/:username
router.get('/users/:username', userController.fetchOrSaveUserDetails);



//sorted users from db: http://localhost:8080/api/users?sort=username&by=asc
router.get('/users', userController.getUsers);

//Search: get users from db based on location,company,etc
router.get('/users_search',userController.searchUsersInDatabase);

//soft delete
router.delete('/delete/:username', userController.softDeleteUser);

//update user details in DB
router.put('/users/update/:username', userController.updateUserDetails);

//mutual friends
router.get('/users/:username/mutuals', userController.getMutualsofUser);


//hard or force delete
router.delete('/delete/force', userController.forceDeleteUser); 

//fetch a user's followers
router.get('/users/followers/:username', userController.fetchFollowersController);

module.exports = router;