import { getProduits, saveProduits } from "../models/produitsRoutes.js";

export async function listerProduits(req, res) {
  const produits = await getProduits();
  res.json(produits);
}

export async function ajouterProduit(req, res) {
  const produits = await getProduits();
  const nouveau = { id: Date.now(), ...req.body };
  produits.push(nouveau);
  await saveProduits(produits);
  res.status(201).json(nouveau);
}

export async function modifierProduit(req, res) {
  const id = Number(req.params.id);
  const produits = await getProduits();
  const index = produits.findIndex(p => p.id === id);
  if (index === -1) return res.status(404).json({ message: "Produit non trouvé" });

  produits[index] = { ...produits[index], ...req.body };
  await saveProduits(produits);
  res.json(produits[index]);
}

export async function supprimerProduit(req, res) {
  const id = Number(req.params.id);
  let produits = await getProduits();
  produits = produits.filter(p => p.id !== id);
  await saveProduits(produits);
  res.json({ message: "Produit supprimé" });
}
