const express     = require('express');
const router     = express.Router();
const userController = require('../Controller/userController');

router
.route('/')
.post(userController.Register)

router
.route('/login')
.post(userController.Login)


router
.route('/:username')
.delete(userController.deleteUser)


router
.route('/user/name')
.put(userController.updateName)

router
.route('/user/age')
.put(userController.updateAge)

router
.route('/user/photo')
.put(userController.updatePhoto)

router
.route('/user/image')
.post(userController.displayImage)


module.exports = router;