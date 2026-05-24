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

module.exports = (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Content-Type", "application/json");

// Auth gérée par RapidAPI

  const { ville } = req.query;
  if (!ville) {
    return res.status(400).json({
      error: "Paramètre 'ville' manquant",
      exemple: "/api/prix-m2?ville=paris-11",
      villes_disponibles: Object.keys(PRIX_M2),
    });
  }

  const key = ville.toLowerCase().replace(/\s/g, "-");
  const data = PRIX_M2[key];
  if (!data) {
    return res.status(404).json({ error: `Ville '${ville}' non trouvée`, villes_disponibles: Object.keys(PRIX_M2) });
  }

  res.json({
    ville: key,
    prix_m2: { median: data.median, min: data.min, max: data.max, unite: "€/m²" },
    tendance_annuelle: data.trend,
    volume_transactions: data.volume,
    periode: "2025-2026",
    source: "DVF — data.gouv.fr",
    timestamp: new Date().toISOString(),
  });
};
