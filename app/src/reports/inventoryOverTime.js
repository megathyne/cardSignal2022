const { inventory } = require("../constants/index");

const main = async () => {
  console.log("================================================");
  console.log("=========    INVENTORY OVER TIME     ===========");
  console.log("================================================");
  console.log(" ");
  const result = [];

  inventory.forEach((item) => {
    const d = item.date.split("-");
    const lookup = d[0] + "-" + d[1];

    const exists = result.find((f) => f.lookup === lookup);
    if (!exists) {
      result.push({ lookup, inv: [item] });
    } else {
      exists.inv.push(item);
    }
  });

  result
    .sort((a, b) => (a.lookup > b.lookup ? 1 : -1))
    .forEach((item) => {
      const { lookup, inv } = item;
      console.log(
        lookup,
        inv
          .reduce((p, c) => (p += c.quantity), 0)
          .toFixed(0)
          .padStart(12),
        inv
          .reduce((p, c) => (p += c.paid), 0)
          .toFixed(2)
          .padStart(30)
      );

      console.log("---------------------------------------------------");
      inv.forEach((z) => {
        const { quantity, date, paid, source, name } = z;
        console.log(
          quantity.toFixed(0).padStart(20),
          date.padStart(15) + "    ",
          paid.toFixed(2).padStart(10) + "     ",
          source.padEnd(30),
          name.split("-").splice(1).join(" ")
        );
      });
      console.log(" ");
    });
};

main();
