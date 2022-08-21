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

  const PRICE_LIMIT = 15;
  const EXCLUSION_LIST = [
    "Alpha Edition",
    "Beta Edition",
    "Unlimited Edition",
    "Judge Promos",
    "From the Vault: Relics",
    "Prerelease Cards",
    "Duel Decks: Phyrexia vs. the Coalition",
    "Magic Player Rewards",
  ];

  const mtgData = new MtgData(TODAY);
  const reserveList = (await mtgData.getReserveList()).data.prints
    .map(({ name, latest_prices, card_set }) => ({
      name,
      price: latest_prices.market,
      set: card_set.name,
    }))
    .filter((f) => !EXCLUSION_LIST.includes(f.set));

  const buffer = await fs.readFile(`${__dirname}/../inventory/reservelist.csv`);
  const csvStr = buffer.toString();
  const reserveListInventoryRaw = (await csv({ noheader: false, output: "csv" }).fromString(csvStr)).map((item) => ({
    name: item[0],
    set: item[1],
    quantity: item[2],
  }));

  const missing = reserveList
    .filter((f) => f.price)
    .sort((a, b) => (a.price > b.price ? 1 : -1))
    .filter((f) => {
      const item = reserveListInventoryRaw.find((r) => f.name === r.name && f.set === r.set);
      if (item) return false;
      return true;
    })
    .filter((f) => f.price <= PRICE_LIMIT);

  console.log("NAME".padEnd(35) + "PRICE".padStart(7) + "SET".padStart(20));
  missing.forEach(({ name, price, set }) => {
    console.log(name.padEnd(35) + price.toFixed(2).padStart(7) + set.padStart(20));
  });
  console.log("-----------------------------------------------------");

  for (const date of files) {
    try {
      const mtgData = new MtgData(date);
      const reserveList = (await mtgData.getReserveList()).data.prints
        .map(({ name, latest_prices, card_set }) => ({
          name,
          price: latest_prices.market,
          set: card_set.name,
        }))
        .filter((f) => !EXCLUSION_LIST.includes(f.set));

      const buffer = await fs.readFile(`${__dirname}/../inventory/reservelist.csv`);
      const csvStr = buffer.toString();
      const reserveListInventoryRaw = (await csv({ noheader: false, output: "csv" }).fromString(csvStr)).map((item) => ({
        name: item[0],
        set: item[1],
        quantity: item[2],
      }));

      const missing = reserveList
        .filter((f) => f.price)
        .filter((f) => {
          const item = reserveListInventoryRaw.find((r) => f.name === r.name && f.set === r.set);
          if (item) return false;
          return true;
        })
        .filter((f) => f.price <= PRICE_LIMIT);

      console.log(
        date.padStart(10),
        missing
          .reduce((p, c) => (p += c.price), 0)
          .toFixed(2)
          .padStart(10),
        missing.length.toFixed(0).padStart(10)
      );
    } catch (error) {
      // console.log(error);
    }
  }

  // const mtgData = new MtgData(TODAY);
  // const reserveList = (await mtgData.getReserveList()).data;
  // const reserveListLookup = reserveList.prints.reduce((p, c) => {
  //   if (p[c.name]) p[c.name].push(c);
  //   else p[c.name] = [c];
  //   return p;
  // }, {});

  // const buffer = await fs.readFile(`${__dirname}/../inventory/reservelist.csv`);
  // const csvStr = buffer.toString();
  // const reserveListInventoryRaw = await csv({ noheader: false, output: "csv" })
  //   .fromString(csvStr)
  //   .map((item) => item({ name: item[0], set: item[1], quantity: item[2] }));

  // const reserveListInventoryLookup = reserveListInventoryRaw
  //   .map((item) => ({ name: item[0], set: item[1], quantity: item[2] }))
  //   .sort((a, b) => (a.name > b.name ? 1 : -1))
  //   .reduce((p, c) => {
  //     p[c.name] = c;
  //     return p;
  //   }, {});

  // const missingCards = Object.keys(reserveListLookup)
  //   .filter((key) => !reserveListInventoryLookup[key])
  //   .map((name) => reserveListLookup[name])
  //   .map((item) => item.map(({ name, latest_prices, card_set }) => ({ name, price: latest_prices.market, set: card_set.name })))
  //   .reduce((p, c) => {
  //     p.push(...c);
  //     return p;
  //   }, [])
  //   .sort((a, b) => (a.price > b.price ? 1 : -1))
  //   .filter((item) => item.price)
  //   .filter((item) => item.price <= 4)
  //   .filter(
  //     ({ set }) =>
  //       ![
  //         "Alpha Edition",
  //         "Beta Edition",
  //         "Unlimited Edition",
  //         "Judge Promos",
  //         "From the Vault: Relics",
  //         "Prerelease Cards",
  //         "Duel Decks: Phyrexia vs. the Coalition",
  //         "Magic Player Rewards",
  //       ].includes(set)
  //   );

  // console.log("-----------------------------------------------------");
  // const count = missingCards.length;
  // const value = missingCards.reduce((p, c) => (p += c.price), 0);
  // console.log("COUNT: " + count.toFixed(0).padStart(5) + "                 VALUE: " + value.toFixed(2).padStart(5));
};

main();
