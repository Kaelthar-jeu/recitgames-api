export default function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { code } = req.body;
  if (!code) return res.status(400).json({ error: 'Code manquant' });

  const codeNormalise = code.trim().toUpperCase();

  // Code admin — accès illimité sans paywall
  const ADMIN_CODE = 'RG-ADMIN-2026';
  if (codeNormalise === ADMIN_CODE) {
    return res.status(200).json({ valid: true, admin: true });
  }

  // Codes abonnés valides
  const CODES_VALIDES = [
    'RG-TEST-0001',
    'RG-TEST-0002',
    'RG-TEST-0003',
    'RG-TEST-0004',
    'RG-TEST-0005',
  ];

  if (CODES_VALIDES.includes(codeNormalise)) {
    return res.status(200).json({ valid: true, admin: false });
  }

  return res.status(200).json({ valid: false });
}
