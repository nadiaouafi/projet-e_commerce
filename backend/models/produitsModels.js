import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Chemin vers le fichier JSON
const dataPath = path.join(__dirname, "../data/produits.json");

// Lire tous les produits
async function readData() {
  const data = await fs.readFile(dataPath, "utf-8");
  return JSON.parse(data);
}

// Écrire dans le fichier JSON
async function writeData(produits) {
  await fs.writeFile(dataPath, JSON.stringify(produits, null, 2));
}

const produitsModels = {
  //  Obtenir tous les produits
  async getAll() {
    return await readData();
  },

  // Obtenir un produit par ID
  async getById(id) {
    const produits = await readData();
    return produits.find(p => p.id === id);
  },

  // Créer un produit
  async create(nouveauProduit) {
    const produits = await readData();
    const newId = produits.length ? produits[produits.length - 1].id + 1 : 1;
    const produit = { id: newId, ...nouveauProduit };
    produits.push(produit);
    await writeData(produits);
    return produit;
  },

  // Modifier un produit
  async update(id, updates) {
    const produits = await readData();
    const index = produits.findIndex(p => p.id === id);
    if (index === -1) return null;
    produits[index] = { ...produits[index], ...updates };
    await writeData(produits);
    return produits[index];
  },

  // Supprimer un produit
  async delete(id) {
    const produits = await readData();
    const index = produits.findIndex(p => p.id === id);
    if (index === -1) return false;
    produits.splice(index, 1);
    await writeData(produits);
    return true;
  }
};

export default produitsModels;
