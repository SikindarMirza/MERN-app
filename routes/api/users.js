const express = require('express');
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');

const router = express.Router();

const User = require('../../models/User');

router.get('/test', (req,res) => {
    res.json({
        msg: "User's api"
    })
})

router.post('/register', (req,res) => {
    User.findOne({email: req.body.email})
        .then( user => {
            if(user) {
                return res.status(400).json({email: "Email already exists"});
            } else {
                const avatar = gravatar.url(req.body.email, {
                    s: '200',
                    r: 'pg',
                    d: 'mm'
                })
                const newUser = new User({
                    name: req.body.name,
                    email: req.body.email,
                    avatar,
                    password: req.body.password
                })

                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                        if(err) throw err;
                        newUser.password = hash;
                        newUser.save()
                            .then(user => res.json(user))
                            .catch( err => console.log(err));
                    })
                })

                res.json( newUser);
            }
        })
});

router.post('/login', (req,res) => {
    const email = req.body.email;
    const password = req.body.password;

    User.findOne({ email })
        .then(user => {
            if(!user) {
                return res.status(404).send({email:"User not found"});
            }
            bcrypt.compare(password, user.password)
                .then(isMatch => {
                    if(isMatch) {
                        // res.send("Success");
                        const payload = {email: user.email, name: user.name}
                        jwt.sign(payload, keys.secret, {expiresIn: 3600}, (err, token) => {
                            res.json({
                                success: true,
                                token
                            })
                        });
                    }
                    else{
                        return res.status(400).send({password:"Password incorrect"});
                    }
                });
        });
});

module.exports = router;