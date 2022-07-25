const { inventory } = require("../constants/index");

const main = async () => {
  console.log("================================================");
  console.log("=========   INVENTORY COSTS REPORT   ===========");
  console.log("================================================");

  const inventoryBySet = inventory
    .map((item) => {
      item.costPerItem = item.paid / item.quantity;
      return item;
    })
    .reduce((p, c) => {
      if (p[c.name]) p[c.name].push(c);
      else p[c.name] = [c];
      return p;
    }, {});

  for (const set in inventoryBySet) {
    const setAverage = inventoryBySet[set].reduce(
      (p, c) => {
        p.p += c.paid;
        p.q += c.quantity;
        return p;
      },
      { p: 0, q: 0 }
    );

    const lowest = inventoryBySet[set]
      .sort((a, b) => (a.costPerItem > b.costPerItem ? 1 : -1))
      .map(({ date, source, costPerItem }) => ({ date, source, costPerItem }))[0];

    const { date, source, costPerItem } = lowest;

    console.log(`${set}, ${setAverage.q}, ${(setAverage.p / setAverage.q).toFixed(2)}, ${date}, ${costPerItem.toFixed(2)}, ${source}`);
  }
};

main();
