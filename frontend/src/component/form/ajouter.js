document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("#form-ajout");
  const erreur = document.querySelector("#message-erreur");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const titre = form.titre.value.trim();
    const prix = parseFloat(form.prix.value);
    const description = form.description.value.trim();
    const image = form.image.value.trim();

    if (!titre || !description || isNaN(prix) || prix <= 0 || !image.startsWith("http")) {
      erreur.textContent = "Veuillez remplir tous les champs correctement.";
      return;
    }

    erreur.textContent = "";


    // Exemple : création d'objet
    const nouveauLivre = {
      titre,
      prix,
      description,
      image
    };
    // Récupérer les livres existants dans le localStorage
    const livresExistants = JSON.parse(localStorage.getItem("livres")) || [];

      // Ajouter le nouveau livre
    livresExistants.push(nouveauLivre);
    
    localStorage.setItem("livres", JSON.stringify(livresExistants));

    alert("Livre ajouté avec succès !");

    console.log(nouveauLivre);

    // Réinitialiser le formulaire
    form.reset();
  });
});