// https://api.mtgstocks.com/sealed
interface Sealed {
  id: number; // 817
  name: string; // "Double Masters 2022"
  slug: string; // "817-double-masters-2022"
  abbreviation: string; // "2X2"
  date: number; // 1657238400000
  icon_class: string; // "ss-2x2"
  products: {
    id: number; // 3400
    name: string; // "Draft Booster Box Case"
    slug: string; // "3400-double-masters-2022-draft-booster-box-case"
    latestPrice: {
      average: number; // 1699,
      market: number; // 1734
    };
  }[];
}

// https://api.mtgstocks.com/sealed/3193 product.id
interface ProductDetails {
  id: number; // 3193
  name: string; // "Draft Booster Box"
  slug: string; // "3193-streets-of-new-capenna-draft-booster-box"
  image: string; // "https://static.mtgstocks.com/sealedimage/t3193.png"
  tcgUrl: string; // "https://www.tcgplayer.com/product/264760/magic-streets-of-new-capenna-streets-of-new-capenna-draft-booster-box"
  allTimeHigh: {
    average: number; // 109.95,
    date: number; // 1650758400000
  };
  allTimeLow: {
    average: number; // 100.89,
    date: number; // 1652918400000
  };
  latestPrice: {
    low: number; // 78,
    average: number; // 103.84,
    high: number; // 157.54,
    market: number; // 84.92
  };
  cardkingdom: {
    priceRetail: number; // 99.99
    url: string; // "https://www.cardkingdom.com/mtg-sealed/streets-of-new-capenna-draft-booster-box?partner=mtgstocks&utm_source=mtgstocks&utm_medium=affiliate&utm_campaign=mtgstocks&partner_args=sealed_3193"
  };
  differences: {
    lastMonth: {
      average: number; // -3.9,
      market: number; // -13.6
    };
    lastWeek: {
      average: number; // 1.8,
      market: number; // 1.1
    };
    yesterday: {
      average: number; // 0.9,
      market: number; // 0
    };
  };
  set: {
    id: number; // 811
    name: string; // "Streets Of New Capenna"
    slug: string; // "811-streets-of-new-capenna"
    abbreviation: string; // "SNC"
    icon_class: string; // "ss-snc"
  };
}

// https://api.mtgstocks.com/sealed/3193/prices product.id
interface Prices {
  average: [number, number][]; // [[1651190400000, 3.23]],
  high: [number, number][]; // [[1651190400000, 3.23]],
  low: [number, number][]; // [[1651190400000, 3.23]],
  market: [number, number][]; // [[1651190400000, 3.23]],
}

// https://api.mtgstocks.com/card_sets/811/ev  811=Sealed.id
interface ExpectedValue {
  avg: [number, number][]; // [[1651190400000, 3.23]],
  booster_supplement: {
    low: number; // 0,
    avg: number; // 0,
    high: number; // 0,
    market: number; // 0
  };
  boosterbox_supplement: {
    avg: number; // 0,
    market: number; // 0
  };
  card_set: {
    id: number; // 811
    name: number; // "Streets Of New Capenna"
    slug: number; // "811-streets-of-new-capenna"
    abbreviation: number; // "SNC"
    icon_class: number; //"ss-snc"
    set_type: number; // "expansion"
    date: number; // 1651190400000
    ev: boolean; // true
    ev_desc: null; // null
    hasEv: boolean; // true
    hasSealed: boolean; // true
  };
  high: [number, number][]; // [[1651190400000, 3.23]],
  low: [number, number][]; // [[1651190400000, 3.23]],
  market: [number, number][]; // [[1651190400000, 3.23]],
  price_hash: {
    C: {
      avg: {
        low: string; // "0.03",
        avg: string; // "0.18",
        high: string; // "109.61",
        market: string; // "0.07"
      };
      sum: {
        low: string; // "3.29",
        avg: string; // "21.64",
        high: string; // "13262.74",
        market: string; // "7.94"
      };
    };
    M: {
      avg: {
        low: string; // "3.85",
        avg: string; // "6.07",
        high: string; // "620.18",
        market: string; // "5.11"
      };
      sum: {
        low: string; // "80.88",
        avg: string; // "127.39",
        high: string; // "13023.77",
        market: string; // "107.3"
      };
    };
    R: {
      avg: {
        low: string; // "80.88",
        avg: string; // "127.39",
        high: string; // "13023.77",
        market: string; // "107.3"
      };
      sum: {
        low: string; // "80.88",
        avg: string; // "127.39",
        high: string; // "13023.77",
        market: string; // "107.3"
      };
    };
    U: {
      avg: {
        low: string; // "80.88",
        avg: string; // "127.39",
        high: string; // "13023.77",
        market: string; // "107.3"
      };
      sum: {
        low: string; // "80.88",
        avg: string; // "127.39",
        high: string; // "13023.77",
        market: string; // "107.3"
      };
    };
    booster: {
      low: string; // "80.88",
      avg: string; // "127.39",
      high: string; // "13023.77",
      market: string; // "107.3"
      num: number; // 36
    };
  };
  product_supplement: {};
}
