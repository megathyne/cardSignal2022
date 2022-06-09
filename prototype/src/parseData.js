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
      // Need to add 30 days to year zero to give prices time to stabilize
      if (i === 0) {
        const releasePlus30 = new Date(m.date);
        releasePlus30.setDate(new Date(releasePlus30).getDate() + 30);
        m.dateRange.push(releasePlus30);
      } else {
        const anniversaryDate = new Date(new Date(m.date).setFullYear(new Date(m.date).getFullYear() + i));
        if (anniversaryDate.getFullYear() <= "2022") m.dateRange.push(anniversaryDate);
      }
    }
  });

  masterProducts.forEach((item) => {
    console.log(item.name, item.dateRange[0], item.dateRange.length - 1);
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

  // Calculate needed data per set product
  for (const product of productList) {
    const { parentId, slug } = product;
    const parent = masterProducts.find((mp) => mp.id === parentId);

    product.childPrices = { low: [], average: [], high: [], market: [] };
    const prices = (await mtgData.getProductPrices(slug)).data;

    if (prices) {
      parent.dateRange.forEach((anniversaryDate, year) => {
        const anniversaryDateUnix = new Date(anniversaryDate).getTime();
        const date = anniversaryDate.toJSON().split("T")[0];

        const priceTypes = ["average", "low", "high", "market"];
        for (const type of priceTypes) {
          let postion = null;
          const data = prices[type].find((f, i) => {
            position = i;
            return f[0] === anniversaryDateUnix;
          });
          if (data) {
            let price;
            if (year === 0) {
              // Simple Case
              price = data[1];
            } else {
              let startPosition = position - 15;
              const endPosition = position + 15;
              const priceContainer = [];
              while (startPosition < endPosition) {
                const d = prices[type][startPosition];
                if (d) {
                  priceContainer.push(d[1]);
                }
                startPosition++;
              }
              price = priceContainer.reduce((p, c) => (p += c), 0) / priceContainer.length;
            }

            const change = ((price - msrpLookup[slug]) / msrpLookup[slug]) * 100;
            product.childPrices[type].push({ year, date, price, change });
            intervalLookup[year][type].push({ slug, change });
          }
        }
      });
    }
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
      if (intervalLookup[key].low.length > 0)
        console.log(
          "low",
          intervalLookup[key].low
            .sort((a, b) => (a.change > b.change ? 1 : -1))
            .map(({ slug, change }) => ({ [slug]: change.toFixed(2) + "%" }))
        );
      if (intervalLookup[key].average.length > 0)
        console.log(
          "average",
          intervalLookup[key].average
            .sort((a, b) => (a.change > b.change ? 1 : -1))
            .map(({ slug, change }) => ({ [slug]: change.toFixed(2) + "%" }))
        );
      if (intervalLookup[key].high.length > 0)
        console.log(
          "high",
          intervalLookup[key].high
            .sort((a, b) => (a.change > b.change ? 1 : -1))
            .map(({ slug, change }) => ({ [slug]: change.toFixed(2) + "%" }))
        );
      if (intervalLookup[key].market.length > 0)
        console.log(
          "market",
          intervalLookup[key].market
            .sort((a, b) => (a.change > b.change ? 1 : -1))
            .map(({ slug, change }) => ({ [slug]: change.toFixed(2) + "%" }))
        );
    });
  }

  // Show the average of sets for each interval
  async function viewOverallChange() {
    console.log("year, average, low, market");
    Object.keys(intervalLookup).map((key) => {
      const average = intervalLookup[key].average.reduce((p, c) => (p += c.change), 0) / intervalLookup[key].average.length;
      const low = intervalLookup[key].low.reduce((p, c) => (p += c.change), 0) / intervalLookup[key].low.length;
      // const high = intervalLookup[key].high.reduce((p, c) => (p += c.change), 0) / intervalLookup[key].high.length;
      const market = intervalLookup[key].market.reduce((p, c) => (p += c.change), 0) / intervalLookup[key].market.length;
      console.log(parseInt(key), `${average.toFixed(2)}%`, `${low.toFixed(2)}%`, `${market.toFixed(2)}%`);
    });
  }

  // View Interval
  async function viewInterval(interval) {
    // Sort by change
    Object.keys(intervalLookup).map((key) => {
      intervalLookup[key].average.sort((a, b) => (a.change > b.change ? 1 : -1));
      intervalLookup[key].low.sort((a, b) => (a.change > b.change ? 1 : -1));
      // intervalLookup[key].high.sort((a, b) => (a.change > b.change ? 1 : -1));
      intervalLookup[key].market.sort((a, b) => (a.change > b.change ? 1 : -1));
    });
    console.log(intervalLookup[interval]);
  }

  // Show the latest market price for each set
  async function latestMarketPricePerSet(fromPrice, toPrice) {
    const boxByPrice = [];
    for (const { id, name, slug } of productList) {
      const product = (await mtgData.getProduct(slug)).data;
      const latestMarketPrice = product ? product.latestPrice.market : 0;
      boxByPrice.push({ id, name, slug, latestMarketPrice });
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
      const latestMarketPrice = product ? product.latestPrice.market : 0;
      boxByAge.push({ id, name, date, slug, latestMarketPrice });
    }
    boxByAge
      .filter(({ latestMarketPrice }) => latestMarketPrice >= fromPrice && latestMarketPrice <= toPrice)
      .sort((a, b) => (a.date < b.date ? 1 : -1))
      .forEach(({ slug, latestMarketPrice, date }) => console.log(slug, new Date(date).toJSON(), latestMarketPrice));
  }

  // Show all intervals for a product slug
  async function intervalsByProductSlug(slug) {
    const product = productList.find((f) => f.slug === slug);
    console.log(product.slug);
    product.childPrices.low.forEach((item) => console.log("low", item));
    product.childPrices.average.forEach((item) => console.log("average", item));
    //  product.childPrices.high.forEach((item) => console.log("high", item));
    product.childPrices.market.forEach((item) => console.log("market", item));
  }

  // intervalsByProductSlug("606-war-of-the-spark-booster-box");
  // intervalsBySet();
  // intervalDetails();
  viewOverallChange();
  // viewInterval(4);
  // latestMarketPricePerSet(50, 200);
  // setPriceByAge(50, 200);
}

main();

// 30 days before and after 30 for anniversary past inital
