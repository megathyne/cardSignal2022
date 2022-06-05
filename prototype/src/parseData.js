const fs = require("fs/promises");
const { boxTypes, msrpLookup } = require("./constants");

async function findFile(filename) {
  console.log(`${findFile.name}(${filename})`);
  try {
    const buffer = await fs.readFile(filename);
    const json = buffer.toString();
    const data = JSON.parse(json);
    return { exists: true, filename, data };
  } catch (error) {
    console.log(error);
    return { exists: false, filename, data: null };
  }
}

class MtgData {
  constructor(today) {
    this.masterDir = `./data/${today}`;
    this.ev = `${this.masterDir}/ev`;
    this.products = `${this.masterDir}/products`;
    this.prices = `${this.masterDir}/prices`;
  }

  async getMasterProducts() {
    return (await findFile(`${this.masterDir}/master-products.json`)).data;
  }

  async getMasterProductEv(id, name) {
    return await findFile(`${this.ev}/${id}-${name}.json`);
  }

  async getProduct(slug) {
    return await findFile(`${this.products}/${slug}.json`);
  }

  async getProductPrices(slug) {
    return await findFile(`${this.prices}/${slug}.json`);
  }
}

async function main() {
  const today = new Date().toJSON().split("T")[0];
  // const today = "2022-06-05";
  const mtgData = new MtgData(today);

  const masterProducts = await mtgData.getMasterProducts();

  masterProducts.map((m) => {
    m.dateRange = [];
    for (let i = 0; i < 50; i++) {
      m.dateRange.push(new Date(new Date(m.date).setFullYear(new Date(m.date).getFullYear() + i)));
    }

    m.products.map((p) => (p.parentId = m.id));
  });

  const productList = masterProducts.reduce((p, c) => p.concat(...c.products.filter((item) => boxTypes.includes(item.name))), []);
  intervalLookup = {};
  for (let i = 0; i <= 50; i++) {
    intervalLookup[i] = [];
  }

  for (const { parentId, slug } of productList) {
    const parent = masterProducts.find((mp) => mp.id === parentId);

    const productPrices = await mtgData.getProductPrices(slug);

    if (productPrices.exists === true) {
      const childPrices = [];
      parent.dateRange.forEach((d, i) => {
        const p = new Date(d).getTime();
        const s = productPrices.data.market.find((f) => f[0] === p);
        if (s) {
          console.log(slug, new Date(s[0]), s[1]);
        }
        const data = { year: i + 1, price: s ? s[1] : null, change: s ? ((s[1] - msrpLookup[slug]) / msrpLookup[slug]) * 100 : null };
        childPrices.push(data);

        if (data.price !== null) {
          intervalLookup[i].push({ [slug]: data.change });
        }
      });

      //console.log(parent.name, name, new Date(parent.date));
      // childPrices.forEach(({ year, price, change }) => {
      //   if (year === 5) {
      //     price ? console.log(year, price, change.toFixed(2) + "%") : "";
      //   }
      // });
    }
  }

  Object.keys(intervalLookup).map((key) => {
    console.log(key, intervalLookup[key]);
  });

  // Object.keys(intervalLookup).map((key) => {
  //   const average = intervalLookup[key].reduce((p, c) => (p += c.change), 0) / intervalLookup[key].length;
  //   console.log(parseInt(key) + 1, average.toFixed(2) + "%");
  // });

  // const boxByPrice = []
  // for (const { id, name, slug } of productList) {
  //   const product = await mtgData.getProduct(slug);
  //   boxByPrice.push({
  //     id,
  //     name,
  //     slug,
  //     latestMarketPrice: product.data ? product.data.latestPrice.market : 0,
  //   });
  // }

  // boxByPrice
  //   .filter(({ latestMarketPrice }) => latestMarketPrice <= 150 && latestMarketPrice > 50)
  //   .sort((a, b) => (a.latestMarketPrice > b.latestMarketPrice ? 1 : -1))
  //   .forEach(({ slug, latestMarketPrice }) => console.log(slug, latestMarketPrice));
}

main();
