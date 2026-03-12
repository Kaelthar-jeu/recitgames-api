// api/verify-code.js — Serveur central Récit Games
// Vérifie si un code d'abonnement est valide et non expiré

export const config = { runtime: 'edge' };

// ============================================================
// LISTE DES CODES ACTIFS
// Format : CODE : date d'expiration (YYYY-MM-DD)
// Pour ajouter un abonné : ajoute une ligne ici et redéploie
// Pour désactiver : supprime la ligne ou change la date
// ============================================================
const CODES = {
  // Exemple — remplace par tes vrais codes
  // "RG-XXXX-XXXX": "2026-04-12",
};

export default async function handler(req) {
  // CORS — autorise tous les domaines Récit Games
  const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
  };

  // Réponse aux requêtes OPTIONS (preflight CORS)
  if (req.method === 'OPTIONS') {
    return new Response(null, { status: 200, headers });
  }

  if (req.method !== 'POST') {
    return new Response(JSON.stringify({ valide: false, message: 'Méthode non autorisée' }), { status: 405, headers });
  }

  let body;
  try {
    body = await req.json();
  } catch {
    return new Response(JSON.stringify({ valide: false, message: 'Corps de requête invalide' }), { status: 400, headers });
  }

  const code = (body.code || '').trim().toUpperCase();

  if (!code) {
    return new Response(JSON.stringify({ valide: false, message: 'Code manquant' }), { status: 400, headers });
  }

  // Vérifie si le code existe
  if (!CODES[code]) {
    return new Response(JSON.stringify({ valide: false, message: 'Code invalide' }), { status: 200, headers });
  }

  // Vérifie si le code n'est pas expiré
  const expiration = new Date(CODES[code]);
  const aujourd_hui = new Date();
  aujourd_hui.setHours(0, 0, 0, 0);

  if (aujourd_hui > expiration) {
    return new Response(JSON.stringify({
      valide: false,
      message: 'Abonnement expiré',
      expire_le: CODES[code]
    }), { status: 200, headers });
  }

  // Code valide
  const jours_restants = Math.ceil((expiration - aujourd_hui) / (1000 * 60 * 60 * 24));

  return new Response(JSON.stringify({
    valide: true,
    message: 'Abonnement actif',
    expire_le: CODES[code],
    jours_restants
  }), { status: 200, headers });
}
