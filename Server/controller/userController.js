var jwt = require('jsonwebtoken');
const Users = require("../models/userModel");
const response = require("../util/response")
const secret = process.env.SECRET_KEY || "sandeepprasadpetwal51"
const bcrypt = require('bcrypt');
const validate = require('../util/validator');

// set status to online
exports.setOnline = async (user_id) => {
    console.log("Inside setOnline");
    try {
        const updateOnline = await Users.update({ online: true }, {
            where: { user_id }
        })
    } catch (error) {
        console.log("Error while updating user online status !", error);
    }
}

// set status to online
exports.setOffline = async (user_id) => {
    console.log("Inside setOffline");
    try {
        const updateOffline = await Users.update({ online: false }, {
            where: { user_id }
        })
    } catch (error) {
        console.log("Error while updating user offline status !", error);
    }
}


// verify token
exports.verify = async (req, res) => {
    const token = req.headers['ichat_token'];
    let user = [];
    const rules = {
        token: "required|string"
    }
    let { status, message } = await validate({ token }, rules);
    if (!status) return response.failed(res, "Provide currect information.", message)

    try {
        jwt.verify(token, secret, (err, verified_user) => {
            if (err) {
                console.log("token verifying fail  ❌");
                return response.unauthorized(res, "Token does not verify !")
            }
            user = verified_user
            console.log("Successfully verified by authJwt middleware ✅!");
        })
        // send the updated user details
        const updated_user = await Users.findOne({ where: { user_id: user.user_id } });
        return response.success(res, "Successfully verified The Token", updated_user);

    } catch (error) {
        console.log(error);
        console.log("Error ");
    }
}


// http://localhost:3000/api/auth/login
exports.login = async (req, res) => {
    const { email, password } = req.body;
    const rules = {
        email: "required|string|email",
        password: "required|string|min:3"
    }
    let { status, message } = await validate({ email, password }, rules);
    if (!status) return response.failed(res, "Provide currect information.", message)

    try {
        const user = await Users.findOne({ where: { email } });
        if (!user) {
            return response.failed(res, "User not found !")
        }
        const match = await bcrypt.compare(password, user.password);
        if (!match) {
            return response.failed(res, "Invalid email or password")
        }
        const token = jwt.sign({ user_id: user.user_id, name: user.name, email: user.email }, secret, { expiresIn: "1d" });
        console.log("Token :: " + token);
        return res.json({ message: "Login success", data: user, token })
    } catch (error) {
        console.log(error);
        return response.failed(res, error, "Error in login !")
    }
}

// http://localhost:3000/api/auth/register
exports.register = async (req, res) => {
    const { email, password, name } = req.body;
    const rules = {
        name: "required|string",
        email: "required|string|email",
        password: "required|string|min:3"
    }
    let { status, message } = await validate({ email, password, name }, rules);
    if (!status) return response.failed(res, "Invalid information.", message)


    try {
        // check if user aleready exist 
        const existingUser = await Users.findAll({ where: { email } });
        if (existingUser.length > 0) {
            return response.failed(res, "User already exists");
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await Users.create({ email, password: hashedPassword, name });
        return res.json({ message: 'User registered successfully', user });
    } catch (error) {
        console.log(error);
        return response.serverError(res, error)
    }
}

exports.updateUser = async (req, res) => {
    const { user_id } = req.params;
    const { name, email } = req.body;

    const rules = {
        name: "required|string",
        email: "required|string|email",
        user_id: "required|integer"
    }
    let { status, message } = await validate({ email, name, user_id }, rules);
    if (!status) return response.failed(res, "Invalid information.", message)


    try {
        const [affectedCount] = await Users.update({ email, name }, { where: { user_id } });
        if (affectedCount === 0) {
            return response.notFound(res, "User not found or no changes made")
        }
        return res.json({ message: 'User updated successfully' });
    } catch (error) {
        console.error(error);
        return response.serverError(res, error);
    }
}

// http://localhost:3000/api/auth/register
exports.getAllUsers = async (req, res) => {
    const users = await Users.findAll({ limit: 10, excluding: ["password"] });
    if (users.length > 0) {
        return res.json({ data: users })
    }
    res.json({ message: "No users found", users: [] })
}

