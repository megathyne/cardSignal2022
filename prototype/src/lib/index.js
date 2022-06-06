const fs = require("fs/promises");

class MtgData {
  constructor(today) {
    this.masterDir = `./data/${today}`;
    this.ev = `${this.masterDir}/ev`;
    this.products = `${this.masterDir}/products`;
    this.prices = `${this.masterDir}/prices`;
  }

  async findFile(filename) {
    // console.log(`${this.findFile.name}(${filename})`);
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

  async getMasterProducts() {
    return await this.findFile(`${this.masterDir}/master-products.json`);
  }

  async getMasterProductEv(id, name) {
    return await this.findFile(`${this.ev}/${id}-${name}.json`);
  }

  async getProduct(slug) {
    return await this.findFile(`${this.products}/${slug}.json`);
  }

  async getProductPrices(slug) {
    return await this.findFile(`${this.prices}/${slug}.json`);
  }
}

module.exports = { MtgData };
