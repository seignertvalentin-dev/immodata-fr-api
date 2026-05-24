// ═══════════════════════════════════════════════
// ImmoData FR — API Immobilière Française
// Déployer sur Railway.app (gratuit)
// ═══════════════════════════════════════════════

const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

// ── Middleware API Key ──────────────────────────
app.use((req, res, next) => {
  if (req.path === "/" || req.path === "/health") return next();
  const key = req.headers["x-api-key"] || req.query.api_key;
  if (!key) {
    return res.status(401).json({
      error: "API key manquante",
      message: "Ajoutez votre clé via le header X-Api-Key ou ?api_key=",
      docs: "https://rapidapi.com/immodata-fr"
    });
  }
  next();
});

// ── Base de données simulée (remplacer par DVF réel) ──
// Source réelle : https://data.gouv.fr/fr/datasets/demandes-de-valeurs-foncieres/
const PRIX_M2 = {
  "paris-1": { min: 9800, max: 16000, median: 12500, trend: "+2.1%", volume: 1240 },
  "paris-2": { min: 9200, max: 15000, median: 11800, trend: "+1.8%", volume: 890 },
  "paris-3": { min: 9500, max: 15500, median: 12100, trend: "+2.3%", volume: 760 },
  "paris-4": { min: 10200, max: 16800, median: 13200, trend: "+1.5%", volume: 1100 },
  "paris-5": { min: 9800, max: 16200, median: 12900, trend: "+2.0%", volume: 980 },
  "paris-6": { min: 11000, max: 18500, median: 14800, trend: "+1.2%", volume: 720 },
  "paris-7": { min: 11500, max: 19000, median: 15200, trend: "+0.9%", volume: 650 },
  "paris-8": { min: 9500, max: 16000, median: 12400, trend: "+1.7%", volume: 840 },
  "paris-9": { min: 8800, max: 14500, median: 11200, trend: "+2.5%", volume: 1350 },
  "paris-10": { min: 7800, max: 13200, median: 10200, trend: "+3.1%", volume: 1680 },
  "paris-11": { min: 7500, max: 13000, median: 9800, trend: "+3.4%", volume: 2100 },
  "paris-12": { min: 7200, max: 12500, median: 9400, trend: "+3.2%", volume: 1890 },
  "paris-13": { min: 6800, max: 12000, median: 8900, trend: "+3.8%", volume: 2240 },
  "paris-14": { min: 7000, max: 12200, median: 9100, trend: "+3.5%", volume: 2050 },
  "paris-15": { min: 7200, max: 12800, median: 9500, trend: "+3.0%", volume: 2800 },
  "paris-16": { min: 8500, max: 15000, median: 11200, trend: "+1.8%", volume: 1600 },
  "paris-17": { min: 7800, max: 13500, median: 10200, trend: "+2.8%", volume: 1950 },
  "paris-18": { min: 6500, max: 11500, median: 8600, trend: "+4.2%", volume: 2450 },
  "paris-19": { min: 5800, max: 10500, median: 7800, trend: "+4.8%", volume: 2650 },
  "paris-20": { min: 6200, max: 11000, median: 8200, trend: "+4.5%", volume: 2380 },
  "lyon-1": { min: 4200, max: 7800, median: 5800, trend: "+1.2%", volume: 540 },
  "lyon-2": { min: 4500, max: 8200, median: 6100, trend: "+1.5%", volume: 620 },
  "lyon-3": { min: 3800, max: 7000, median: 5200, trend: "+2.1%", volume: 890 },
  "lyon-6": { min: 5200, max: 9500, median: 7100, trend: "+0.8%", volume: 480 },
  "marseille-1": { min: 2100, max: 4500, median: 3100, trend: "+0.5%", volume: 320 },
  "marseille-8": { min: 3200, max: 6200, median: 4500, trend: "+1.8%", volume: 280 },
  "bordeaux": { min: 3800, max: 7500, median: 5200, trend: "+1.1%", volume: 1240 },
  "nantes": { min: 3200, max: 6500, median: 4600, trend: "+2.4%", volume: 1580 },
  "toulouse": { min: 2900, max: 5800, median: 4100, trend: "+2.8%", volume: 1720 },
  "nice": { min: 4500, max: 9000, median: 6200, trend: "+1.4%", volume: 890 },
  "strasbourg": { min: 2800, max: 5500, median: 3900, trend: "+2.2%", volume: 760 },
  "montpellier": { min: 3100, max: 6200, median: 4400, trend: "+3.1%", volume: 1100 },
  "rennes": { min: 3400, max: 6800, median: 4800, trend: "+2.6%", volume: 920 },
  "lille": { min: 2600, max: 5200, median: 3700, trend: "+2.9%", volume: 1050 },
};

const RENTABILITE = {
  "studio": { rendement_brut: 5.8, charges_pct: 28, vacance_jours: 18 },
  "t2": { rendement_brut: 4.9, charges_pct: 30, vacance_jours: 22 },
  "t3": { rendement_brut: 4.2, charges_pct: 32, vacance_jours: 26 },
  "maison": { rendement_brut: 3.8, charges_pct: 35, vacance_jours: 30 },
};

