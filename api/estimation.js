const PRIX_M2 = {
  "paris-1": { min: 9800, max: 16000, median: 12500 },
  "paris-2": { min: 9200, max: 15000, median: 11800 },
  "paris-3": { min: 9500, max: 15500, median: 12100 },
  "paris-4": { min: 10200, max: 16800, median: 13200 },
  "paris-5": { min: 9800, max: 16200, median: 12900 },
  "paris-6": { min: 11000, max: 18500, median: 14800 },
  "paris-7": { min: 11500, max: 19000, median: 15200 },
  "paris-8": { min: 9500, max: 16000, median: 12400 },
  "paris-9": { min: 8800, max: 14500, median: 11200 },
  "paris-10": { min: 7800, max: 13200, median: 10200 },
  "paris-11": { min: 7500, max: 13000, median: 9800 },
  "paris-12": { min: 7200, max: 12500, median: 9400 },
  "paris-13": { min: 6800, max: 12000, median: 8900 },
  "paris-14": { min: 7000, max: 12200, median: 9100 },
  "paris-15": { min: 7200, max: 12800, median: 9500 },
  "paris-16": { min: 8500, max: 15000, median: 11200 },
  "paris-17": { min: 7800, max: 13500, median: 10200 },
  "paris-18": { min: 6500, max: 11500, median: 8600 },
  "paris-19": { min: 5800, max: 10500, median: 7800 },
  "paris-20": { min: 6200, max: 11000, median: 8200 },
  "lyon-1": { min: 4200, max: 7800, median: 5800 },
  "lyon-2": { min: 4500, max: 8200, median: 6100 },
  "lyon-3": { min: 3800, max: 7000, median: 5200 },
  "lyon-6": { min: 5200, max: 9500, median: 7100 },
  "marseille-1": { min: 2100, max: 4500, median: 3100 },
  "marseille-8": { min: 3200, max: 6200, median: 4500 },
  "bordeaux": { min: 3800, max: 7500, median: 5200 },
  "nantes": { min: 3200, max: 6500, median: 4600 },
  "toulouse": { min: 2900, max: 5800, median: 4100 },
  "nice": { min: 4500, max: 9000, median: 6200 },
  "strasbourg": { min: 2800, max: 5500, median: 3900 },
  "montpellier": { min: 3100, max: 6200, median: 4400 },
  "rennes": { min: 3400, max: 6800, median: 4800 },
  "lille": { min: 2600, max: 5200, median: 3700 },
};

module.exports = (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Content-Type", "application/json");

// Auth gérée par RapidAPI

  const { ville, surface, type, etat } = req.query;
  if (!ville || !surface) {
    return res.status(400).json({
      error: "Paramètres 'ville' et 'surface' requis",
      exemple: "/api/estimation?ville=paris-11&surface=65&type=t2&etat=bon",
    });
  }

  const key = ville.toLowerCase().replace(/\s/g, "-");
  const data = PRIX_M2[key];
  if (!data) return res.status(404).json({ error: `Ville '${ville}' non trouvée` });

  const surf = parseFloat(surface);
  const coeff = etat === "neuf" ? 1.15 : etat === "renover" ? 0.82 : 1.0;
  const typeCoeff = type === "studio" ? 1.12 : type === "t4" ? 0.92 : 1.0;

  const prix_median = Math.round((data.median * surf * coeff * typeCoeff) / 1000) * 1000;
  const prix_bas = Math.round((data.min * surf * coeff * typeCoeff) / 1000) * 1000;
  const prix_haut = Math.round((data.max * surf * coeff * typeCoeff) / 1000) * 1000;

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
};
