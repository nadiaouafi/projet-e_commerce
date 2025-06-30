import { getutilisateurs, saveutilisateurs } from "../models/utilisateursRoutes.js";

export async function listerutilisateurs(req, res) {
  const utilisateurs = await getutilisateurs();
  res.json(utilisateurs);
}

export async function ajouterUtilisateur(req, res) {
  const utilisateurs = await getutilisateurs();
  const nouveau = { id: Date.now(), ...req.body };
  utilisateurs.push(nouveau);
  await saveutilisateurs(utilisateurs);
  res.status(201).json(nouveau);
}

export async function modifierUtilisateur(req, res) {
  const id = Number(req.params.id);
  const utilisateurs = await getutilisateurs();
  const index = utilisateurs.findIndex(p => p.id === id);
  if (index === -1) return res.status(404).json({ message: "utilisateur non trouvé" });

  utilisateurs[index] = { ...utilisateurs[index], ...req.body };
  await saveutilisateurs(utilisateurs);
  res.json(utilisateurs[index]);
}

export async function supprimerUtilisateur(req, res) {
  const id = Number(req.params.id);
  let utilisateurs = await getutilisateurs();
 utilisateurs = utilisateurs.filter(p => p.id !== id);
  await saveProduits(utilisateurs);
  res.json({ message: "utilisateur supprimé" });
}
