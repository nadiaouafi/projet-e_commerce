import { useEffect, useState } from "react";
import axios from "axios";

export default function Panier({ utilisateur }) {
  const [panier, setPanier] = useState({ produits: [] });

  useEffect(() => {
    if (utilisateur) {
      axios.get(`/api/panier/${utilisateur.id}`).then(res => setPanier(res.data));
    }
  }, [utilisateur]);

  const retirerProduit = async (idProduit) => {
    await axios.delete(`/api/panier/${utilisateur.id}/${idProduit}`);
    const maj = panier.produits.filter(p => p.id !== idProduit);
    setPanier({ ...panier, produits: maj });
  };

  const total = panier.produits.reduce((s, p) => s + (p.prix || 0), 0);

  return (
    <div>
      <h2>Mon Panier</h2>
      {panier.produits.map(p => (
        <div key={p.id}>
          {p.nom} - {p.prix}$
          <button onClick={() => retirerProduit(p.id)}>Retirer</button>
        </div>
      ))}
      <h3>Total : {total} $</h3>
    </div>
  );
}
