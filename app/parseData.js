const { MtgData, Product } = require("./src/lib");
const { boxTypes, msrpLookup, priceTypes } = require("./src/constants");

async function processData() {
  let newLookup = {};
  const today = "2022-06-21";
  const mtgData = new MtgData(today);
  const masterProducts = (await mtgData.getMasterProducts()).data;


  for (const set of masterProducts) {
    const products = set.products.filter((item) => boxTypes.includes(item.name));

    for (const productRaw of products) {
      const product = new Product(today, set, productRaw);
      await product.init();
      newLookup[productRaw.slug] = product;
    }
  }

  return newLookup;
}

async function getLastPricesTotal(data, yearFilter, daysBack, setFilter) {
  const dateMapping = { 0: 0, 15: 1, 30: 2, 60: 3, 90: 4, 120: 5 };

  const lastPriceContainer = [];
  for (const product in data) {
    if (setFilter.includes(data[product].product.slug)) {
      if (new Date(data[product].set.date).getFullYear() >= yearFilter) {
        const lastPrice = data[product].analyticPrices[dateMapping[daysBack]];
        if (lastPrice) lastPriceContainer.push(lastPrice);
      }
    }
  }
  const lastPriceTotal = lastPriceContainer.reduce((p, c) => (p += c[1]), 0);
  return { total: lastPriceTotal.toFixed(2), count: lastPriceContainer.length };
}

async function getSetTotalGain(data, filter) {
  const output = [];
  for (const slug of filter) {
    const release = msrpLookup[slug];
    const current = data[slug].analyticPrices[0];

    if (current) {
      const age = 2022 - new Date(data[slug].set.date).getFullYear();
      const change = ((current[1] - release) / release) * 100;
      output.push([slug, change, age]);
    }
  }
  return output;
}

async function getSetCAGR(data, filter) {
  const output = [];
  for (const slug of filter) {
    const release = msrpLookup[slug];
    const current = data[slug].analyticPrices[0];

    if (current) {
      const age = 2022 - new Date(data[slug].set.date).getFullYear();
      if (age >= 1) {
        const cagr = (Math.pow(current[1] / release, 1 / age) - 1) * 100;
        output.push([slug, cagr, age]);
      }
    }
  }
  return output;
}

async function getTimeToLow(data, filter) {
  const output = [];
  for (const slug of filter) {
    if (data[slug].prices.exists === true) {
      const result = data[slug].prices.data.market.reduce(
        function (prev, current) {
          return prev[1] < current[1] ? prev : current;
        },
        [null, 99999999]
      );

      if (result[0]) {
        const timeToLow = (result[0] - new Date(data[slug].set.date).getTime()) / (1000 * 60 * 60 * 24);
        output.push([new Date(result[0]).toJSON().split("T")[0], result[1], slug, timeToLow]);
      }
    }
  }
  return output;
}

async function main() {
  const data = await processData();

  const filter = [
    "2883-kamigawa-neon-dynasty-set-booster-display",
    "2880-kamigawa-neon-dynasty-draft-booster-box",
    "2023-innistrad-crimson-vow-set-booster-display",
    "2020-innistrad-crimson-vow-draft-booster-box",
    "1955-innistrad-midnight-hunt-set-booster-display",
    "1949-innistrad-midnight-hunt-draft-booster-box",
    "958-adventures-in-the-forgotten-realms-draft-booster-box",
    "963-adventures-in-the-forgotten-realms-set-booster-display",
    "422-modern-horizons-2-set-booster-display",
    "437-modern-horizons-2-draft-booster-box",
    "496-strixhaven-school-of-mages-set-booster-display",
    "661-strixhaven-school-of-mages-draft-booster-box",
    "406-kaldheim-set-booster-display",
    "258-kaldheim-draft-booster-box",
    "73-commander-legends-draft-booster-box",
    "707-zendikar-rising-set-booster-display",
    "599-zendikar-rising-draft-booster-box",
    "80-core-set-2021-booster-box",
    "239-ikoria-lair-of-behemoths-booster-box",
    "521-theros-beyond-death-booster-box",
    "512-throne-of-eldraine-booster-box",
    "92-core-set-2020-booster-box",
    "368-modern-horizons-booster-box",
    "606-war-of-the-spark-booster-box",
  ];

  const totalPrices = {
    0: await getLastPricesTotal(data, 2015, 0, filter),
    15: await getLastPricesTotal(data, 2015, 15, filter),
    30: await getLastPricesTotal(data, 2015, 30, filter),
    46: await getLastPricesTotal(data, 2015, 60, filter),
    90: await getLastPricesTotal(data, 2015, 90, filter),
    120: await getLastPricesTotal(data, 2015, 120, filter),
  };
  console.log(totalPrices);

  function aggregate(data) {
    const agg = data.reduce((p, c) => {
      const age = c[2];
      if (!age) {
        return p;
      } else {
        if (p[age]) {
          p[age].push(c[1]);
          return p;
        } else {
          p[age] = [];
          p[age].push(c[1]);
          return p;
        }
      }
    }, {});
    Object.keys(agg).map((key) => (agg[key] = agg[key].reduce((p, c) => (p += c), 0) / agg[key].length));
    return agg;
  }

  const g = await getSetTotalGain(data, Object.keys(data));
  const flatTotalGain = aggregate(g);
  console.log(flatTotalGain);

  // find those over and under
  console.log(g);

  const h = await getSetCAGR(data, Object.keys(data));
  const flatTotalCAGR = aggregate(h);
  console.log(flatTotalCAGR);

  // find those over and under

  const i = await getTimeToLow(data, Object.keys(data));
  i.forEach((item) => {
    if (
      [
        "2022-06-10",
        "2022-06-11",
        "2022-06-12",
        "2022-06-13",
        "2022-06-14",
        "2022-06-15",
        "2022-06-16",
        "2022-06-17",
        "2022-06-18",
        "2022-06-19",
        "2022-06-20",
        "2022-06-21",
      ].includes(item[0])
    )
      console.log(JSON.stringify(item));
  });
}

main();
