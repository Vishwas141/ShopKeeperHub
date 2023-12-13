const mongoose=require("mongoose");
const User=require("../model/user");
const bcrypt=require("bcrypt");
const jwt=require("jsonwebtoken");
require("dotenv").config();
const token=require("../model/token");




const registerUser=async(req,res)=>
{
  try
  {
      
  }
  catch(err)
  {
    return res.status(200)
  }
}
//create react login form?