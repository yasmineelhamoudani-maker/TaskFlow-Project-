const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
    // 1. Récupérer le token du header
    const token = req.header('x-auth-token');

    // 2. Vérifier si pas de token
    if (!token) {
        return res.status(401).json({ msg: 'No token, authorization denied' });
    }

    // 3. Vérifier le token
    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'SECRET_KEY_DEFAULT');
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Token non valide' });
    }
};