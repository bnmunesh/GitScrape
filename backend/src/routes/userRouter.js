const userController = require('../controllers/userController.js');

//router
const router = require('express').Router()

//user routers

router.post('/users', userController.saveUserDetails);
router.get('/users/followers/:username', userController.fetchFollowersController);


// router.get('/users/:username', userController.getUserWithRepositories);
router.delete('/delete/:username', userController.softDeleteUser);
router.delete('/delete/force', userController.forceDeleteUser);
router.get('/users/update/:username', userController.updateUserDetails);
//search
//sort parama
module.exports = router;