const fs = require("fs/promises");

async function main() {
  const buffer = await fs.readFile("2022-05-28T01:57:11.164Z.json");
  const json = await buffer.toString();
  const data = JSON.parse(json);

  const items = [];
  data.forEach((mtgSet) => {
    mtgSet.products.forEach((item) => {
      if (item.name === "Booster Box") {
        items.push(item);
      }

      if (item.name === "Draft Booster Box") {
        items.push(item);
      }

      if (item.name === "Set Booster Display") {
        items.push(item);
      }
    });
  });

  items
    .sort((a, b) => {
      if (a.latestPrice.market > b.latestPrice.market) {
        return -1;
      }

      if (a.latestPrice.market < b.latestPrice.market) {
        return 1;
      }

      return 0;
    })
    .forEach((item) => {
      const {
        name,
        slug,
        latestPrice: { average, market },
      } = item;

      console.log(slug, name, market);
    });
}

main();
