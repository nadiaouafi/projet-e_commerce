import express from "express";
import cors from "cors";
import morgan from "morgan"; 
import session from "express-session";
import produitsRoutes from "./routes/produitsRoutes.js"; 
import utilisateursRoutes from "./routes/utilisateursRoutes.js";
import panierRoutes from "./routes/panierRoutes.js";
import achatsRoutes from "./routes/achatsRoutes.js";
import authRoutes from "./routes/authRoutes.js";


const app = express();
const PORT = 3000;

app.use(cors());
app.use(morgan("dev")); 
app.use(express.json());

app.use("/api/produits", produitsRoutes);
app.use("/api/utilisateurs", utilisateursRoutes);
app.use("/api/panier", panierRoutes);
app.use("/api/achats", achatsRoutes);
app.use("/api/auth", authRoutes);


app.use(session({
  secret: "super-secret",         
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }      
}));
app.get("/", (req, res) => {
  res.send("bienvenue dans mon applications");
});

app.listen(PORT, () => {
  console.log(` Serveur sur http://localhost:${PORT}`);
});