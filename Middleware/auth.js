const jwt = require('jsonwebtoken');

module.exports = function (req, res, next) {
  // Récupérer le token depuis le header
  const token = req.header('x-auth-token');

  // Vérifier si pas de token
  if (!token) {
    return res.status(401).json({ msg: 'Pas de token, autorisation refusée' });
  }

  // Vérifier le token
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'Yasmine_TaskFlow_Secret_2026');
    
    if (decoded.user) {
      req.user = decoded.user;
    } else {
      req.user = decoded;
    }
    next(); 
  } catch (err) {
    res.status(401).json({ msg: 'Token non valide' });
  }
};