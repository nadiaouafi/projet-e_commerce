let tousLesProduits = [];

// Charger les produits depuis l’API
async function chargerProduits(categorie = "") {
  try {
    let url = "http://localhost:3000/api/produits";
    if (categorie) {
      url += `?categorie=${encodeURIComponent(categorie)}`;
    }

    const reponse = await fetch(url);
    if (!reponse.ok) throw new Error("Erreur serveur");

    const data = await reponse.json();
    const produits = Array.isArray(data) ? data : data.produits;

    tousLesProduits = produits;
    afficherProduits(produits);
  } catch (erreur) {
    console.error("Erreur de chargement :", erreur.message);
  }
}

// Afficher les produits dans le DOM
function afficherProduits(produits) {
  const conteneur = document.getElementById("produits");
  if (!conteneur) return;

  conteneur.innerHTML = "";

  produits.forEach((produit) => {
    const carte = document.createElement("div");
    carte.classList.add("carte-produit");

    carte.innerHTML = `
      <img src="${produit.image}" alt="${produit.titre}" class="image-produit" />
      <h2>${produit.titre}</h2>
      <p class="prix">${produit.prix.toFixed(2)} $</p>
      <p>${produit.description}</p>
      <button class="ajouter-panier" data-id="${produit.id}">Ajouter au panier</button>
    `;

    conteneur.appendChild(carte);
  });

  document.querySelectorAll(".ajouter-panier").forEach((btn) => {
    btn.addEventListener("click", async (e) => {
      const idProduit = e.target.dataset.id;

      try {
        const reponse = await fetch("http://localhost:3000/api/panier", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ idProduit: parseInt(idProduit), quantite: 1 }),
        });

        if (!reponse.ok) throw new Error("Échec de l'ajout au panier");

        const panier = await reponse.json();
        afficherQuantitePanier(panier);
        afficherDetailsPanier(panier);
      } catch (err) {
        console.error("Erreur ajout au panier :", err.message);
      }
    });
  });
}

// Charger et afficher le panier

const URL_API = "http://localhost:3000/api";

async function chargerPanier() {
  try {
    const reponse = await fetch("http://localhost:3000/api/panier");
    if (!reponse.ok) throw new Error("Erreur API");

    const panier = await reponse.json();
    afficherQuantitePanier(panier);
    afficherDetailsPanier(panier);
  } catch (err) {
    console.error("Erreur panier :", err.message);
  }
}

// Affiche la quantité totale du panier
function afficherQuantitePanier(panier) {
  const produits = Array.isArray(panier.produits) ? panier.produits : [];
  const quantiteTotale = produits.reduce((total, item) => total + (item.quantite || 1), 0);
  const compteur = document.getElementById("quantite-panier");
  if (compteur) compteur.textContent = quantiteTotale;
}

// Affiche les détails du panier
async function afficherDetailsPanier(panier) {
  const liste = document.getElementById("panier-liste");
  if (!liste) return;
  liste.innerHTML = "";

  const reponseProduits = await fetch("http://localhost:3000/api/produits");
  const tousLesProduits = await reponseProduits.json();

  const produits = Array.isArray(panier.produits) ? panier.produits : [];
  let total = 0;

  produits.forEach((item) => {
    const livre = tousLesProduits.find((p) => p.id === item.idProduit);
    if (!livre) return;

    const totalProduit = (livre.prix * item.quantite).toFixed(2);
    total += parseFloat(totalProduit);

    const li = document.createElement("li");
    li.classList.add("ligne-panier");

  
 li.innerHTML = `
  <img src="${livre.image}" alt="${livre.titre}" style="width: 50px;" />
  <span style="flex:1;">${livre.titre}</span>
  <span>${totalProduit} $</span>
  <div class="actions-panier" data-id="${item.idProduit}">
    <span class="btn-moins" style="cursor:pointer;">−</span>
    <span>${item.quantite}</span>
    <span class="btn-plus" style="cursor:pointer;">+</span>
    <span class="btn-supprimer" style="cursor:pointer;">🗑️</span>
  </div>
`;

    liste.appendChild(li);
  });

  const totalLi = document.createElement("li");
  totalLi.innerHTML = `<strong>Total : ${total.toFixed(2)} $</strong>`;
  liste.appendChild(totalLi);
}



