import express from "express";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { body, validationResult } from 'express-validator';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dataPath = path.join(__dirname, "../data/produits.json");

// Validation
const validateLivre = [
  body('titre').notEmpty().withMessage('Le titre est requis'),
  body('categorie').notEmpty().withMessage('La catégorie est requise'),
  body('prix').isFloat({ min: 0 }).withMessage('Le prix doit être un nombre positif'),
  body('image').isURL().withMessage("L'image doit être une URL valide"),
  body('description').optional().isString()
];

// Lire tous les livres
router.get("/", async (req, res) => {
  try {
    const data = await fs.readFile(dataPath, "utf-8");
    const livres = JSON.parse(data);
    // OU filtrer par catégorie
     if (req.query.categorie) {
      const categorie = req.query.categorie.toLowerCase();
      livres = livres.filter(l =>
        l.categorie.toLowerCase() === categorie
      );
    }
    res.json(livres);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
});

// Ajouter un livre
router.post("/", verifierAdmin,validateLivre, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const nouveau = req.body;
    const data = await fs.readFile(dataPath, "utf-8");
    const livres = JSON.parse(data);

    nouveau.id = livres.length ? livres[livres.length - 1].id + 1 : 1;
    livres.push(nouveau);

    await fs.writeFile(dataPath, JSON.stringify(livres, null, 2));
    res.status(201).json(nouveau);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
});

// Modifier un livre
router.put("/:id",verifierAdmin, validateLivre, async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  try {
    const id = parseInt(req.params.id);
    const data = await fs.readFile(dataPath, "utf-8");
    const livres = JSON.parse(data);

    const index = livres.findIndex(l => l.id === id);
    if (index === -1) return res.status(404).json({ message: "Livre non trouvé" });

    livres[index] = { ...livres[index], ...req.body };

    await fs.writeFile(dataPath, JSON.stringify(livres, null, 2));
    res.json(livres[index]);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
});

// Supprimer un livre
router.delete("/:id",verifierAdmin, async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const data = await fs.readFile(dataPath, "utf-8");
    let livres = JSON.parse(data);

    const initialLength = livres.length;
    livres = livres.filter(l => l.id !== id);

    if (livres.length === initialLength)
      return res.status(404).json({ message: "Livre non trouvé" });

    await fs.writeFile(dataPath, JSON.stringify(livres, null, 2));
    res.json({ message: "Livre supprimé avec succès" });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
});

export default router;
