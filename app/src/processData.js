const { MtgData, Product } = require("./lib");
const { boxTypes, msrpLookup, inventory } = require("./constants");
const today = "2022-07-24";

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

module.exports = processData;
