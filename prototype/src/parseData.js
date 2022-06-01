const fs = require("fs/promises");
const { boxTypes } = require("./constants");

async function main() {
  try {
    const today = new Date().toJSON().split("T")[0];
    // const today = `2022-05-31`;
    const sealedOverviewFile = `./data/${today}/SEALED_OVERVIEW_${today}.json`;
    const buffer = await fs.readFile(sealedOverviewFile);
    const json = buffer.toString();
    const sealedOverview = JSON.parse(json);

    const filteredSealed = sealedOverview.reduce((p, c) => {
      const products = c.products.filter((f) => boxTypes.includes(f.name));
      if (products.length > 0) p[c.name] = products;
      return p;
    }, {});

    for (key in filteredSealed) {
      for (item of filteredSealed[key]) {
        const detailsFile = `./data/${today}/${item.slug}-${today}.json`;
        try {
          const detailsBuffer = await fs.readFile(detailsFile);
          const detailsJson = detailsBuffer.toString();
          const details = JSON.parse(detailsJson);
          item.details = details;

          const pricesFile = `./data/${today}/${item.id}-prices-${today}.json`;
          const priceBuffer = await fs.readFile(pricesFile);
          const pricesJson = priceBuffer.toString();
          const prices = JSON.parse(pricesJson);
          item.prices = prices;
        } catch (error) {
          console.log(error);
        }
      }
    }

    console.log(filteredSealed[0]);
  } catch (error) {
    console.log(error);
  }
}

main();
