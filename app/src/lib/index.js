const fs = require("fs/promises");
const { msrpLookup } = require("../constants");
const MAX_DATA_PERIOD = 29;

class MtgData {
  constructor(today) {
    this.filePaths = {};
    this.filePaths.masterDir = `${__dirname}/../../data/${today}`;
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

  async getMasterProductEv(slug) {
    return await this.findFile(`${this.filePaths.evDir}/${slug}.json`);
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

function monthDiff(d1, d2) {
  var months;
  months = (d1.getFullYear() - d2.getFullYear()) * 12;
  months -= d2.getMonth();
  months += d1.getMonth();
  return months <= 0 ? 0 : months;
}

function yearDiff(d1, d2) {
  return d1.getFullYear() - d2.getFullYear();
}

class Set extends MtgData {
  constructor(today, set) {
    super(today);
    this.today = today;
    this.set = set;
    this.set.date = parseDate(this.set.date);
    this.set.monthsOld = monthDiff(new Date(), new Date(this.set.date));
    this.set.yearsOld = yearDiff(new Date(), new Date(this.set.date));
  }

  async getEV() {
    return this.getMasterProductEv(this.set.slug);
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
    [0, parseDate(new Date(new Date(this.today).setDate(new Date(this.today).getDate() - 0)))],
    [15, parseDate(new Date(new Date(this.today).setDate(new Date(this.today).getDate() - 15)))],
    [30, parseDate(new Date(new Date(this.today).setDate(new Date(this.today).getDate() - 30)))],
    [60, parseDate(new Date(new Date(this.today).setDate(new Date(this.today).getDate() - 60)))],
    [90, parseDate(new Date(new Date(this.today).setDate(new Date(this.today).getDate() - 90)))],
    [120, parseDate(new Date(new Date(this.today).setDate(new Date(this.today).getDate() - 120)))],
    [150, parseDate(new Date(new Date(this.today).setDate(new Date(this.today).getDate() - 150)))],
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

    if (p.exists == false) this.prices = defaultPrices;
    else this.prices = p.data;

    this.anniversaryPrices = this.anniversaryDates.map((item) => {
      if (this.prices.market && this.prices.market.find((data) => item === parseDate(data[0]))) {
        const data = this.prices.market.find((data) => item === parseDate(data[0]));
        return [parseDate(data[0]), data[1], "market"];
      } else if (this.prices.low && this.prices.low.find((data) => item === parseDate(data[0]))) {
        const data = this.prices.low.find((data) => item === parseDate(data[0]));
        return [parseDate(data[0]), data[1], "low"];
      } else if (this.prices.average && this.prices.average.find((data) => item === parseDate(data[0]))) {
        const data = this.prices.average.find((data) => item === parseDate(data[0]));
        return [parseDate(data[0]), data[1], "average"];
      } else return [parseDate(item), null, null];
    });

    this.analyticPrices = this.analyticDates.map((item) => {
      const result1 = this.prices.market.find((data) => item[1] === parseDate(data[0]));
      if (result1) return [parseDate(result1[0]), result1[1]];
      else {
        const result2 = this.prices.low.find((data) => item[1] === parseDate(data[0]));
        if (result2) return [parseDate(result2[0]), result2[1]];
      }
    });

    this.ev = await this.getEV();
    await this.getSetTotalGain();
    await this.getSetCAGR();
    await this.getYTD();
  };

  async getYTD() {
    const startOfYear = this.prices.market.find((data) => parseDate("2022-01-01") === parseDate(data[0]));
    const current = this.prices.market.find((data) => parseDate(new Date(this.today)) === parseDate(data[0]));
    if (startOfYear && current) {
      const gain = ((current[1] - startOfYear[1]) / startOfYear[1]) * 100;
      this.ytd = [this.product.slug, gain, current[1] - startOfYear[1]];
    } else this.ytd = null;
  }

  async getSetTotalGain() {
    const release = msrpLookup[this.product.slug];
    const current = this.analyticPrices[0];
    this.productTotalGain = current ? ((current[1] - release) / release) * 100 : null;
  }

  async getSetCAGR() {
    const release = msrpLookup[this.product.slug];
    const current = this.analyticPrices[0];
    if (current) {
      this.productCAGR = this.set.yearsOld > 0 ? (Math.pow(current[1] / release, 1 / this.set.yearsOld) - 1) * 100 : null;
    } else {
      this.productCAGR = null;
    }
  }

  anniversaryDates = this.getAnniversaryDates();
  analyticDates = this.getAnalyticDates();
}

module.exports = { MtgData, Product };
