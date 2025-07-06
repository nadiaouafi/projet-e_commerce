
import { produits } from "./data/produit.js"; 

const livresParDefaut = produits;


async function chargerProduits(categorie = "") {
  try {
    let url = "http://localhost:3000/api/produits";
    if (categorie) {
      url += `?categorie=${encodeURIComponent(categorie)}`;
    }

    const reponse = await fetch(url);
    if (!reponse.ok) throw new Error("Erreur serveur");

    const produits = await reponse.json();
    afficherProduits(produits);
  } catch (erreur) {
    console.error("Erreur de chargement :", erreur.message);
  }
}

function afficherProduits(produits) {
  const conteneur = document.getElementById("produits");
  if (!conteneur) {
    console.error("Le conteneur #produits n’a pas été trouvé dans le HTML.");
    return;
  }
  conteneur.innerHTML = ""; 

  produits.forEach((produit) => {
    const carte = document.createElement("div");
    carte.classList.add("carte-produit");

    carte.innerHTML = `
      <img src="${produit.image}" alt="${produit.titre}" class="image-produit" />
      <h2>${produit.titre}</h2>
      <p class="prix">${produit.prix.toFixed(2)} $</p>
      <p>${produit.description}</p>
    `;

    conteneur.appendChild(carte);
  });
}


 
document.addEventListener("DOMContentLoaded",async () => {
  const livresSauvegardes = JSON.parse(localStorage.getItem("livres")) || [];
  const tousLesLivres = [...livresParDefaut, ...livresSauvegardes];



  afficherProduits(tousLesLivres);
});
