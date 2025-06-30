document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("#form-connexion");

  form.addEventListener("submit", (e) => {
    e.preventDefault();

    const email = form.email.value.trim();
    const motdepasse = form.motdepasse.value;

    // Vérifie si les champs sont remplis
    if (!email || !motdepasse) {
      alert("Veuillez remplir tous les champs.");
      return;
    }

    // Récupère les utilisateurs stockés
    const utilisateurs = JSON.parse(localStorage.getItem("utilisateurs")) || [];

    // Recherche de l'utilisateur
    const utilisateurTrouve = utilisateurs.find(
      (utilisateur) => utilisateur.email === email && utilisateur.motdepasse === motdepasse
    );

    if (utilisateurTrouve) {
      alert("Connexion réussie !");
      // Redirection ou action après connexion ici :
      window.location.href = "/index.html";
    } else {
      alert("Identifiants invalides.");
    }
  });
});