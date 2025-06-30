import express from "express";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const router = express.Router();

// Pour déterminer le chemin absolu
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Chemin vers le fichier JSON
const dataPath = path.join(__dirname, "../data/produits.json");

// 🔹 Récupérer tous les produits
router.get("/", async (req, res) => {
  try {
    const data = await fs.readFile(dataPath, "utf-8");
    const produits = JSON.parse(data);
    res.json(produits);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
});

// 🔹 Ajouter un produit
router.post("/", async (req, res) => {
  try {
    const nouveauProduit = req.body;
    const data = await fs.readFile(dataPath, "utf-8");
    const produits = JSON.parse(data);

    nouveauProduit.id = produits.length ? produits[produits.length - 1].id + 1 : 1;
    produits.push(nouveauProduit);

    await fs.writeFile(dataPath, JSON.stringify(produits, null, 2));
    res.status(201).json(nouveauProduit);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
});

// 🔹 Modifier un produit
router.put("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const data = await fs.readFile(dataPath, "utf-8");
    const produits = JSON.parse(data);

    const index = produits.findIndex(p => p.id === id);
    if (index === -1) return res.status(404).json({ message: "Produit non trouvé" });

    produits[index] = { ...produits[index], ...req.body };

    await fs.writeFile(dataPath, JSON.stringify(produits, null, 2));
    res.json(produits[index]);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
});

// 🔹 Supprimer un produit
router.delete("/:id", async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const data = await fs.readFile(dataPath, "utf-8");
    let produits = JSON.parse(data);

    const initialLength = produits.length;
    produits = produits.filter(p => p.id !== id);

    if (produits.length === initialLength)
      return res.status(404).json({ message: "Produit non trouvé" });

    await fs.writeFile(dataPath, JSON.stringify(produits, null, 2));
    res.json({ message: "Produit supprimé avec succès" });
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
});

export default router;
