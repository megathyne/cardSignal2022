const processData = require("../processData");
const { inventory } = require("../constants/index");

function getGain(current, original) {
  return ((current - original) / original) * 100;
}

const main = async () => {
  console.log("================================================");
  console.log("==========   INVENTORY VALUE   =============");
  console.log("================================================");
  const data = await processData();

  let totalValue = 0;
  let totalCost = 0;
  let totalQuantity = 0;
  for (const item of inventory) {
    item.marketPrice = data[item.name].analyticPrices[0][1];
    item.value = item.marketPrice * item.quantity;

    totalQuantity += item.quantity;
    totalCost += item.paid;
    totalValue += item.value;
  }

  const inventoryAnalyticsMap = inventory.reduce((p, c) => {
    if (p[c.name]) {
      p[c.name].cost += c.paid;
      p[c.name].value += c.value;
    } else p[c.name] = { cost: c.paid, value: c.value };
    return p;
  }, {});

  const inventoryAnalyticArray = Object.keys(inventoryAnalyticsMap)
    .map((key) => ({ ...inventoryAnalyticsMap[key], name: key }))
    .map((set) => {
      const { cost, value } = set;
      set.gain = getGain(value, cost);
      return set;
    })
    .sort((a, b) => (a.gain < b.gain ? 1 : -1));

  console.log("COST".padStart(15) + "VALUE".padStart(15) + "GAIN".padStart(15) + "      NAME");
  for (const set of inventoryAnalyticArray) {
    const { cost, value, gain } = set;

    console.log(cost.toFixed(2).padStart(15) + value.toFixed(2).padStart(15) + gain.toFixed(2).padStart(15) + "      " + set.name);
  }
  console.log(" ");
  console.log("Total Cost".padStart(15) + "Total Value".padStart(15) + "Total Gain".padStart(15) + "Total Quantity".padStart(15));
  console.log(
    totalCost.toFixed(2).padStart(15) +
      totalValue.toFixed(2).padStart(15) +
      getGain(totalValue, totalCost).toFixed(2).padStart(15) +
      totalQuantity.toFixed(0).padStart(15)
  );
  console.log(" ");
};

main();
