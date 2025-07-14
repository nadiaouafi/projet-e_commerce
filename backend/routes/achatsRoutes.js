// routes/achatsRoutes.js
import express from "express";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";

const router = express.Router();
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dataPath = path.join(__dirname, "../data/achats.json");

router.get("/:userId", async (req, res) => {
  try {
    const data = await fs.readFile(dataPath, "utf-8");
    const achats = JSON.parse(data);
    const achatsUtilisateur = achats.filter(a => a.userId == req.params.userId);
    res.json(achatsUtilisateur);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
});

router.post("/:userId", async (req, res) => {
  try {
    const { produits } = req.body;
    const data = await fs.readFile(dataPath, "utf-8");
    const achats = JSON.parse(data);

    const nouvelAchat = {
      id: Date.now(),
      userId: req.params.userId,
      date: new Date().toISOString(),
      produits
    };

    achats.push(nouvelAchat);
    await fs.writeFile(dataPath, JSON.stringify(achats, null, 2));
    res.status(201).json(nouvelAchat);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
});

export default router;
