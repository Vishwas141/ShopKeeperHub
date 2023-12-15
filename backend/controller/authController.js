const User = require("../models/User");
const response = require("../responseHandler/response");
const jwt = require("jsonwebtoken");



exports.registerUser = async (req, res) =>
{
  try
  {
    console.log("req.body");

    const { email, password, confirmPassword } = req.body;

    console.log(email, password, confirmPassword);

    const checkwhetheruserexist = await User.find({ email: email });
    if (!checkwhetheruserexist)
      return response(201, "User already exist");
    const registerUser = await User.create({ email: email, password: password });

    console.log("register user",registerUser);

    const token = await jwt.sign({
      id: registerUser._id,
      email:registerUser.email
    }, 'Tejas');
    
    console.log(token);


    res.cookie('token', token, { httpOnly: true });

    return response(200, "User registration successful",res);

  }
  catch (err)
  {
    return  response(404, err,res);
  }
}


exports.loginUser = async (req, res) =>
{
  try
  {
    const { email, password } = req.body;

    console.log(email, password);

    const checkwhetheruserexist = await User.findOne({ email: email });

     if (checkwhetheruserexist== null)
                  return response(201, "User Not Found",res);
    if (password == checkwhetheruserexist.password)
      return response(203, "Invalid credentials", res);
    

    console.log(checkwhetheruserexist);


    const token = jwt.sign({
      id: checkwhetheruserexist._id,
      email:checkwhetheruserexist.email
    }, 'Tejas');

    res.cookie('token', token, { httpOnly: true });

    return response(200, "User Login successful",res);

  }
  catch (err)
  {
    return  response(404, err.message,res);
  }
}





