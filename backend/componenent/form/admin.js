export function verifierAdmin(req, res, next) {
  const user = req.user;

  if (!user || !user.role || user.role !== "admin") {
    return res.status(403).json({ message: "Accès refusé: admin requis." });
  }

  next();
}
