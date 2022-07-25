const processData = require("../processData");
const { inventory } = require("../constants/index");

const main = async () => {
  console.log("================================================");
  console.log("==========   INVENTORY DISTRIBUTION   ==========");
  console.log("================================================");
  const data = await processData();

  let totalQuanity = 0;
  let totalValue = 0;
  let totalCost = 0;
  const inventoryTable = inventory.reduce((p, c) => {
    if (p[c.name]) {
      totalCost += c.paid;
      p[c.name].cost += c.paid;
      totalQuanity += c.quantity;
      p[c.name].quantity += c.quantity;
    } else {
      totalCost += c.paid;
      totalQuanity += c.quantity;
      p[c.name] = { quantity: c.quantity, cost: c.paid };
    }
    return p;
  }, {});

  const inventoryArr = Object.keys(inventoryTable)
    .map((key) => {
      const value = data[key].analyticPrices[0][1] * inventoryTable[key].quantity;
      totalValue += value;
      return { name: key, cost: inventoryTable[key].cost, quantity: inventoryTable[key].quantity, value };
    })
    .sort((a, b) => (a.value > b.value ? -1 : 1));

  console.log(`Total Quantity: ${totalQuanity}    Total Value: $${totalValue.toFixed(2)}    Total Cost: $${totalCost.toFixed(2)}`);
  console.log("");
  console.log(
    "Value".padStart(12) +
      "QTY".padStart(12) +
      "Cost".padStart(12) +
      "% Value".padStart(12) +
      "% Cost".padStart(12) +
      "% Quantity".padStart(12) +
      "     Name"
  );
  for (const item of inventoryArr) {
    const percentValue = ((item.value / totalValue) * 100).toFixed(2);
    const percentCost = (item.cost / totalCost) * 100;
    const percentQuantity = (item.quantity / totalQuanity) * 100;

    console.log(
      item.value.toFixed(2).padStart(12) +
        item.quantity.toFixed(0).padStart(12) +
        item.cost.toFixed(2).padStart(12) +
        percentValue.padStart(12) +
        percentCost.toFixed(2).padStart(12) +
        percentQuantity.toFixed(2).padStart(12) +
        "     " +
        item.name.split("-").splice(1).join(" ")
    );
  }
};

main();
