

const SECRET = "Bob___$*Leponge*$$"; 
export function verifierAdmin(req, res, next) {
  const authHeader = req.headers.authorization;


  if (!authHeader) {
    return res.status(401).json({ message: "Token requis" });
  }

  const token = authHeader.split(" ")[1];

  try {
   
    const decoded = jwt.verify(token, SECRET);

    // Vérifie si l'utilisateur est bien un admin
    if (decoded.role !== "admin") {
      return res.status(403).json({ message: "Accès interdit (réservé aux admins)" });
    }

    
    req.user = decoded; 
    next();

  } catch (err) {
    return res.status(401).json({ message: "Token invalide ou expiré", error: err.message });
  }
}
