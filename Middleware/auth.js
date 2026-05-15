const jwt = require('jsonwebtoken');

module.exports = function(req, res, next) {
 
    const token = req.header('x-auth-token') || req.header('Authorization')?.replace('Bearer ', '');

    if (!token) {
        return res.status(401).json({ msg: 'Pas de token, autorisation refusée' });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'SECRET_KEY_DIP_2026');
        req.user = decoded;
        next();
    } catch (err) {
        res.status(401).json({ msg: 'Le token n\'est pas valide' });
    }
};