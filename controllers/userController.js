const auth = require('../middleware/auth');
const jwt = require('jsonwebtoken');
const config = require('config');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const { User, validate } = require('../models/user');
const mongoose = require('mongoose');



class UserController {
  async login(req, res) {
    try {
      console.log('Login...');
      // const { error } = validate(req.body);
      // if (error) return res.status(400).send(error.details[0].message);
      let user = await User.findOne({ email: req.body.user.email });
      if (!user) return res.status(400).send('Wrong email or password');

      bcrypt.compare(req.body.user.password, user.password, function (error, result) {
        if (error) throw error;
        if (result) {
          const token = user.generateAuthToken();
          res.header('x-auth-token', token).send(_.pick(user, ['_id', 'name', 'email', 'isAdmin']));
        } else {
          return res.status(400).send('Wrong email or password');
        }
      });
    } catch (error) {
      console.log('Failed in login', error);
      res.status(400).send(error.message);
    }
  }

  async create(req, res) {//Sign up the access has only admin
    // console.log(req.body);
    try {
      const { error } = validate(req.body.user);
      if (error) return res.status(400).send(error.details[0].message);

      let user = await User.findOne({ email: req.body.user.email });
      if (user) return res.status(400).send('User with given email already registered.');

      user = new User(_.pick(req.body.user, ['name', 'email', 'password']));
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);
      await user.save();
      res.status(200).send("New profile created successfully")
    } catch (err) {
      console.log(err);
      if (err) return res.status(400).send("missing required parameters")


    }

  }
}

module.exports = new UserController()