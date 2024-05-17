const express     = require('express');
const router     = express.Router();
const userController = require('../Controller/userController');

router
.route('/')
.get(userController.Login)
.post(userController.Register)


router
.route('/:username')
.get(userController.Login)
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
.route('/user/:imageKey')
.get(userController.displayImage)


module.exports = router;