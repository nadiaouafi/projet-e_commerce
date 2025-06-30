import { readFile, writeFile } from "fs/promises";
import { join } from "path";

const filePath = join(process.cwd(), "backend", "data", "utilisateurs.json");

export async function getUtilisateurs() {
  const data = await readFile(filePath, "utf-8");
  return JSON.parse(data);
}

export async function saveUtilisateurs(utilisateurs) {
  await writeFile(filePath, JSON.stringify(produits, null, 2));
}
