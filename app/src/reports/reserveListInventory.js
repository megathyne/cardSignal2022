const csv = require("csvtojson");
const fs = require("fs/promises");
const { TODAY } = require("../constants");
const { MtgData } = require("../lib");

const main = async () => {
  console.log("====================================================");
  console.log("============    MISSING RESERVE LIST    ============");
  console.log("====================================================");

  const files = await fs.readdir("../../data");
  files.sort((a, b) => (new Date(a).getTime() < new Date(b).getTime() ? 1 : -1));

  const mtgData = new MtgData(TODAY);
  const rlPrices = (await mtgData.getReserveList()).data;

  const buffer = await fs.readFile(`${__dirname}/../inventory/reservelist.csv`);
  const csvStr = buffer.toString();
  const rlInventory = (await csv({ noheader: false, output: "csv" }).fromString(csvStr)).map((item) => ({
    name: item[0],
    set: item[1],
    quantity: item[2],
    value: rlPrices.prints.find((f) => f.name == item[0] && f.card_set.name == item[1]).latest_prices.market,
  }));

  const header = "NAME".padEnd(30) + "SET".padEnd(20) + "QTY".padStart(5) + "MKT PRICE".padStart(15) + "TOTAL".padStart(15);
  console.log(header);
  rlInventory
    .sort((a, b) => (a.name > b.name ? 1 : -1))
    .forEach(({ name, set, quantity, value }) => {
      const line =
        name.padEnd(30) +
        set.padEnd(20) +
        quantity.padStart(5) +
        value.toFixed(2).padStart(15) +
        (value * parseInt(quantity)).toFixed(2).padStart(15);
      console.log(line);
    });

  const totalQty = rlInventory.reduce((p, c) => (p += parseInt(c.quantity)), 0);
  const totalValue = rlInventory.reduce((p, c) => (p += parseInt(c.quantity) * c.value), 0);

  console.log("-------------------------------------------------------------------------------------");
  // console.log(totalQty.toFixed(0).padStart(55) + totalValue.toFixed(2).padStart(30));

  for (const date of files) {
    try {
      const mtgData = new MtgData(date);
      const reserveList = (await mtgData.getReserveList()).data.prints.map(({ name, latest_prices, card_set }) => ({
        name,
        price: latest_prices.market,
        set: card_set.name,
      }));

      const buffer = await fs.readFile(`${__dirname}/../inventory/reservelist.csv`);
      const csvStr = buffer.toString();
      const reserveListInventoryRaw = (await csv({ noheader: false, output: "csv" }).fromString(csvStr)).map((item) => ({
        name: item[0],
        set: item[1],
        quantity: item[2],
      }));

      const actual = reserveListInventoryRaw.filter((f) => {
        const item = reserveList.find((r) => f.name === r.name && f.set === r.set);
        if (item) {
          f.price = item.price;
          return true;
        }
        return false;
      });

      console.log(
        date.padStart(10),
        actual
          .reduce((p, c) => (p += parseInt(c.quantity)), 0)
          .toFixed(0)
          .padStart(44),
        actual
          .reduce((p, c) => (p += c.price * parseInt(c.quantity)), 0)
          .toFixed(2)
          .padStart(29)
      );
    } catch (error) {}
  }
};

main();
