const fs = require("fs/promises");
const axios = require("axios");
const { setTimeout } = require("timers/promises");
const { boxTypes } = require("./constants");

class MtgStocks {
  baseUrl = `https://api.mtgstocks.com`;
  WAIT = 8000;

  async handleError(error) {
    if (error.response) {
      console.log(error.response.data);
      console.log(error.response.status);
      //   console.log(error.response.headers);
    } else if (error.request) {
      console.log(error.request);
    } else {
      console.log("Error", error.message);
    }
  }

  async getMasterProducts() {
    console.log(`${this.getMasterProducts.name}()`);
    try {
      await setTimeout(this.WAIT, "result");
      const response = await axios.get(`${this.baseUrl}/sealed`);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async getProductDetails(productId) {
    console.log(`${this.getProductDetails.name}(${productId})`);
    try {
      await setTimeout(this.WAIT, "result");
      const response = await axios.get(`${this.baseUrl}/sealed/${productId}`);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async getPrices(productId) {
    console.log(`${this.getPrices.name}(${productId})`);
    try {
      await setTimeout(this.WAIT, "result");
      const response = await axios.get(`${this.baseUrl}/sealed/${productId}/prices`);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }

  async getExpectedValue(masterProductId) {
    console.log(`${this.getExpectedValue.name}(${masterProductId})`);
    try {
      await setTimeout(this.WAIT, "result");
      const response = await axios.get(`${this.baseUrl}/card_sets/${masterProductId}/ev`);
      return response.data;
    } catch (error) {
      this.handleError(error);
    }
  }
}

async function findFile(filename) {
  console.log(`${findFile.name}(${filename})`);
  try {
    const buffer = await fs.readFile(filename);
    const json = buffer.toString();
    const data = JSON.parse(json);
    return { exists: true, filename, data };
  } catch (error) {
    return { exists: false, filename, data: null };
  }
}

async function saveFile(filename, data) {
  console.log(`${saveFile.name}(${filename}, data)`);
  await fs.writeFile(filename, JSON.stringify(data), { recursive: true });
}

async function main() {
  const today = new Date().toJSON().split("T")[0];
  const mtgStocks = new MtgStocks();

  const masterDir = `${__dirname}/../data/${today}`;
  await fs.mkdir(`${masterDir}/ev`, { recursive: true });
  await fs.mkdir(`${masterDir}/products`, { recursive: true });
  await fs.mkdir(`${masterDir}/prices`, { recursive: true });

  let masterProductList = await findFile(`${masterDir}/master-products.json`);

  if (masterProductList.exists === false) {
    masterProductList.data = await mtgStocks.getMasterProducts();
    await saveFile(masterProductList.filename, masterProductList.data);
  }

  for (const masterProduct of masterProductList.data) {
    // let ev = await findFile(`${masterDir}/ev/${masterProduct.slug}.json`);
    // if (ev.exists === false) {
    //   ev.data = await mtgStocks.getExpectedValue(masterProduct.id);
    //   if (ev.data) await saveFile(ev.filename, ev.data);
    // }

    for (const product of masterProduct.products.filter((item) => boxTypes.includes(item.name))) {
      let productDetails = await findFile(`${masterDir}/products/${product.slug}.json`);
      if (productDetails.exists === false) {
        productDetails.data = await mtgStocks.getProductDetails(product.id);
        if (productDetails.data) await saveFile(productDetails.filename, productDetails.data);
      }

      let prices = await findFile(`${masterDir}/prices/${product.slug}.json`);
      if (prices.exists === false) {
        prices.data = await mtgStocks.getPrices(product.id);
        if (prices.data) await saveFile(prices.filename, prices.data);
      }
    }
  }
}

main();
