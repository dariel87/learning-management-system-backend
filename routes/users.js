var express = require('express');
var router = express.Router();
const bcrypt = require('bcrypt');
const { User } = require("../models");

/**
 * LIST RECORDS
 */
router.get('/', async (req, res) => {
    const { per_page = 10, page = 1, all, role} = req.query;
    let users;

    try {
        if(all){
            if(!role) {
                throw new Error('role should be included while calling all')
            }
            users = await User.findAll({
                where: {
                    role
                }
            });
    
            res.send(users);
        }else{
            users = await User.findAndCountAll({
                limit: parseInt(per_page),
                offset: parseInt(per_page) * (parseInt(page) - 1) 
            });
    
            users.total_pages = Math.ceil(users.count / parseInt(per_page));
    
            res.send(users);
        }
    } catch(e) {
        res.status(500).send({
            error: 1,
            message: `Failed fetch users. ${e}`
        })
    }
});

/**
 * CREATE RECORD
 */
router.post('/', async (req, res) => {
    const { username, name, email, password, role} = req.body;
    const saltRounds = 10;

    const hashedPassword = await bcrypt.hash(password, saltRounds);

    try {
        await User.create({
            username,
            name,
            email,
            role,
            password: hashedPassword
        });

        res.send({
            error: 0,
            message: 'User created successfully'
        })
    } catch (e) {
        console.log(e);
        res.status(500).send({
            error: 1,
            message: 'Failed creating user.'
        });
    }
})

/**
 * GET RECORD DETAIL
 */
router.get('/:id', async (req, res) => {
    const { id } = req.params;

    try { 
        const user = await User.findByPk(id);
        
        if(user === null){
            throw new Error('User not found');
        }

        res.send(user)
    } catch(e) {
        console.log(e);
        res.status(404).send({
            error: 1,
            message: 'User not found.'
        })
    }
})

/**
 * UPDATE RECORD
 */
router.put('/:id', async (req, res) => {
    const { id } = req.params;
    const { name, email, role} = req.body;

    try { 
        const user = await User.findByPk(id);

        if(user === null){
            throw new Error('User not found');
        }

        user.name = name;
        user.email = email;
        user.role = role;
        await user.save();

        res.send({
            error: 0,
            message: 'User updated successfully'
        })
    } catch(e) {
        console.log(e);
        res.status(500).send({
            error: 1,
            message: 'Failed updating user. ' + e
        })
    }
});

router.delete('/:id', async (req, res) => {
    const { id } = req.params;

    try { 
        const user = await User.findByPk(id);

        if(user === null){
            throw new Error('User not found');
        }

        await user.destroy();

        res.send({
            error: 0,
            message: 'User deleted successfully'
        })
    } catch(e) {
        console.log(e);
        res.status(500).send({
            error: 1,
            message: 'Failed deleting user. ' + e
        })
    }
})

module.exports = router;
