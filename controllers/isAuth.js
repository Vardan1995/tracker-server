const jwt = require('jsonwebtoken');
const config = require('config');

module.exports = function (token) {
    if (!token) return false
    // console.log("soketi querium token chkaaa");
    try {
        const decoded = jwt.verify(token, config.get('jwtPrivateKey'));
        // console.log("token decoded@ =", decoded);

        return true
    }
    catch (ex) {
        return false
    }
}