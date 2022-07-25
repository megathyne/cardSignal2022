const VENDOR = require("./vendor");
const msrpLookup = require("./msrpLookup");

const SET_BB = "Set Booster Box";
const SET_BD = "Set Booster Display";
const DRAFT_BB = "Draft Booster Box";
const COLLECTOR_BB = "Collector Booster Box";
const COLLECTOR_BD = "Collector Booster Display";
const CLASSIC_BB = "Booster Box";
const boxTypes = [SET_BB, SET_BD, DRAFT_BB, CLASSIC_BB];

const AVG_PRICE_TYPE = "average";
const LOW_PRICE_TYPE = "low";
const MKT_PRICE_TYPE = "market";
const priceTypes = [AVG_PRICE_TYPE, LOW_PRICE_TYPE, MKT_PRICE_TYPE];

const inventory = [
  {
    name: "958-adventures-in-the-forgotten-realms-draft-booster-box",
    quantity: 3,
    date: "2022-05-16",
    paid: 263.97,
    source: VENDOR.AMAZON,
  },

  {
    name: "1949-innistrad-midnight-hunt-draft-booster-box",
    quantity: 1,
    date: "2021-11-10",
    paid: 112.04,
    source: VENDOR.AMAZON,
  },
  {
    name: "2020-innistrad-crimson-vow-draft-booster-box",
    quantity: 3,
    date: "2022-05-18",
    paid: 276.96,
    source: VENDOR.AMAZON,
  },
  {
    name: "2020-innistrad-crimson-vow-draft-booster-box",
    quantity: 3,
    date: "2022-06-03",
    paid: 258.16,
    source: VENDOR.EBAY_PFOOTBALLPETE4DHX,
  },

  {
    name: "2880-kamigawa-neon-dynasty-draft-booster-box",
    quantity: 1,
    date: "2022-04-21",
    paid: 111.86,
    source: VENDOR.AMAZON,
  },

  {
    name: "2883-kamigawa-neon-dynasty-set-booster-display",
    quantity: 2,
    date: "2022-05-26",
    paid: 212.64,
    source: VENDOR.EBAY_PFOOTBALLPETE4DHX,
  },

  {
    name: "2883-kamigawa-neon-dynasty-set-booster-display",
    quantity: 2,
    date: "2022-06-03",
    paid: 260.0,
    source: VENDOR.SUPER_SPORTS_CARDS,
  },
  {
    name: "599-zendikar-rising-draft-booster-box",
    quantity: 2,
    date: "2022-06-06",
    paid: 238.87,
    source: VENDOR.EBAY_CARDRUSHINC,
  },

  {
    name: "437-modern-horizons-2-draft-booster-box",
    quantity: 1,
    date: "2022-06-11",
    paid: 215.07,
    source: VENDOR.EBAY_CATACLYSMCOLLECTABLES,
  },

  {
    name: "512-throne-of-eldraine-booster-box",
    quantity: 3,
    date: "2022-06-11",
    paid: 439.9,
    source: VENDOR.EBAY_THEWASTELANDGAMING,
  },

  {
    name: "3193-streets-of-new-capenna-draft-booster-box",
    quantity: 2,
    date: "2022-06-11",
    paid: 167.65,
    source: VENDOR.EBAY_CACARDSHARK,
  },
  {
    name: "258-kaldheim-draft-booster-box",
    quantity: 2,
    date: "2022-06-10",
    paid: 205.28,
    source: VENDOR.EBAY_CATACLYSMCOLLECTABLES,
  },
  {
    name: "406-kaldheim-set-booster-display",
    quantity: 2,
    date: "2022-06-10",
    paid: 206.13,
    source: VENDOR.EBAY_PFOOTBALLPETE4DHX,
  },

  {
    name: "606-war-of-the-spark-booster-box",
    quantity: 2,
    date: "2022-06-08",
    paid: 358.46,
    source: VENDOR.EBAY_THEWASTELANDGAMING,
  },

  {
    name: "3169-commander-legends-battle-for-baldur-s-gate-set-booster-box",
    quantity: 3,
    date: "2022-06-07",
    paid: 311.18,
    source: VENDOR.EBAY_FLIPSIDEGAMING,
  },

  {
    name: "707-zendikar-rising-set-booster-display",
    quantity: 2,
    date: "2022-06-06",
    paid: 238.95,
    source: VENDOR.EBAY_THEWASTELANDGAMING,
  },
  {
    name: "496-strixhaven-school-of-mages-set-booster-display",
    quantity: 2,
    date: "2022-06-09",
    paid: 0.0,
    source: VENDOR.AMAZON_FREE,
  },

  {
    name: "3174-commander-legends-battle-for-baldur-s-gate-draft-booster-box",
    quantity: 3,
    date: "2022-06-17",
    paid: 297.98,
    source: VENDOR.EBAY_PFOOTBALLPETE4DHX,
  },

  {
    name: "3174-commander-legends-battle-for-baldur-s-gate-draft-booster-box",
    quantity: 1,
    date: "2022-06-18",
    paid: 130.0,
    source: VENDOR.SUPER_SPORTS_CARDS,
  },
  {
    name: "3174-commander-legends-battle-for-baldur-s-gate-draft-booster-box",
    quantity: 2,
    date: "2022-06-19",
    paid: 162.91,
    source: VENDOR.COLLECTOR_STORE,
  },

  {
    name: "3193-streets-of-new-capenna-draft-booster-box",
    quantity: 2,
    date: "2022-06-19",
    paid: 162.91,
    source: VENDOR.COLLECTOR_STORE,
  },

  {
    name: "3193-streets-of-new-capenna-draft-booster-box",
    quantity: 1,
    date: "2022-06-19",
    paid: 89.21,
    source: VENDOR.CARD_SHOP_LIVE,
  },

  {
    name: "661-strixhaven-school-of-mages-draft-booster-box",
    quantity: 1,
    date: "2022-06-19",
    paid: 92.21,
    source: VENDOR.CARD_SHOP_LIVE,
  },

  {
    name: "958-adventures-in-the-forgotten-realms-draft-booster-box",
    quantity: 1,
    date: "2022-06-19",
    paid: 95.21,
    source: VENDOR.CARD_SHOP_LIVE,
  },
  {
    name: "1949-innistrad-midnight-hunt-draft-booster-box",
    quantity: 1,
    date: "2022-06-19",
    paid: 87.21,
    source: VENDOR.CARD_SHOP_LIVE,
  },

  {
    name: "3405-double-masters-2022-draft-booster-box",
    quantity: 2,
    date: "2022-06-17",
    paid: 543.1,
    source: VENDOR.CARD_SHOP_LIVE,
  },
  {
    name: "3174-commander-legends-battle-for-baldur-s-gate-draft-booster-box",
    quantity: 3,
    date: "2022-06-15",
    paid: 238.04,
    source: VENDOR.STAR_CITY_GAMES,
  },

  {
    name: "2020-innistrad-crimson-vow-draft-booster-box",
    quantity: 2,
    date: "2022-06-21",
    paid: 137.39,
    source: VENDOR.STAR_CITY_GAMES,
  },
  {
    name: "3193-streets-of-new-capenna-draft-booster-box",
    quantity: 2,
    date: "2022-06-21",
    paid: 147.39,
    source: VENDOR.STAR_CITY_GAMES,
  },
  {
    name: "2020-innistrad-crimson-vow-draft-booster-box",
    quantity: 3,
    date: "2022-06-23",
    paid: 203.45,
    source: VENDOR.STAR_CITY_GAMES,
  },

  {
    name: "3193-streets-of-new-capenna-draft-booster-box",
    quantity: 3,
    date: "2022-06-23",
    paid: 218.45,
    source: VENDOR.STAR_CITY_GAMES,
  },

  {
    name: "73-commander-legends-draft-booster-box",
    quantity: 1,
    date: "2022-06-28",
    paid: 122.55,
    source: VENDOR.STAR_CITY_GAMES,
  },
  {
    name: "1949-innistrad-midnight-hunt-draft-booster-box",
    quantity: 1,
    date: "2022-06-28",
    paid: 92.55,
    source: VENDOR.STAR_CITY_GAMES,
  },
  {
    name: "258-kaldheim-draft-booster-box",
    quantity: 1,
    date: "2022-06-28",
    paid: 97.55,
    source: VENDOR.STAR_CITY_GAMES,
  },

  {
    name: "2880-kamigawa-neon-dynasty-draft-booster-box",
    date: "2022-06-28",
    quantity: 1,
    paid: 102.55,
    source: VENDOR.STAR_CITY_GAMES,
  },

  {
    name: "661-strixhaven-school-of-mages-draft-booster-box",
    date: "2022-06-28",
    quantity: 2,
    paid: 175.1,
    source: VENDOR.STAR_CITY_GAMES,
  },
  {
    name: "599-zendikar-rising-draft-booster-box",
    quantity: 1,
    date: "2022-06-28",
    paid: 87.55,
    source: VENDOR.STAR_CITY_GAMES,
  },

  {
    name: "521-theros-beyond-death-booster-box",
    quantity: 1,
    date: "2022-06-29",
    paid: 120.0,
    source: VENDOR.SUPER_SPORTS_CARDS,
  },
  {
    name: "958-adventures-in-the-forgotten-realms-draft-booster-box",
    quantity: 1,
    date: "2022-07-01",
    paid: 99.92,
    source: VENDOR.SMOKE_AND_MIRRORS,
  },

  {
    name: "1949-innistrad-midnight-hunt-draft-booster-box",
    quantity: 1,
    date: "2022-07-01",
    paid: 93.41,
    source: VENDOR.SMOKE_AND_MIRRORS,
  },
  {
    name: "521-theros-beyond-death-booster-box",
    quantity: 1,
    date: "2022-07-01",
    paid: 119.48,
    source: VENDOR.SMOKE_AND_MIRRORS,
  },

  {
    name: "437-modern-horizons-2-draft-booster-box",
    quantity: 1,
    date: "2022-07-01",
    paid: 206.38,
    source: VENDOR.SMOKE_AND_MIRRORS,
  },
  {
    name: "2880-kamigawa-neon-dynasty-draft-booster-box",
    quantity: 1,
    date: "2022-07-01",
    paid: 97.75,
    source: VENDOR.SMOKE_AND_MIRRORS,
  },
  {
    name: "3169-commander-legends-battle-for-baldur-s-gate-set-booster-box",
    quantity: 1,
    date: "2022-07-09",
    paid: 86.89,
    source: VENDOR.SMOKE_AND_MIRRORS,
  },

  {
    name: "521-theros-beyond-death-booster-box",
    quantity: 1,
    date: "2022-07-09",
    paid: 119.48,
    source: VENDOR.SMOKE_AND_MIRRORS,
  },
  {
    name: "3169-commander-legends-battle-for-baldur-s-gate-set-booster-box",
    quantity: 1,
    date: "2022-07-09",
    paid: 119.0,
    source: VENDOR.SUPER_SPORTS_CARDS,
  },

  {
    name: "958-adventures-in-the-forgotten-realms-draft-booster-box",
    quantity: 1,
    date: "2022-07-14",
    paid: 117.28,
    source: VENDOR.TIME_WARP_COMICS_AND_GAMES,
  },
  {
    name: "3169-commander-legends-battle-for-baldur-s-gate-set-booster-box",
    quantity: 1,
    date: "2022-07-14",
    paid: 106.61,
    source: VENDOR.TIME_WARP_COMICS_AND_GAMES,
  },

  {
    name: "1949-innistrad-midnight-hunt-draft-booster-box",
    quantity: 4,
    date: "2022-07-19",
    paid: 277.24,
    source: VENDOR.STAR_CITY_GAMES,
  },
  {
    name: "2880-kamigawa-neon-dynasty-draft-booster-box",
    quantity: 2,
    date: "2022-07-19",
    paid: 195.62,
    source: VENDOR.STAR_CITY_GAMES,
  },
  {
    name: "2880-kamigawa-neon-dynasty-draft-booster-box",
    quantity: 6,
    date: "2022-07-24",
    paid: 520.0,
    source: VENDOR.FORTUNA_GAMES,
  },
  {
    name: "2880-kamigawa-neon-dynasty-draft-booster-box",
    quantity: 1,
    date: "2022-07-25",
    paid: 86.67,
    source: VENDOR.FORTUNA_GAMES,
  },
  {
    name: "606-war-of-the-spark-booster-box",
    quantity: 4,
    date: "2022-07-25",
    paid: 582.67,
    source: VENDOR.FORTUNA_GAMES,
  },
  {
    name: "3169-commander-legends-battle-for-baldur-s-gate-set-booster-box",
    quantity: 1,
    date: "2022-07-25",
    paid: 76.67,
    source: VENDOR.FORTUNA_GAMES,
  },
];

module.exports = { boxTypes, priceTypes, msrpLookup, inventory, VENDOR };
