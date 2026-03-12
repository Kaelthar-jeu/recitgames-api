// generate-code.js — Générateur de codes Récit Games
// Lance avec : node generate-code.js
// Copie le code généré dans api/verify-code.js

function genererCode() {
  const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789'; // Sans I, O, 0, 1 pour éviter confusion
  let partie1 = '';
  let partie2 = '';
  for (let i = 0; i < 4; i++) partie1 += chars[Math.floor(Math.random() * chars.length)];
  for (let i = 0; i < 4; i++) partie2 += chars[Math.floor(Math.random() * chars.length)];
  return `RG-${partie1}-${partie2}`;
}

function dateExpiration(jours = 31) {
  const d = new Date();
  d.setDate(d.getDate() + jours);
  return d.toISOString().split('T')[0]; // Format YYYY-MM-DD
}

// Génère un code pour un nouvel abonné
const code = genererCode();
const expiration = dateExpiration(31); // 31 jours

console.log('\n=== NOUVEAU CODE RÉCIT GAMES ===');
console.log(`Code     : ${code}`);
console.log(`Expire le: ${expiration}`);
console.log('\nAjoute cette ligne dans api/verify-code.js :');
console.log(`  "${code}": "${expiration}",`);
console.log('\nEnvoie ce code à ton abonné par email.');
console.log('================================\n');
