const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const zod = require('zod');
const { User,Accounts}= require('../db');
require('dotenv').config();
const { connect } = require('../db');
const authenticateToken = require('../middleware'); 
const { useRouteError } = require('react-router-dom');

async()=>{
    await connect();
}

const userRouter = express.Router();
userRouter.use(express.json());


const signupSchema = zod.object({
    username: zod.string().email(), 
    firstName: zod.string(),
    lastName: zod.string(),
    password: zod.string().min(6)
});

const updateUserSchema = zod.object({
 password : zod.string().min(6, { message: "Password must be at least 8 characters" }).optional(),
 firstname : zod.string().min(1, { message: "First name cannot be empty" }).optional(),
 lastname : zod.string().min(1, { message: "Last name cannot be empty" }).optional()
})


const signinSchema = zod.object({
    username: zod.string().email(),
    password: zod.string().min(6)
});

userRouter.get("/bulk", async (req, res) => {
    const filter = req.query.filter || "";

    const users = await User.find({
        $or: [{
            firstName: {
                "$regex": filter
            }
        }, {
            lastName: {
                "$regex": filter
            }
        }]
    })

    return res.json({
        user: users.map(user => ({
            username: user.username,
            firstName: user.firstName,
            lastName: user.lastName,
            _id: user._id
        }))
    })
})

userRouter.put('/update', authenticateToken, async (req, res) => {
    const userId = req.user.userId;
    const user = await User.findById(userId).select("username firstName lastName password");
    req.user = user; // Attach full user to req.user
    console.log(`req.user logs this: ${JSON.stringify(req.user, null, 2)}`);    

    const result = updateUserSchema.safeParse(req.body);
    console.log("Validation result:", result); 
    if (!result.success) {
        return res.status(411).json({
            message: "Error while updating information",
            errors: result.error.errors, 
        });
    }

    await User.updateOne({ _id: userId }, req.body);
    
    res.json({
        message: "Updated successfully"
    });
});

userRouter.post('/Sign-up', async (req, res) => {
    try {
        const body = req.body;
        const result = signupSchema.safeParse(req.body);
        
        if (!result.success) {
            return res.status(411).json({ 
                message: "Incorrect inputs", 
                errors: result.error.errors 
            });
        }

        existingUser = await User.findOne({ username: body.username });
        
        if (existingUser) {
            return res.status(411).json({ 
                message: "Email already taken" 
            });
        }

        console.log('eamil is new');
        const user = await User.create({
            username: body.username,
            password: body.password,
            firstName: body.firstName,
            lastName: body.lastName,
        });
        
        

        const userId = user._id;
        await Accounts.create({
            userId,
            balance : 1 + Math.random()*10000
        })
        const token = jwt.sign({ userId }, process.env.JWT_SECRET);

        res.json({
            message: `${user._id} User created successfully`,
            token: token
        });
    } catch (error) {
        console.log('Signup error:', error);
        res.status(500).json({ 
            message: "Internal server error" 
        });

    }
});

userRouter.post('/sign-in', async (req,res)=>{
try{
    const {success} = signinSchema.safeParse(req.body);

    if(!success){
        return res.status(411).json({
            message :"validation failed"
        })
    }

    const user = await User.findOne({
        username : req.body.username,
        password : req.body.password
          })
   
       if(user){
            console.log('user exists');
           const userId = user._id;
           const token = jwt.sign({ userId }, process.env.JWT_SECRET);
           return res.json({
               message:"logged in successfully",
               token : token
           })
           
       }
       else{
        return res.json({
            message: "user doesnt exists"
        })
       }

}
catch(err){
    console.log(`error orrcured : ${err}`);
}
   

})

userRouter.get('/protected', authenticateToken,(req,res)=>{
    return res.send('inside protected route');
})

module.exports = userRouter;



