var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt');
const { User } = require("../models");
const jwt = require('jsonwebtoken');

router.post('/', async (req, res) => {

    const { username, password } = req.body;

    try {
        const user = await User.scope('withPassword').findOne({
            where: {
                username
            }
        });
    
        if(user === null){
            throw new Error('User not found');
        }

        const is_login = await bcrypt.compare(password, user.password);

        if(is_login){
            const { email, name, username, role } = user;
            const token = jwt.sign({
                exp: Math.floor(Date.now() / 1000) + (60 * 60),
                data: {
                    email,
                    name,
                    username,
                    role

                }
            }, process.env.JWT_SALT)

            res.send({
                token
            });
        }else{
            throw new Error("wrong password");
        }

    } catch (e) {
        res.status(401).send({
            error: 1,
            message: 'Failed to log you in. wrong username or password.'
        })
    }
});

module.exports = router;