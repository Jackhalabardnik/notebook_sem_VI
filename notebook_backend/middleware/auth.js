const jwt = require("jsonwebtoken")

const auth = async (req, res, next) => {
    const token = req.header('authorization')
    if (!token) return res.status(401).send('Access denied. No token provided.')
    try {
        req.user = jwt.verify(token, process.env.JWTPRIVATEKEY)
        next()
    } catch (ex) {
        res.status(400).send('Invalid token: ' + ex + " token: " + token)
    }
}

module.exports = auth