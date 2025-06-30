import { readFile, writeFile } from "fs/promises";
import { join } from "path";

const filePath = join(process.cwd(), "backend", "data", "produits.json");

export async function getProduits() {
  const data = await readFile(filePath, "utf-8");
  return JSON.parse(data);
}

export async function saveProduits(produits) {
  await writeFile(filePath, JSON.stringify(produits, null, 2));
}
