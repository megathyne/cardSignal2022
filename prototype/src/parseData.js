const { MtgData } = require("./lib");
const { boxTypes, msrpLookup, priceTypes } = require("./constants");
const MAX_DATA_PERIOD = 29;

async function getAndPrepMasterProductList(mtgData) {
  // Get All Master Products
  const masterProducts = (await mtgData.getMasterProducts()).data;
  return masterProducts.map((m) => {
    m.dateRange = [];
    // Get all annual anniversary dates for every product till 2022
    for (let i = 0; i < MAX_DATA_PERIOD; i++) {
      const anniversaryDate = new Date(new Date(m.date).setFullYear(new Date(m.date).getFullYear() + i));
      if (anniversaryDate.getFullYear() <= "2022") m.dateRange.push(anniversaryDate);
    }
    m.products.map((p) => {
      // Also mutate each product and assign parent id to product children
      p.parentId = m.id;
      // Also create a container to store prices
      p.childPrices = { low: [], average: [], market: [] };
      return p;
    });
    return m;
  });
}

async function main() {
  // TODAY: new Date().toJSON().split("T")[0];
  const mtgData = new MtgData("2022-06-08");

  const masterProducts = await getAndPrepMasterProductList(mtgData);

  // Create an array with just products that are booster boxes
  const productList = masterProducts.reduce(
    (p, c) =>
      p.concat(
        ...c.products
          .filter((item) => boxTypes.includes(item.name))
          .map((item) => {
            item.releaseDate = c.date;
            return item;
          })
      ),
    []
  );

  // Create a hash table with keys 1-50 to save annual price data
  const intervalLookup = {};
  for (let i = 0; i <= MAX_DATA_PERIOD; i++) {
    intervalLookup[i] = { low: [], average: [], market: [] };
  }

  // Calculate needed data per set product
  for (const { parentId, slug, childPrices } of productList) {
    const parent = masterProducts.find((mp) => mp.id === parentId);
    const prices = (await mtgData.getProductPrices(slug)).data;

    if (prices) {
      parent.dateRange.forEach((anniversaryDate, year) => {
        const anniversaryDateUnix = new Date(anniversaryDate).getTime();
        const date = anniversaryDate.toJSON().split("T")[0];

        for (const type of priceTypes) {
          let price;

          const index = prices[type].findIndex((x) => x[0] === anniversaryDateUnix);
          if (index !== -1) {
            if (year === 0) {
              price = prices[type][index + 30][1];
            } else {
              const startPosition = index - (parent.dateRange.length - 1);
              const endPosition = index + (parent.dateRange.length - 1);

              const priceContainer = prices[type].filter((f, i) => i > startPosition && i < endPosition);
              price = priceContainer.reduce((p, c) => (p += c[1]), 0) / priceContainer.length;
            }

            const change = ((price - msrpLookup[slug]) / msrpLookup[slug]) * 100;
            childPrices[type].push({ year, date, price, change });
            intervalLookup[year][type].push({ slug, date, price, change });
          }
        }
      });
    }
  }

  // Show all intervals for each set
  async function intervalsBySet() {
    productList.forEach((product) => {
      console.log(product.slug);
      product.childPrices["market"].forEach((item) => console.log("market", item));
      // for (const type of priceTypes) {
      //   product.childPrices[type].forEach((item) => console.log(type, item));
      // }
    });
  }

  // Show all sets for each interval
  async function intervalDetails() {
    Object.keys(intervalLookup).map((key) => {
      console.log(key + " :");
      for (const type of priceTypes) {
        if (intervalLookup[key][type].length > 0) {
          console.log(
            type,
            intervalLookup[key].type
              .sort((a, b) => (a.change > b.change ? 1 : -1))
              .map(({ slug, change }) => ({ [slug]: change.toFixed(2) + "%" }))
          );
        }
      }
    });
  }

  // Show the average of sets for each interval
  async function viewOverallChange() {
    console.log("year, average, low, market");
    Object.keys(intervalLookup).map((key) => {
      const average = intervalLookup[key].average.reduce((p, c) => (p += c.change), 0) / intervalLookup[key].average.length;
      const low = intervalLookup[key].low.reduce((p, c) => (p += c.change), 0) / intervalLookup[key].low.length;
      const market = intervalLookup[key].market.reduce((p, c) => (p += c.change), 0) / intervalLookup[key].market.length;
      console.log(parseInt(key), `${average.toFixed(2)}%`, `${low.toFixed(2)}%`, `${market.toFixed(2)}%`);
    });
  }

  // View Interval
  async function viewInterval(interval) {
    // Sort by change
    Object.keys(intervalLookup).map((key) => {
      for (const type of priceTypes) {
        intervalLookup[key][type].sort((a, b) => (a.change > b.change ? 1 : -1));
      }
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

  // View set's prices by age
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
    for (const type of priceTypes) {
      product.childPrices[type].forEach((item) => console.log(type, item));
    }
  }

  async function currentGains() {
    const output = [];
    for (const { name, parentId, slug, releaseDate } of productList) {
      const prices = (await mtgData.getProductPrices(slug)).data;

      let price = 0;
      if (prices.market.length > 0) {
        price = prices.market[prices.market.length - 1];
      } else if (prices.low.length > 0) {
        price = prices.low[prices.low.length - 1];
      }

      const firstDate = new Date(releaseDate);
      const lastDate = new Date(price[0]);

      const age = lastDate.getFullYear() - firstDate.getFullYear();
      const change = ((price[1] - msrpLookup[slug]) / msrpLookup[slug]) * 100;

      const changePerYear = change / age;
      output.push({
        slug,
        releaseDate: firstDate,
        msrp: msrpLookup[slug],
        lastPriceDate: lastDate,
        lastPrice: price[1],
        change: change.toFixed(2) + "%",
        age,
        changePerYear: changePerYear.toFixed(2) + "%",
      });
    }

    const items = output;
    const replacer = (key, value) => (value === null ? "" : value); // specify how you want to handle null values here
    const header = Object.keys(items[0]);
    const csv = [
      header.join(","), // header row first
      ...items.map((row) => header.map((fieldName) => JSON.stringify(row[fieldName], replacer)).join(",")),
    ].join("\r\n");

    console.log(csv);
  }

  async function findTimeToLowestPrice() {}

  currentGains();
  // intervalsByProductSlug("606-war-of-the-spark-booster-box");
  // intervalsBySet();
  // intervalDetails();
  // viewOverallChange();
  // viewInterval(4);
  // latestMarketPricePerSet(50, 200);
  // setPriceByAge(50, 200);
}

main();
