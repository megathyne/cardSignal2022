const { MtgData, Product } = require("./lib");
const { boxTypes, msrpLookup, inventory } = require("./constants");
const today = "2022-06-28";

async function processData() {
  let newLookup = {};
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
  const dateMapping = { 0: 0, 15: 1, 30: 2, 60: 3, 90: 4, 120: 5, 150: 6 };

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
    if (data[slug].prices) {
      const result = data[slug].prices.market.reduce(
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
  // Analysis Hash tables
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
    150: await getLastPricesTotal(data, 2015, 150, filter),
  };
  // console.log(totalPrices);

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
    // Strip min and max

    Object.keys(agg).map((key) => {
      const min = Math.min(...agg[key]); // lowest in array by spreading
      const max = Math.max(...agg[key]); // highest in array by spreading

      const sum = agg[key].reduce((acc, val) => (acc += val), 0);

      agg[key] = (sum - min - max) / (agg[key].length - 2);
    });

    // Object.keys(agg).map((key) => (agg[key] = agg[key].reduce((p, c) => (p += c), 0) / agg[key].length));

    return agg;
  }

  const growthCount = { up: 0, down: 0, total: 0 };
  const ytd = Object.keys(data)
    .map((key) => data[key].ytd)
    .filter((data) => data)
    .sort((a, b) => (a[1] > b[1] ? 1 : -1));
  ytd.forEach((data) => {
    if (data) {
      if (data[1] > 0) {
        growthCount.up += 1;
      } else growthCount.down += 1;
      console.log(data[0], data[1].toFixed(2) + "%", "$" + data[2].toFixed(2));
      growthCount.total += data[2];
    }
  });
  console.log(growthCount);

  const g = Object.keys(data).map((key) => [data[key].product.slug, data[key].productTotalGain, data[key].set.yearsOld]);
  const flatTotalGain = aggregate(g);
  Object.keys(flatTotalGain).forEach((key) => {
    flatTotalGain[key] = { average: flatTotalGain[key], over: [], under: [] };
  });
  g.forEach((item) => {
    if (item[2] > 0) {
      if (flatTotalGain[item[2]].average < item[1]) flatTotalGain[item[2]].over.push(item);
      else flatTotalGain[item[2]].under.push(item);
    }
  });
  Object.keys(flatTotalGain).forEach((key) => {
    flatTotalGain[key].under.sort((a, b) => (a[1] < b[1] ? -1 : 1));
    // console.log(key, flatTotalGain[key].under[0]);
    // console.log(key, flatTotalGain[key]);
  });

  const h = Object.keys(data).map((key) => [data[key].product.slug, data[key].productCAGR, data[key].set.yearsOld]);
  const flatTotalCAGR = aggregate(h);
  Object.keys(flatTotalCAGR).forEach((key) => {
    flatTotalCAGR[key] = { average: flatTotalCAGR[key], over: [], under: [] };
  });
  h.forEach((item) => {
    if (item[2] > 0) {
      if (flatTotalCAGR[item[2]].average < item[1]) flatTotalCAGR[item[2]].over.push(item);
      else flatTotalCAGR[item[2]].under.push(item);
    }
  });
  // console.log(flatTotalCAGR);

  const i = await getTimeToLow(data, Object.keys(data));
  // console.log(i);
  // i.forEach((item) => {
  //   if (
  //     [
  //       "2022-06-10",
  //       "2022-06-11",
  //       "2022-06-12",
  //       "2022-06-13",
  //       "2022-06-14",
  //       "2022-06-15",
  //       "2022-06-16",
  //       "2022-06-17",
  //       "2022-06-18",
  //       "2022-06-19",
  //       "2022-06-20",
  //       "2022-06-21",
  //       "2022-06-22",
  //       "2022-06-23",
  //     ].includes(item[0])
  //   )
  //     console.log(JSON.stringify(item));
  // });

  inventory.map((item) => {
    item.paidPerItem = item.paid / item.quantity;
    item.valuePerItem = data[item.name].analyticPrices[0][1];
    item.value = item.valuePerItem * item.quantity;
  });

  const groupedInventory = inventory.reduce((p, c) => {
    if (p[c.name]) {
      p[c.name].totalPurchased += c.paid;
      p[c.name].totalquanity += c.quantity;
      p[c.name].totalValue += c.value;
      p[c.name].items.push(c);
    } else {
      p[c.name] = {
        totalPurchased: c.paid,
        totalquanity: c.quantity,
        totalValue: c.value,
        items: [c],
      };
    }
    return p;
  }, {});

  Object.keys(groupedInventory).map((m) => {
    groupedInventory[m].averagePaid = groupedInventory[m].totalPurchased / groupedInventory[m].totalquanity;
  });

  // console.log(groupedInventory);
  const foo = Object.keys(groupedInventory)
    .map((key) => ({ ...groupedInventory[key], name: key }))
    // .sort((a, b) => (a.averagePaid > b.averagePaid ? 1 : -1));
    .sort((a, b) => (a.totalquanity > b.totalquanity ? -1 : 1));

  const aggFoo = foo.reduce(
    (p, c) => {
      p.totalPaid += c.totalPurchased;
      p.totalValue += c.totalValue;
      p.totalCount += c.totalquanity;
      return p;
    },
    { totalPaid: 0, totalValue: 0, totalCount: 0 }
  );

  foo.forEach((item) => {
    item.items.sort((a, b) => (a.paidPerItem > b.paidPerItem ? 1 : -1));
    console.log(item);
  });
  // console.log(foo);
  console.log(aggFoo);
}

main();
