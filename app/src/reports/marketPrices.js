const processData = require("../processData");

const main = async () => {
  console.log("================================================");
  console.log("=============   MARKET PRICES   ================");
  console.log("================================================");
  const data = await processData();

  const boxPrices = [];

  for (const set in data) {
    const { analyticPrices } = data[set];

    if (analyticPrices[0]) {
      boxPrices.push({ name: set, price: analyticPrices[0][1] });
    }
  }

  console.log("");
  let newestCounter = 0;
  while (newestCounter < 20) {
    const { price, name } = boxPrices[newestCounter];
    console.log("     ", price < 100 ? " " + price.toFixed(2) : price.toFixed(2), "    " + name.split("-").splice(1).join(" "));
    newestCounter++;
  }

  boxPrices.sort((a, b) => (a.price > b.price ? 1 : -1));
  console.log("");
  let cheapestCounter = 0;
  while (cheapestCounter < 20) {
    const { price, name } = boxPrices[cheapestCounter];
    console.log("     ", price < 100 ? " " + price.toFixed(2) : price.toFixed(2), "    " + name.split("-").splice(1).join(" "));
    cheapestCounter++;
  }
};

main();
