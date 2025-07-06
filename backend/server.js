import express from "express";
import cors from "cors";
import morgan from "morgan"; 
import produitsRoutes from "./routes/produitsRoutes.js"; 
import utilisateursRoutes from "./routes/utilisateursRoutes.js";

const app = express();
const PORT = 3000;

app.use(cors());
app.use(morgan("dev")); 
app.use(express.json());

app.use("/api/produits", produitsRoutes);
app.use("/api/utilisateurs", utilisateursRoutes);

app.get("/", (req, res) => {
  res.send("Coucou!");
});

app.listen(PORT, () => {
  console.log(` Serveur sur http://localhost:${PORT}`);
});