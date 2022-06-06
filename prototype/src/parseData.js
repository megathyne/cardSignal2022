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
    for (let i = 0; i < 30; i++) {
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
  for (let i = 0; i <= 30; i++) {
    intervalLookup[i] = [];
  }

  // Calculate needed date per set product
  for (const product of productList) {
    const { parentId, slug } = product;
    const parent = masterProducts.find((mp) => mp.id === parentId);
    const prices = (await mtgData.getProductPrices(slug)).data;

    product.childPrices = [];
    parent.dateRange.forEach((anniversaryDate, i) => {
      const anniversaryDateUnix = new Date(anniversaryDate).getTime();
      const anniversaryMarketData = prices.average.find((f) => f[0] === anniversaryDateUnix);

      if (anniversaryMarketData) {
        const data = {
          year: i,
          date: new Date(anniversaryMarketData[0]).toJSON().split("T")[0],
          price: anniversaryMarketData[1],
          change: ((anniversaryMarketData[1] - msrpLookup[slug]) / msrpLookup[slug]) * 100,
        };
        product.childPrices.push(data);
        intervalLookup[i].push({ slug, change: data.change });
      }
    });

    //console.log(parent.name, name, new Date(parent.date));
    // childPrices.forEach(({ year, price, change }) => {
    //   if (year === 5) {
    //     price ? console.log(year, price, change.toFixed(2) + "%") : "";
    //   }
    // });
  }

  // console.log(productList[50]);
  console.log(intervalLookup);

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
    const average = intervalLookup[key].reduce((p, c) => (p += c.change), 0) / intervalLookup[key].length;
    console.log(parseInt(key) + 1, average.toFixed(2) + "%");
  });

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
