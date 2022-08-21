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
    console.log(set.name.split("-").splice(1).join(" "));
    console.log("AVERAGE COST:".padEnd(10) + ("$" + (set.setAverage.p / set.setAverage.q).toFixed(2)).padStart(10));
    console.log("QUANTITY:".padEnd(10) + set.setAverage.q.toFixed(0).padStart(10));
    console.log("ITEMS:");
    set.items
      .sort((a, b) => (a.costPerItem > b.costPerItem ? 1 : -1))
      .map(({ date, source, costPerItem, quantity }) => ({ date, source, costPerItem, quantity }))
      .forEach(({ date, source, costPerItem, quantity }) => {
        console.log("    " + date + quantity.toFixed(0).padStart(6) + costPerItem.toFixed(2).padStart(9) + "      " + source);
      });
    console.log(" ");
  }
};

main();
