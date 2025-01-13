const mongoose = require('mongoose');
const { number } = require('zod');
require('dotenv').config();



const connect = async ()=>{
    try{
        console.log('connected to monogo');
        await mongoose.connect(process.env.CONNECTION_STRING);

    }
    catch(err){
        console.log('cant connect to monogo');
        throw `err: - ${err.message}`;
    }
}
const accountsSchema = new mongoose.Schema({
    userId : {type: String,
        ref:'User',
        required : true,
        unique : true
    },
    balance : {type : Number,
    required : true}
})
var Accounts = mongoose.model('Accounts', accountsSchema);



const tableSchema = new mongoose.Schema({
    username: {type: String,
        required: true,
        unique:true},
    password: {
        type: String,
        required:true
    },
    firstName: {type: String,
        required : true},
    lastName:{type: String,
        required : true}
})

var User = mongoose.model('User', tableSchema);

module.exports = { connect, User, Accounts };