async function ajouterAuPanier(idProduit) {
  const res = await fetch(`${URL_API}/panier`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ idProduit: parseInt(idProduit), quantite: 1 })
  });
  const panier = await res.json();
  afficherQuantitePanier(panier);
  afficherDetailsPanier(panier);
}

async function augmenterQuantite(id) {
  const res = await fetch(`${URL_API}/panier/${id}`, { method: "POST" });
  const panier = await res.json();
  afficherQuantitePanier(panier);
  afficherDetailsPanier(panier);
}

async function diminuerQuantite(id) {
  const res = await fetch(`${URL_API}/panier/${id}`, { method: "PATCH" });
  const panier = await res.json();
  afficherQuantitePanier(panier);
  afficherDetailsPanier(panier);
}

async function supprimerProduit(id) {
  const res = await fetch(`${URL_API}/panier/${id}`, { method: "DELETE" });
  const panier = await res.json();
  afficherQuantitePanier(panier);
  afficherDetailsPanier(panier);
}

// Appliquer les filtres
function appliquerFiltres() {
  const recherche = document.getElementById("recherche")?.value.toLowerCase() || "";
  const categorie = document.getElementById("filtre-categorie")?.value || "";
  const prix = document.getElementById("filtre-prix")?.value || "";

  const produitsFiltres = tousLesProduits.filter((produit) => {
    const correspondTitre = produit.titre.toLowerCase().includes(recherche);
    const correspondCategorie = categorie ? produit.categorie === categorie : true;
    const correspondPrix = prix ? produit.prix <= parseFloat(prix) : true;
    return correspondTitre && correspondCategorie && correspondPrix;
  });

  afficherProduits(produitsFiltres);
}

// Initialisation au chargement de la page
document.addEventListener("DOMContentLoaded", () => {
  chargerProduits();
  chargerPanier();




  // Filtres
  document.getElementById("recherche")?.addEventListener("input", appliquerFiltres);
  document.getElementById("filtre-categorie")?.addEventListener("change", appliquerFiltres);
  document.getElementById("filtre-prix")?.addEventListener("change", appliquerFiltres);

  document.getElementById("form-ajout-produit").addEventListener("submit", async (e) => {
  e.preventDefault();

  const nouveauProduit = {
    titre: document.getElementById("titre").value,
    categorie: document.getElementById("categorie").value,
    prix: parseFloat(document.getElementById("prix").value),
    image: document.getElementById("image").value,
    description: document.getElementById("description").value
  };

  try {
    const reponse = await fetch(`${URL_API}/produits`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(nouveauProduit)
    });

    if (!reponse.ok) throw new Error("Erreur lors de l’ajout du produit");

    const produitAjoute = await reponse.json();
    alert("Produit ajouté !");
    console.log(produitAjoute);

    // Recharger les produits (optionnel)
    chargerProduits();

    // Réinitialiser le formulaire
    e.target.reset();

  } catch (err) {
    console.error("Erreur ajout produit :", err.message);
  }
});
 
 
  const panierListe = document.getElementById("panier-liste");
  if (panierListe) {
    panierListe.addEventListener("click", (e) => {
      const parent = e.target.closest(".actions-panier");
      if (!parent) return;
      const id = parent.dataset.id;

      if (e.target.classList.contains("btn-moins")) {
        diminuerQuantite(id);
      } else if (e.target.classList.contains("btn-plus")) {
        augmenterQuantite(id);
      } else if (e.target.classList.contains("btn-supprimer")) {
        supprimerProduit(id);
      }
    });
  }

  // gestion bouton "Ajouter au panier"
  document.body.addEventListener("click", (e) => {
    if (e.target.classList.contains("ajouter-panier")) {
      const id = e.target.dataset.id;
      ajouterAuPanier(id);
    }
  });

});
