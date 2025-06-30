document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("#form-inscription");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const nom = form.nom.value.trim();
    const email = form.email.value.trim();
    const telephone = form.telephone.value.trim();
    const adresse = form.adresse.value.trim();
    const codePostal = form.code_postal.value.trim();
    const motdepasse = form.motdepasse.value;
    const confirmation = form.confirmation.value;

    const erreur = [];

    if (!nom || !email || !telephone || !adresse || !codePostal || !motdepasse || !confirmation) {
      erreur.push("Tous les champs sont obligatoires.");
    }

    if (!email.includes("@")) {
      erreur.push("Adresse courriel invalide.");
    }

    if (motdepasse !== confirmation) {
      erreur.push("Les mots de passe ne correspondent pas.");
    }

    if (erreur.length > 0) {
      alert(erreur.join("\n"));
      return;
    }

    // Créer un utilisateur
    const utilisateur = {
      nom,
      email,
      telephone,
      adresse,
      codePostal,
      motdepasse 
    };

    // Sauvegarder dans localStorage
    const utilisateurs = JSON.parse(localStorage.getItem("utilisateurs")) || [];
    utilisateurs.push(utilisateur);
    localStorage.setItem("utilisateurs", JSON.stringify(utilisateurs));

    alert("Inscription réussie !");
    form.reset();
  });
});
