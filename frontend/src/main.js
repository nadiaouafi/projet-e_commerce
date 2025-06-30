
import { produits } from "./data/produit.js"; 

const livresParDefaut = produits;

function afficherProduits(produits) {
  const conteneur = document.getElementById("produits");
  if (!conteneur) {
    console.error("Le conteneur #produits n’a pas été trouvé dans le HTML.");
    return;
  }

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
 
document.addEventListener("DOMContentLoaded", () => {
  const livresSauvegardes = JSON.parse(localStorage.getItem("livres")) || [];
  const tousLesLivres = [...livresParDefaut, ...livresSauvegardes];
  afficherProduits(tousLesLivres);
});
