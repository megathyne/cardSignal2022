const { inventory } = require("../constants/index");

const main = async () => {
  console.log("================================================");
  console.log("=========   INVENTORY COSTS REPORT   ===========");
  console.log("================================================");

  const inventoryBySet = inventory
    // .sort((a, b) => (a.name.split("-").splice(1).join(" ") > b.name.split("-").splice(1).join(" ") ? 1 : -1))
    .map((item) => {
      item.costPerItem = item.paid / item.quantity;
      return item;
    })
    .reduce((p, c) => {
      if (p[c.name]) p[c.name].push(c);
      else p[c.name] = [c];
      return p;
    }, {});

  const col1 = 4;
  const col2 = 9;
  const col3 = 18;
  const col4 = 18;
  const col5 = 28;
  const col6 = 6;

  console.log(
    "QTY".padStart(col1) +
      "AVG".padStart(col2) +
      "LOW DATE".padStart(col3) +
      "LOW PRICE".padStart(col4) +
      "LOW SOURCE".padStart(col5) +
      "".padStart(col6) +
      "SET"
  );

  const data = [];
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

    data.push({
      qty: setAverage.q,
      avg: setAverage.p / setAverage.q,
      date,
      costPerItem,
      source,
      set,
    });

    // const line =
    //   setAverage.q.toFixed(0).padStart(col1) +
    //   (setAverage.p / setAverage.q).toFixed(2).padStart(col2) +
    //   date.padStart(col3) +
    //   costPerItem.toFixed(2).padStart(col4) +
    //   source.padStart(col5) +
    //   "".padStart(col6) +
    //   set.split("-").splice(1).join(" ");

    // console.log(line);
  }

  data
    .sort((a, b) => (a.avg > b.avg ? 1 : -1))
    .forEach(({ qty, avg, date, costPerItem, source, set }) => {
      console.log(
        qty.toFixed(0).padStart(col1) +
          avg.toFixed(2).padStart(col2) +
          date.padStart(col3) +
          costPerItem.toFixed(2).padStart(col4) +
          source.padStart(col5) +
          "".padStart(col6) +
          set.split("-").splice(1).join(" ")
      );
    });
};

main();
