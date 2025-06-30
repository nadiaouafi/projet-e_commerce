const produitsParPage = 4;
let pageCourante = 1;

const rechercheInput = document.querySelector("recherche");
const filtreCategorie = document.querySelector("filtre-categorie");
const filtrePrix = document.querySelector("filtre-prix");
const produitsContainer = document.querySelector("produits");
const prevBtn = document.querySelector("prev-page");
const nextBtn = document.querySelector("next-page");
const pageInfo = document.querySelector("page-info");

function filtrerProduits() {
  const texteRecherche = rechercheInput.value.toLowerCase();
  const categorieChoisie = filtreCategorie.value;
  const prixMax = filtrePrix.value ? Number(filtrePrix.value) : Infinity;

  return produits.filter(p => {
    const titreMatch = p.titre.toLowerCase().includes(texteRecherche);
    const auteurMatch = p.auteur ? p.auteur.toLowerCase().includes(texteRecherche) : false;
    const matchRecherche = titreMatch || auteurMatch;
    const matchCategorie = !categorieChoisie || p.categorie === categorieChoisie;
    const matchPrix = p.prix <= prixMax;
    return matchRecherche && matchCategorie && matchPrix;
  });
}

function afficherProduits() {
  const produitsFiltres = filtrerProduits();
  const totalPages = Math.ceil(produitsFiltres.length / produitsParPage);

  if(pageCourante > totalPages) pageCourante = totalPages || 1;

  const debut = (pageCourante - 1) * produitsParPage;
  const fin = debut + produitsParPage;
  const produitsAafficher = produitsFiltres.slice(debut, fin);

  produitsContainer.innerHTML = "";

  if(produitsAafficher.length === 0){
    produitsContainer.innerHTML = "<p>Aucun produit trouvé.</p>";
  } else {
    produitsAafficher.forEach(p => {
      const div = document.createElement("div");
      div.className = "produit";
      div.innerHTML = `
        <img src="${p.image}" alt="Couverture de ${p.titre}" style="width:100%; height:auto; border-radius:4px; margin-bottom:8px;" />
        <h3>${p.titre}</h3>
        <p><em>${p.auteur ? p.auteur : "Auteur inconnu"}</em></p>
        <p>Catégorie : ${p.categorie ? p.categorie : "Non spécifiée"}</p>
        <p>Prix : ${p.prix} €</p>
        ${p.description ? `<p style="font-size:0.9rem; color:#555;">${p.description}</p>` : ""}
      `;
      produitsContainer.appendChild(div);
    });
  }

  pageInfo.textContent = `Page ${pageCourante} / ${totalPages || 1}`;
  prevBtn.disabled = pageCourante <= 1;
  nextBtn.disabled = pageCourante >= totalPages;
}

rechercheInput.addEventListener("input", () => {
  pageCourante = 1;
  afficherProduits();
});
filtreCategorie.addEventListener("change", () => {
  pageCourante = 1;
  afficherProduits();
});
filtrePrix.addEventListener("change", () => {
  pageCourante = 1;
  afficherProduits();
});
prevBtn.addEventListener("click", () => {
  if(pageCourante > 1){
    pageCourante--;
    afficherProduits();
  }
});
nextBtn.addEventListener("click", () => {
  const produitsFiltres = filtrerProduits();
  const totalPages = Math.ceil(produitsFiltres.length / produitsParPage);
  if(pageCourante < totalPages){
    pageCourante++;
    afficherProduits();
  }
});


afficherProduits();