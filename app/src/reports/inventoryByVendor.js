const processData = require("../processData");
const { inventory } = require("../constants/index");

const main = async () => {
  console.log("================================================");
  console.log("==========   INVENTORY BY VENDOR   =============");
  console.log("================================================");

  const inventoryBySetMap = inventory
    .map((item) => {
      item.costPerItem = item.paid / item.quantity;
      return item;
    })
    .reduce((p, c) => {
      if (p[c.name]) p[c.name].items.push(c);
      else p[c.name] = { name: c.name, items: [c] };
      return p;
    }, {});

  const inventoryBySetArray = Object.keys(inventoryBySetMap)
    .map((key) => inventoryBySetMap[key])
    .map((item) => {
      item.setAverage = item.items.reduce(
        (p, c) => {
          p.p += c.paid;
          p.q += c.quantity;
          return p;
        },
        { p: 0, q: 0 }
      );
      return item;
    })
    .sort((a, b) => (a.setAverage.q > b.setAverage.q ? -1 : 1));

  for (const set of inventoryBySetArray) {
    console.log(set.name, set.setAverage.q, (set.setAverage.p / set.setAverage.q).toFixed(2));
    set.items
      .sort((a, b) => (a.costPerItem > b.costPerItem ? 1 : -1))
      .map(({ date, source, costPerItem }) => ({ date, source, costPerItem }))
      .forEach(({ date, source, costPerItem }) => {
        console.log(
          "___________",
          date + "    ",
          costPerItem.toFixed(2).length > 5 ? costPerItem.toFixed(2) : " " + costPerItem.toFixed(2),
          "   " + source
        );
      });
    console.log(" ");
  }
};

main();