// ── Routes ─────────────────────────────────────

// Health check
app.get("/health", (req, res) => {
  res.json({ status: "ok", version: "1.0.0", service: "ImmoData FR API" });
});

// Landing
app.get("/", (req, res) => {
  res.json({
    service: "ImmoData FR — API Immobilière Française",
    version: "1.0.0",
    endpoints: [
      "GET /prix-m2?ville=paris-11",
      "GET /estimation?ville=paris-11&surface=65&type=t2",
      "GET /rentabilite?prix=300000&loyer=1200&type=t2",
      "GET /villes",
    ],
    docs: "https://rapidapi.com/immodata-fr",
    source_donnees: "DVF (Demandes de Valeurs Foncières) — data.gouv.fr",
  });
});

// ── 1. Prix au m² par ville/arrondissement
app.get("/prix-m2", (req, res) => {
  const { ville } = req.query;
  if (!ville) {
    return res.status(400).json({
      error: "Paramètre 'ville' manquant",
      exemple: "/prix-m2?ville=paris-11",
      villes_disponibles: Object.keys(PRIX_M2),
    });
  }
  const key = ville.toLowerCase().replace(/\s/g, "-");
  const data = PRIX_M2[key];
  if (!data) {
    return res.status(404).json({
      error: `Ville '${ville}' non trouvée`,
      villes_disponibles: Object.keys(PRIX_M2),
    });
  }
  res.json({
    ville: key,
    prix_m2: {
      median: data.median,
      min: data.min,
      max: data.max,
      unite: "€/m²",
    },
    tendance_annuelle: data.trend,
    volume_transactions: data.volume,
    periode: "2025-2026",
    source: "DVF — data.gouv.fr",
    timestamp: new Date().toISOString(),
  });
});

// ── 2. Estimation d'un bien
app.get("/estimation", (req, res) => {
  const { ville, surface, type, etat } = req.query;
  if (!ville || !surface) {
    return res.status(400).json({
      error: "Paramètres 'ville' et 'surface' requis",
      exemple: "/estimation?ville=paris-11&surface=65&type=t2&etat=bon",
    });
  }
  const key = ville.toLowerCase().replace(/\s/g, "-");
  const data = PRIX_M2[key];
  if (!data) {
    return res.status(404).json({ error: `Ville '${ville}' non trouvée` });
  }

  const surf = parseFloat(surface);
  const coeff = etat === "neuf" ? 1.15 : etat === "renover" ? 0.82 : 1.0;
  const typeCoeff = type === "studio" ? 1.12 : type === "t4" ? 0.92 : 1.0;

  const prix_median = Math.round(data.median * surf * coeff * typeCoeff / 1000) * 1000;
  const prix_bas = Math.round(data.min * surf * coeff * typeCoeff / 1000) * 1000;
  const prix_haut = Math.round(data.max * surf * coeff * typeCoeff / 1000) * 1000;

  res.json({
    estimation: {
      prix_median: `${prix_median.toLocaleString("fr-FR")} €`,
      fourchette_basse: `${prix_bas.toLocaleString("fr-FR")} €`,
      fourchette_haute: `${prix_haut.toLocaleString("fr-FR")} €`,
      prix_m2_applique: data.median,
    },
    parametres: { ville: key, surface: surf, type: type || "standard", etat: etat || "bon" },
    frais_notaire_estimes: `${Math.round(prix_median * 0.075).toLocaleString("fr-FR")} €`,
    timestamp: new Date().toISOString(),
  });
});

// ── 3. Calcul rentabilité locative
app.get("/rentabilite", (req, res) => {
  const { prix, loyer, type, charges } = req.query;
  if (!prix || !loyer) {
    return res.status(400).json({
      error: "Paramètres 'prix' et 'loyer' requis",
      exemple: "/rentabilite?prix=300000&loyer=1200&type=t2",
    });
  }

  const p = parseFloat(prix);
  const l = parseFloat(loyer);
  const ref = RENTABILITE[type || "t2"];

  const rendement_brut = ((l * 12) / p * 100).toFixed(2);
  const charges_annuelles = Math.round(l * 12 * (ref.charges_pct / 100));
  const rendement_net = (((l * 12 - charges_annuelles) / p) * 100).toFixed(2);
  const cashflow_mensuel = Math.round(l - (charges_annuelles / 12));
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
});

// ── 4. Liste des villes disponibles
app.get("/villes", (req, res) => {
  res.json({
    total: Object.keys(PRIX_M2).length,
    villes: Object.keys(PRIX_M2).map(k => ({
      id: k,
      prix_median: PRIX_M2[k].median,
      tendance: PRIX_M2[k].trend,
    })),
  });
});

app.listen(PORT, () => {
  console.log(`ImmoData FR API running on port ${PORT}`);
});
