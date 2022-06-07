const { MtgData } = require("./lib");
const { boxTypes, msrpLookup } = require("./constants");

async function main() {
  // const today = new Date().toJSON().split("T")[0];
  const today = "2022-06-07";
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
  const intervalLookup = {};
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
      const year = i;

      const averageData = prices.average.find((f) => f[0] === anniversaryDateUnix);
      if (averageData) {
        const price = averageData[1];
        const change = ((price - msrpLookup[slug]) / msrpLookup[slug]) * 100;
        const data = { year, date, price, change };

        product.childPrices.average.push(data);
        intervalLookup[i].average.push({ slug, change: data.change });
      }

      const lowData = prices.low.find((f) => f[0] === anniversaryDateUnix);
      if (lowData) {
        const price = lowData[1];
        const change = ((price - msrpLookup[slug]) / msrpLookup[slug]) * 100;
        const data = { year, date, price, change };
        product.childPrices.low.push(data);
        intervalLookup[i].low.push({ slug, change: data.change });
      }

      const highData = prices.high.find((f) => f[0] === anniversaryDateUnix);
      if (highData) {
        const price = highData[1];
        const change = ((price - msrpLookup[slug]) / msrpLookup[slug]) * 100;
        const data = { year, date, price, change };
        product.childPrices.high.push(data);
        intervalLookup[i].high.push({ slug, change: data.change });
      }

      const marketData = prices.market.find((f) => f[0] === anniversaryDateUnix);
      if (marketData) {
        const price = marketData[1];
        const change = ((price - msrpLookup[slug]) / msrpLookup[slug]) * 100;
        const data = { year, date, price, change };
        product.childPrices.market.push(data);
        intervalLookup[i].market.push({ slug, change: data.change });
      }
    });
  }

  // Show all intervals for each set
  async function intervalsBySet() {
    productList.forEach((product) => {
      console.log(product.slug);
      product.childPrices.low.forEach((item) => console.log("low", item));
      product.childPrices.average.forEach((item) => console.log("average", item));
      product.childPrices.high.forEach((item) => console.log("high", item));
      product.childPrices.market.forEach((item) => console.log("market", item));
    });
  }

  // Show all sets for each interval
  async function intervalDetails() {
    Object.keys(intervalLookup).map((key) => {
      console.log(key + " :");
      if (intervalLookup[key].low.length > 0) console.log("low", intervalLookup[key]);
      if (intervalLookup[key].average.length > 0) console.log("average", intervalLookup[key]);
      if (intervalLookup[key].high.length > 0) console.log("high", intervalLookup[key]);
      if (intervalLookup[key].market.length > 0) console.log("market", intervalLookup[key]);
    });
  }

  // Show the average of sets for each interval
  async function viewOverallChange() {
    console.log("year, average, low, high, market");
    Object.keys(intervalLookup).map((key) => {
      const average = intervalLookup[key].average.reduce((p, c) => (p += c.change), 0) / intervalLookup[key].average.length;
      const low = intervalLookup[key].low.reduce((p, c) => (p += c.change), 0) / intervalLookup[key].low.length;
      const high = intervalLookup[key].high.reduce((p, c) => (p += c.change), 0) / intervalLookup[key].high.length;
      const market = intervalLookup[key].market.reduce((p, c) => (p += c.change), 0) / intervalLookup[key].market.length;
      console.log(parseInt(key), `${average.toFixed(2)}%`, `${low.toFixed(2)}%`, `${high.toFixed(2)}%`, `${market.toFixed(2)}%`);
    });
  }

  // View Interval
  async function viewInterval(interval) {
    // Sort by change
    Object.keys(intervalLookup).map((key) => {
      intervalLookup[key].average.sort((a, b) => (a.change > b.change ? 1 : -1));
      intervalLookup[key].low.sort((a, b) => (a.change > b.change ? 1 : -1));
      intervalLookup[key].high.sort((a, b) => (a.change > b.change ? 1 : -1));
      intervalLookup[key].market.sort((a, b) => (a.change > b.change ? 1 : -1));
    });
    console.log(intervalLookup[interval]);
  }

  // Show the latest market price for each set
  async function latestMarketPricePerSet(fromPrice, toPrice) {
    const boxByPrice = [];
    for (const { id, name, slug } of productList) {
      const product = (await mtgData.getProduct(slug)).data;
      boxByPrice.push({
        id,
        name,
        slug,
        latestMarketPrice: product ? product.latestPrice.market : 0,
      });
    }
    boxByPrice
      .filter(({ latestMarketPrice }) => latestMarketPrice >= fromPrice && latestMarketPrice <= toPrice)
      .sort((a, b) => (a.latestMarketPrice > b.latestMarketPrice ? 1 : -1))
      .forEach(({ slug, latestMarketPrice }) => console.log(slug, latestMarketPrice));
  }

  async function setPriceByAge(fromPrice, toPrice) {
    const masterProducts = (await mtgData.getMasterProducts()).data;
    const boxByAge = [];
    for (const { id, name, slug, parentId } of productList) {
      const product = (await mtgData.getProduct(slug)).data;
      const { date } = masterProducts.find((mp) => mp.id === parentId);
      boxByAge.push({
        id,
        name,
        date,
        slug,
        latestMarketPrice: product ? product.latestPrice.market : 0,
      });
    }
    boxByAge
      .filter(({ latestMarketPrice }) => latestMarketPrice >= fromPrice && latestMarketPrice <= toPrice)
      .sort((a, b) => (a.date < b.date ? 1 : -1))
      .forEach(({ slug, latestMarketPrice, date }) => console.log(slug, new Date(date).toJSON(), latestMarketPrice));
  }

  // intervalsBySet()
  // intervalDetails()
  // viewOverallChange();
  // viewInterval(3);
  // latestMarketPricePerSet(50, 200);
  setPriceByAge(50, 100);
}

main();
