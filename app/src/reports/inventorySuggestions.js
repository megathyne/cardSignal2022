const { inventory } = require("../constants/index");
const processData = require("../processData");

function getGain(current, original) {
  return ((current - original) / original) * 100;
}

const main = async () => {
  console.log("================================================");
  console.log("==========   INVENTORY SUGGESTIONS   ===========");
  console.log("================================================");

  const data = await processData();

  for (const item of inventory) {
    item.marketPrice = data[item.name].analyticPrices[0][1];
    item.value = item.marketPrice * item.quantity;
  }

  const inventoryAnalyticsMap = inventory.reduce((p, c) => {
    if (p[c.name]) {
      p[c.name].cost += c.paid;
      p[c.name].value += c.value;
      p[c.name].quantity += c.quantity;
    } else p[c.name] = { cost: c.paid, value: c.value, quantity: c.quantity };
    return p;
  }, {});

  const inventoryAnalyticArray = Object.keys(inventoryAnalyticsMap)
    .map((key) => ({ ...inventoryAnalyticsMap[key], name: key }))
    .map((set) => {
      const { cost, value, quantity } = set;
      set.gain = getGain(value, cost);
      set.avgCost = cost / quantity;
      set.avgValue = value / quantity;
      return set;
    })
    .sort((a, b) => (a.gain > b.gain ? 1 : -1));

  const heading =
    "COST".padStart(15) + "AVG COST".padStart(15) + "VALUE".padStart(15) + "AVG VALUE".padStart(15) + "GAIN".padStart(15) + "      NAME";
  console.log(heading);
  for (const set of inventoryAnalyticArray) {
    const { cost, value, gain, avgCost, avgValue } = set;

    const line =
      cost.toFixed(2).padStart(15) +
      avgCost.toFixed(2).padStart(15) +
      value.toFixed(2).padStart(15) +
      avgValue.toFixed(2).padStart(15) +
      gain.toFixed(2).padStart(15) +
      "      " +
      set.name.split("-").splice(1).join(" ");

    console.log(line);
  }

  console.log(" ");
};

main();
