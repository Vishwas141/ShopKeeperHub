const Product = require("../models/Product");
const User = require("../models/User");
const response = require("../responseHandler/response");
const jwt = require("jsonwebtoken");
const moment = require("moment");
const emailSender = require("../util/emailSender");

const readline = require("readline");
const fs = require("fs");

const userProduct = async (req, res) => {
  try {
    const token = await req.cookies.token;

    const decodeToken = jwt.verify(token, "Tejas");

    const resData = await User.findById(decodeToken.id).populate("products");

    return response(200, resData.products, res);
  } catch (err) {
    return response(400, err.message, res);
  }
};

//creating product using form without file
const createProduct = async (req, res) => {
  try {
    console.log(req.body);
    let { productname, category, expiry_date, product_id } = req.body;

    const createdProduct = await Product.create(req.body);

    const token = await req.cookies.token;

      const decodeToken = await jwt.verify(token, "Tejas");
      
    

   

    const user = await User.findById(decodeToken.id);

    if (user) {
      user.products.push(createdProduct._id); // Assuming createdProduct has the _id field
      await user.save();
    } else {
      return response(404, "User not found", res);
    }

    return response(200, createdProduct, res);
  } catch (err) {
    return response(500, err.message, res);
  }
};
const removeProduct = async (req, res) => {
  try {
    const productId = req.params._id; // Corrected to use req.params.id

    const token = req.cookies.token;

    const decodeToken = jwt.verify(token, "Tejas");

    const user = await User.findById(decodeToken.id);

    if (user) {
      // Remove the product from the user's products array using filter
      user.products = user.products.filter((product) => product != productId);
      await user.save();
      return response(200, "Product removed successfully", res);
    } else {
      return response(404, "User not found", res);
    }
  } catch (err) {
    console.error(err);
    return response(500, err.message, res);
  }
};

//add product via file




const addproductviaFile = async (req, res) => {
  try {
    const { products } = req.body;

    const token = req.cookies.token;
    const decodeToken = jwt.verify(token, "Tejas");
    const user = await User.findById(decodeToken.id);

    if (!user) {
      return response(404, "User not found", res);
    }

    const projectIds = [];

    // Iterate through products and create Project instances
    for (const product of products) {
      const { productName, expiryDate } = product;

      // Parse expiryDate using moment and convert it to a valid Date object
      const parsedExpiryDate = moment(expiryDate, 'MMM DD YYYY').toDate();

      // Create a new Project
      const createdProject = await Product.create({
        productname: productName,
        expiry_date: parsedExpiryDate,
        // Add other fields as needed
      });

      // Add the project ID to the array
      projectIds.push(createdProject._id);
    }

    // Push project IDs into the user's products array
    user.products.push(...projectIds);

    // Save the user with the new projects
    await user.save();

    return response(200, "Projects added successfully", res);
  } catch (err) {
    console.error(err);
    return response(500, err.message, res);
  }
};


const expiryNotification = async (req, res) => {
  try {
    const token = await req.cookies.token;
    const decodeToken = jwt.verify(token, "Tejas");
    const user = await User.findById(decodeToken.id).populate("products");

    const currentDate = moment();
    const expiringProducts = user.products.filter(product => {
      const expiryDate = moment(product.expiry_date);
      const daysUntilExpiry = expiryDate.diff(currentDate, 'days');
      return daysUntilExpiry <= 0 || (daysUntilExpiry > 0 && daysUntilExpiry <= 10);
    });

    const productTable = `
      <table style="border-collapse: collapse; width: 100%;">
        <thead>
          <tr>
            <th style="border: 1px solid #dddddd; text-align: left; padding: 8px;">Product Name</th>
            <th style="border: 1px solid #dddddd; text-align: left; padding: 8px;">Expiry Date</th>
          </tr>
        </thead>
        <tbody>
          ${expiringProducts.map(product => `
            <tr>
              <td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">${product.productname}</td>
              <td style="border: 1px solid #dddddd; text-align: left; padding: 8px;">${moment(product.expiry_date).format('MMMM DD, YYYY')}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    `;

    const emailSubject = 'Expiring Products Notification';
    const emailBody = `
      <h2 style="color: #0070f3; font-size: 24px;">Expiring Products Notification</h2>
      <p>Dear User,</p>
      <p>This is to inform you that the following products are either expired or will expire in the next 10 days:</p>
      ${productTable}
      <p>Please take necessary actions to manage these products accordingly.</p>
      <p>Thank you for your attention.</p>
    `;

    const emailResponse = await emailSender(user.email, emailSubject, emailBody);

    console.log(emailResponse);

    return response(200, 'Notification email sent successfully', res);
  } catch (err) {
    console.error(err);
    return response(500, err.message, res);
  }
};

module.exports = {
  userProduct,
  createProduct,
  removeProduct,
    addproductviaFile,
  expiryNotification
};
