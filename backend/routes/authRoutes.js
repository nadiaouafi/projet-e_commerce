// routes/authRoutes.js
import express from "express";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dataPath = path.join(__dirname, "../data/utilisateurs.json");

// Connexion
router.post("/login", async (req, res) => {
  const { email, motdepasse } = req.body;
  const data = await fs.readFile(dataPath, "utf-8");
  const utilisateurs = JSON.parse(data);
  const user = utilisateurs.find(u => u.email === email && u.motdepasse === motdepasse);
  if (!user) return res.status(401).json({ message: "Identifiants invalides" });
  res.json(user); 
});

// Inscription
router.post("/register", async (req, res) => {
  const nouveau = req.body;
  const data = await fs.readFile(dataPath, "utf-8");
  const utilisateurs = JSON.parse(data);

  const emailExiste = utilisateurs.find(u => u.email === nouveau.email);
  if (emailExiste) return res.status(400).json({ message: "Email déjà utilisé" });

  nouveau.id = Date.now();
  nouveau.role = "client";
  utilisateurs.push(nouveau);

  await fs.writeFile(dataPath, JSON.stringify(utilisateurs, null, 2));
  res.status(200).json(nouveau);
});

router.post("/login", async (req, res) => {
  const { email, motdepasse } = req.body;

  const data = await fs.readFile("data/utilisateurs.json", "utf-8");
  const utilisateurs = JSON.parse(data);
  const utilisateur = utilisateurs.find(u => u.email === email && u.motdepasse === motdepasse);

  if (!utilisateur) {
    return res.status(401).json({ message: "Identifiants invalides" });
  }

  // Stocke l’utilisateur dans la session
  req.session.utilisateur = {
    id: utilisateur.id,
    email: utilisateur.email,
    role: utilisateur.role
  };

  res.json({ message: "Connexion réussie", utilisateur: req.session.utilisateur });
});

router.post("/logout", (req, res) => {
  req.session.destroy();
  res.json({ message: "Déconnecté avec succès" });
});

export default router;
