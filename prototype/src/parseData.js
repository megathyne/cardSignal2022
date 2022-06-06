const { MtgData } = require("./lib");
const { boxTypes, msrpLookup } = require("./constants");

async function main() {
  // const today = new Date().toJSON().split("T")[0];
  const today = "2022-06-05";
  const mtgData = new MtgData(today);

  const masterProducts = (await mtgData.getMasterProducts()).data;

  // Get all annual anniversary dates for every product till 2022
  masterProducts.map((m) => {
    m.dateRange = [];
    for (let i = 0; i < 29; i++) {
      const date = new Date(new Date(m.date).setFullYear(new Date(m.date).getFullYear() + i));

      if (date.getFullYear() <= "2022") m.dateRange.push(date);
    }
  });

  // Assign parent id to product children
  masterProducts.map((m) => {
    m.products.map((p) => (p.parentId = m.id));
  });

  // Create an array with just products that are booster boxes
  const productList = masterProducts.reduce((p, c) => p.concat(...c.products.filter((item) => boxTypes.includes(item.name))), []);

  // Create a hash table with keys 1-50 to save annual price data
  intervalLookup = {};
  for (let i = 0; i <= 29; i++) {
    intervalLookup[i] = { low: [], average: [], high: [], market: [] };
  }

  // Calculate needed date per set product
  for (const product of productList) {
    const { parentId, slug } = product;
    const parent = masterProducts.find((mp) => mp.id === parentId);
    const prices = (await mtgData.getProductPrices(slug)).data;

    product.childPrices = { low: [], average: [], high: [], market: [] };
    parent.dateRange.forEach((anniversaryDate, i) => {
      const anniversaryDateUnix = new Date(anniversaryDate).getTime();
      const date = anniversaryDate.toJSON().split("T")[0];

      const averageData = prices.average.find((f) => f[0] === anniversaryDateUnix);
      if (averageData) {
        const price = averageData[1];
        const change = ((price - msrpLookup[slug]) / msrpLookup[slug]) * 100;
        const data = { year: i, date, price, change };
        product.childPrices.average.push(data);
        intervalLookup[i].average.push({ slug, change: data.change });
      }

      const lowData = prices.low.find((f) => f[0] === anniversaryDateUnix);
      if (lowData) {
        const price = lowData[1];
        const change = ((price - msrpLookup[slug]) / msrpLookup[slug]) * 100;
        const data = { year: i, date, price, change };
        product.childPrices.low.push(data);
        intervalLookup[i].low.push({ slug, change: data.change });
      }

      const highData = prices.high.find((f) => f[0] === anniversaryDateUnix);
      if (highData) {
        const price = highData[1];
        const change = ((price - msrpLookup[slug]) / msrpLookup[slug]) * 100;
        const data = { year: i, date, price, change };
        product.childPrices.high.push(data);
        intervalLookup[i].high.push({ slug, change: data.change });
      }

      const marketData = prices.market.find((f) => f[0] === anniversaryDateUnix);
      if (marketData) {
        const price = marketData[1];
        const change = ((price - msrpLookup[slug]) / msrpLookup[slug]) * 100;
        const data = { year: i, date, price, change };
        product.childPrices.market.push(data);
        intervalLookup[i].market.push({ slug, change: data.change });
      }
    });
  }

  // Show all intervals for each set
  // productList.forEach(({ slug, childPrices }) => {
  //   console.log(slug);
  //   childPrices.forEach((item) => console.log(item));
  // });

  // Show all sets for each interval
  // Object.keys(intervalLookup).map((key) => {
  //   if (intervalLookup[key].length > 0) console.log(key, intervalLookup[key]);
  // });

  // Show the average of sets for each interval
  Object.keys(intervalLookup).map((key) => {
    const average = intervalLookup[key].average.reduce((p, c) => (p += c.change), 0) / intervalLookup[key].average.length;
    const low = intervalLookup[key].low.reduce((p, c) => (p += c.change), 0) / intervalLookup[key].low.length;
    const high = intervalLookup[key].high.reduce((p, c) => (p += c.change), 0) / intervalLookup[key].high.length;
    const market = intervalLookup[key].market.reduce((p, c) => (p += c.change), 0) / intervalLookup[key].market.length;
    console.log(parseInt(key) + 1, average.toFixed(2) + "%", low.toFixed(2) + "%", high.toFixed(2) + "%", market.toFixed(2) + "%");
  });

  // Sort by change
  Object.keys(intervalLookup).map((key) => {
    intervalLookup[key].average.sort((a, b) => (a.change > b.change ? 1 : -1));
    intervalLookup[key].low.sort((a, b) => (a.change > b.change ? 1 : -1));
    intervalLookup[key].high.sort((a, b) => (a.change > b.change ? 1 : -1));
    intervalLookup[key].market.sort((a, b) => (a.change > b.change ? 1 : -1));
  });
  console.log(intervalLookup[3]);

  // Show the latest market price for each set
  // const boxByPrice = []
  // for (const { id, name, slug } of productList) {
  //   const product = (await mtgData.getProduct(slug)).data;
  //   boxByPrice.push({
  //     id,
  //     name,
  //     slug,
  //     latestMarketPrice: product ? product.latestPrice.market : 0,
  //   });
  // }

  // boxByPrice
  //   .filter(({ latestMarketPrice }) => latestMarketPrice <= 150 && latestMarketPrice > 50)
  //   .sort((a, b) => (a.latestMarketPrice > b.latestMarketPrice ? 1 : -1))
  //   .forEach(({ slug, latestMarketPrice }) => console.log(slug, latestMarketPrice));
}

main();
