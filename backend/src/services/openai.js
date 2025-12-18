import OpenAI from "openai";
import fs from "fs";
import path from "path";

const pdfPath = path.resolve("docs/Guide_Sante_Intelligent_ElevAI.pdf");

let pdfContent = "";
if (fs.existsSync(pdfPath)) {
  pdfContent = fs.readFileSync(pdfPath, "utf8");
}

export function getOpenAI() {
  if (!process.env.OPENAI_API_KEY) return null;

  return new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });
}

export function getHealthSystemPrompt() {
  return `
Tu es un coach santé.
Tu dois STRICTEMENT t'appuyer sur ce référentiel santé.

${pdfContent}

Ne fais aucun diagnostic médical.
Donne des conseils généraux, motivants et cohérents.
`;
}
