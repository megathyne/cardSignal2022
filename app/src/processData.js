const { MtgData, Product } = require("./lib");
const { boxTypes, TODAY } = require("./constants");

async function processData() {
  let lookup = {};
  const mtgData = new MtgData(TODAY);
  const masterProducts = (await mtgData.getMasterProducts()).data;

  for (const set of masterProducts) {
    const products = set.products.filter((item) => boxTypes.includes(item.name));

    for (const productRaw of products) {
      const product = new Product(TODAY, set, productRaw);
      await product.init();
      lookup[productRaw.slug] = product;
    }
  }
  return lookup;
}

module.exports = processData;
