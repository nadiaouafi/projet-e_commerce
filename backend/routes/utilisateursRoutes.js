import express from "express";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { body, validationResult } from 'express-validator';
import { verifierAdmin } from "../middlewares/admin.js";

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dataPath = path.join(__dirname, "../data/utilisateurs.json");

// Valider et créer un utilisateur
router.post('/', [
  body('email').isEmail().withMessage('Email invalide'),
  body('password').isLength({ min: 6 }).withMessage('Mot de passe trop court'),
  // autres validations si besoin
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const nouveau = req.body;
    const data = await fs.readFile(dataPath, "utf-8");
    const utilisateurs = JSON.parse(data);

    nouveau.id = utilisateurs.length ? utilisateurs[utilisateurs.length - 1].id + 1 : 1;
    utilisateurs.push(nouveau);

    await fs.writeFile(dataPath, JSON.stringify(utilisateurs, null, 2));
    res.status(201).json(nouveau);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
});


// Tous les utilisateurs

router.post('/users', [
  body('email').isEmail().withMessage('Email invalide'),
  body('password').isLength({ min: 6 }).withMessage('Mot de passe trop court'),
  
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
  
    return res.status(400).json({ errors: errors.array() });
  }

  res.status(201).json({ message: 'Utilisateur créé avec succès' });
});


// Tous les utilisateurs
router.get("/", async (req, res) => {
  try {
    const data = await fs.readFile(dataPath, "utf-8");
    const utilisateurs = JSON.parse(data);
    res.json(utilisateurs);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
});

// Ajouter un utilisateur
router.post("/", async (req, res) => {
  try {
    const nouveau = req.body;
    const data = await fs.readFile(dataPath, "utf-8");
    const utilisateurs = JSON.parse(data);

    nouveau.id = utilisateurs.length ? utilisateurs[utilisateurs.length - 1].id + 1 : 1;
    utilisateurs.push(nouveau);

    await fs.writeFile(dataPath, JSON.stringify(utilisateurs, null, 2));
    res.status(201).json(nouveau);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
});

// Modifier un utilisateur
router.put("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const data = await fs.readFile(dataPath, "utf-8");
    const utilisateurs = JSON.parse(data);

    const index = utilisateurs.findIndex(u => u.id === id);
    if (index === -1) return res.status(404).json({ message: "Utilisateur non trouvé" });

    utilisateurs[index] = { ...utilisateurs[index], ...req.body };

    await fs.writeFile(dataPath, JSON.stringify(utilisateurs, null, 2));
    res.json(utilisateurs[index]);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
});

// Supprimer un utilisateur
router.delete("/:id", verifierAdmin, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const data = await fs.readFile(dataPath, "utf-8");
    let utilisateurs = JSON.parse(data);

    const initialLength = utilisateurs.length;
    utilisateurs = utilisateurs.filter(u => u.id !== id);

    if (utilisateurs.length === initialLength)
      return res.status(404).json({ message: "Utilisateur non trouvé" });

    await fs.writeFile(dataPath, JSON.stringify(utilisateurs, null, 2));
    res.json({ message: "Utilisateur supprimé avec succès" });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
});

export default router;
