import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";
const SECRET = "SECRET_A_CHANGER";

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const data = await fs.readFile(dataPath, "utf-8");
  const utilisateurs = JSON.parse(data);
  const utilisateur = utilisateurs.find(u => u.email === email);

  if (!utilisateur) return res.status(404).json({ message: "Utilisateur introuvable" });

  const match = await bcrypt.compare(password, utilisateur.password);
  if (!match) return res.status(401).json({ message: "Mot de passe incorrect" });

  const token = jwt.sign({ id: utilisateur.id, role: utilisateur.role }, SECRET, { expiresIn: "1h" });
  res.json({ token });
});
