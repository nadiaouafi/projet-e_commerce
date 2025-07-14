// routes/panierRoutes.js
import express from "express";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";


const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const dataPath = path.join(__dirname, "../data/panier.json");

let panier = {
  produits: []
};

router.get("/", async (req, res) => {
  try {
    const data = await fs.readFile(dataPath, "utf-8");
    const paniers = JSON.parse(data);
    const panier = paniers.find(p => p.userId == req.params.userId) || { userId: req.params.userId, produits: [] };
    res.json(panier);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
});


router.post("/", async (req, res) => {
  try {
    const data = await fs.readFile(dataPath, "utf-8");
    let paniers = JSON.parse(data);

    let panier = paniers.find(p => p.userId == req.params.userId);
    if (!panier) {
      panier = { userId: req.params.userId, produits: [] };
      paniers.push(panier);
    }

    panier.produits.push(req.body); 
    await fs.writeFile(dataPath, JSON.stringify(paniers, null, 2));
    res.status(201).json(panier);
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
});


router.delete("/", async (req, res) => {
  try {
    const data = await fs.readFile(dataPath, "utf-8");
    let paniers = JSON.parse(data);

    let panier = paniers.find(p => p.userId == req.params.userId);
    if (panier) {
      panier.produits = panier.produits.filter(p => p.id != req.params.produitId);
      await fs.writeFile(dataPath, JSON.stringify(paniers, null, 2));
      res.json(panier);
    } else {
      res.status(404).json({ message: "Panier non trouvé" });
    }
  } catch (err) {
    res.status(500).json({ message: "Erreur serveur", error: err.message });
  }
});

router.get("/", (req, res) => {
  const produits = JSON.parse(fs.readFileSync("./data/produits.json", "utf-8"));
  const panierData = JSON.parse(fs.readFileSync("./data/panier.json", "utf-8"));

  const panierAvecDetails = panierData.produits.map(item => {
    const produit = produits.find(p => p.id === item.idProduit);
    if (!produit) return null;

    return {
      id: produit.id,
      titre: produit.titre,
      image: produit.image,
      prix: produit.prix,
      quantite: item.quantite
    };
  }).filter(item => item !== null);

  res.json(panierAvecDetails);
});


// ajoute ou augmente la quantité
router.post('/:idProduit', (req, res) => {
  const id = parseInt(req.params.idProduit);
  if (isNaN(id)) {
    return res.status(400).json({ erreur: "idProduit invalide" });
  }

  const item = panier.produits.find(p => p.idProduit === id);
  if (item) {
    item.quantite++;
  } else {
    panier.produits.push({ idProduit: id, quantite: 1 });
  }
  res.status(200).json(panier);
});

// diminue la quantité
router.patch('/:idProduit', (req, res) => {
  const id = parseInt(req.params.idProduit);
  if (isNaN(id)) {
    return res.status(400).json({ erreur: "idProduit invalide" });
  }

  const item = panier.produits.find(p => p.idProduit === id);
  if (item) {
    item.quantite--;
    if (item.quantite <= 0) {
      panier.produits = panier.produits.filter(p => p.idProduit !== id);
    }
    return res.status(200).json(panier);
  } else {
    return res.status(404).json({ erreur: "Produit non trouvé dans le panier" });
  }
});

// supprime le produit complètement
router.delete('/:idProduit', (req, res) => {
  const id = parseInt(req.params.idProduit);
  if (isNaN(id)) {
    return res.status(400).json({ erreur: "idProduit invalide" });
  }

  const initialLength = panier.produits.length;
  panier.produits = panier.produits.filter(p => p.idProduit !== id);

  if (panier.produits.length === initialLength) {
    return res.status(404).json({ erreur: "Produit non trouvé dans le panier" });
  }

  res.status(200).json(panier);
});

// récupérer le panier complet 
router.get('/', (req, res) => {
  res.json(panier);
});

export default router;
