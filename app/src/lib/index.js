const fs = require("fs/promises");
const MAX_DATA_PERIOD = 29;

class MtgData {
  constructor(today) {
    this.filePaths = {};
    this.filePaths.masterDir = `${__dirname}/../data/${today}`;
    this.filePaths.evDir = `${this.filePaths.masterDir}/ev`;
    this.filePaths.productsDir = `${this.filePaths.masterDir}/products`;
    this.filePaths.pricesDir = `${this.filePaths.masterDir}/prices`;
  }

  async findFile(filename) {
    // console.log(`${this.findFile.name}(${filename})`);
    try {
      const buffer = await fs.readFile(filename);
      const json = buffer.toString();
      const data = JSON.parse(json);
      return { exists: true, filename, data };
    } catch (error) {
      // console.log(error);
      return { exists: false, filename, data: null };
    }
  }

  async getMasterProducts() {
    return await this.findFile(`${this.filePaths.masterDir}/master-products.json`);
  }

  async getMasterProductEv(id, name) {
    return await this.findFile(`${this.filePaths.evDir}/${id}-${name}.json`);
  }

  async getProduct(slug) {
    return await this.findFile(`${this.filePaths.productsDir}/${slug}.json`);
  }

  async getProductPrices(slug) {
    return await this.findFile(`${this.filePaths.pricesDir}/${slug}.json`);
  }
}

function parseDate(dateNumber) {
  return new Date(dateNumber).toJSON().split("T")[0];
}

class Set extends MtgData {
  constructor(today, set) {
    super(today);
    this.today = today;
    this.set = set;
    this.set.date = parseDate(this.set.date);
  }

  getAnniversaryDates() {
    const dateArray = [];
    for (let i = 0; i < MAX_DATA_PERIOD; i++) {
      const anniversaryDate = new Date(new Date(this.set.date).setFullYear(new Date(this.set.date).getFullYear() + i));
      if (anniversaryDate.getFullYear() <= "2022") dateArray.push(parseDate(anniversaryDate));
    }
    return dateArray;
  }

  getAnalyticDates = () => [
    [0, parseDate(new Date(new Date(this.today).setDate(new Date(this.today).getDate() - 1)))],
    [15, parseDate(new Date(new Date(this.today).setDate(new Date(this.today).getDate() - 15)))],
    [30, parseDate(new Date(new Date(this.today).setDate(new Date(this.today).getDate() - 30)))],
    [60, parseDate(new Date(new Date(this.today).setDate(new Date(this.today).getDate() - 60)))],
    [90, parseDate(new Date(new Date(this.today).setDate(new Date(this.today).getDate() - 90)))],
    [120, parseDate(new Date(new Date(this.today).setDate(new Date(this.today).getDate() - 120)))],
  ];
}

class Product extends Set {
  prices;
  constructor(today, set, product) {
    super(today, set);
    this.today = today;
    this.product = product;
  }

  init = async () => {
    const defaultPrices = { low: [], average: [], high: [], market: [] };
    const p = await super.getProductPrices(this.product.slug);

    if (p.data == null) {
      this.prices = { ...p, data: defaultPrices };
    } else {
      this.prices = p;
    }

    this.anniversaryPrices = this.anniversaryDates.map((item) => {
      if (this.prices.data.market) {
        return this.prices.data.market.find((data) => item === parseDate(data[0]));
      } else if (this.prices.data.low) {
        return this.prices.data.low.find((data) => item === parseDate(data[0]));
      } else return [item, null];
    });

    this.analyticPrices = this.analyticDates.map((item) => {
      const result1 = this.prices.data.market.find((data) => item[1] === parseDate(data[0]));
      if (result1) return [parseDate(result1[0]), result1[1]];
      else {
        const result2 = this.prices.data.low.find((data) => item[1] === parseDate(data[0]));
        if (result2) return [parseDate(result2[0]), result2[1]];
      }
    });
  };

  anniversaryDates = this.getAnniversaryDates();
  analyticDates = this.getAnalyticDates();
}

module.exports = { MtgData, Product };
