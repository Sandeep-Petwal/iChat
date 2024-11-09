const jwt = require('jsonwebtoken');
const secret = process.env.PRIVATE_KEY || "sandeepprasadpetwal51";

// user auth
exports.auth = (req, res, next) => {
    const token = req.headers['token'];
    console.log("\nInside the auth middleware ");
    if (!token) {
        return res.status(401).json({ message: "No token provided" });
    }
    jwt.verify(token, secret, (err, user) => {
        if (err) {
            console.log("token verifying fail  ❌");
            console.log("TOken was :: " + token);
            return res.sendStatus(403);

        }
        req.user = user;
        console.log("Successfully verified token ✅!");
        next();
    })
}