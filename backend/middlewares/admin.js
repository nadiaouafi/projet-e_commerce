// middlewares/admin.js

export function verifierAdmin(req, res, next) {
  const isAdmin = req.headers["x-admin"];

  if (isAdmin === "true") {
    next(); // Autorisé
  } else {
    res.status(403).json({ message: "Accès refusé : admin requis." });
  }
}

function verifierConnexion(req, res, next) {
  if (!req.session.utilisateur) {
    return res.status(401).json({ message: "Non connecté" });
  }
  next();
}