const RENTABILITE = {
  "studio": { rendement_brut: 5.8, charges_pct: 28, vacance_jours: 18 },
  "t2": { rendement_brut: 4.9, charges_pct: 30, vacance_jours: 22 },
  "t3": { rendement_brut: 4.2, charges_pct: 32, vacance_jours: 26 },
  "maison": { rendement_brut: 3.8, charges_pct: 35, vacance_jours: 30 },
};

module.exports = (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Content-Type", "application/json");

  const apiKey = req.headers["x-api-key"] || req.query.api_key;
  if (!apiKey) return res.status(401).json({ error: "Clé API manquante" });

  const { prix, loyer, type } = req.query;
  if (!prix || !loyer) {
    return res.status(400).json({
      error: "Paramètres 'prix' et 'loyer' requis",
      exemple: "/api/rentabilite?prix=300000&loyer=1200&type=t2",
    });
  }

  const p = parseFloat(prix);
  const l = parseFloat(loyer);
  const ref = RENTABILITE[type || "t2"];

  const rendement_brut = ((l * 12) / p * 100).toFixed(2);
  const charges_annuelles = Math.round(l * 12 * (ref.charges_pct / 100));
  const rendement_net = (((l * 12 - charges_annuelles) / p) * 100).toFixed(2);
  const cashflow_mensuel = Math.round(l - charges_annuelles / 12);
  const vacance_estimee = Math.round(l * (ref.vacance_jours / 365));

  res.json({
    rentabilite: {
      rendement_brut: `${rendement_brut}%`,
      rendement_net: `${rendement_net}%`,
      cashflow_mensuel_estime: `${cashflow_mensuel} €`,
      vacance_locative_estimee: `${vacance_estimee} €/an`,
    },
    charges_estimees: {
      total_annuel: `${charges_annuelles} €`,
      detail: "Taxe foncière, charges copro, assurance, gestion, entretien",
    },
    benchmark_marche: {
      rendement_brut_moyen_type: `${ref.rendement_brut}%`,
      evaluation: parseFloat(rendement_brut) >= ref.rendement_brut ? "✅ Au-dessus du marché" : "⚠️ En-dessous du marché",
    },
    timestamp: new Date().toISOString(),
  });
};
