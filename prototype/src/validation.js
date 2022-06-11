const { MtgData } = require("./lib");
const { boxTypes, msrpLookup, priceTypes } = require("./constants");
const MAX_DATA_PERIOD = 27;

async function getAndPrepMasterProductList(mtgData) {
  // Get All Master Products
  const masterProducts = (await mtgData.getMasterProducts()).data;
  return masterProducts.map((m) => {
    m.anniversaryDates = [];
    // Get all annual anniversary dates for every product till 2022
    for (let i = 0; i < MAX_DATA_PERIOD; i++) {
      const year = i;
      if (i === 0) {
        const date = new Date(m.date);
        m.anniversaryDates.push({ year, date: date.toJSON().split("T")[0], manualValue: 0 });
      } else {
        const date = new Date(new Date(m.date).setFullYear(new Date(m.date).getFullYear() + i));
        if (date.getFullYear() <= "2022") m.anniversaryDates.push({ year, date: date.toJSON().split("T")[0], manualValue: 0 });
      }
    }
    return m;
  });
}

async function main() {
  const mtgData = new MtgData("2022-06-08");

  const masterProducts = await getAndPrepMasterProductList(mtgData);

  const productList = masterProducts.reduce(
    (p, c) =>
      p.concat(
        ...c.products
          .filter((item) => boxTypes.includes(item.name))
          .map((item, i) => {
            item.anniversaryDates = [...c.anniversaryDates];
            if (i === 0) {
              item.anniversaryDates[0].manualValue = msrpLookup[item.slug];
            }
            return item;
          })
          .map(({ slug, anniversaryDates }) => ({ slug, anniversaryDates }))
      ),
    []
  );

  let lookup = {};
  productList.forEach(({ slug, anniversaryDates }) => {
    lookup[slug] = anniversaryDates;
  });


  lookup['496-strixhaven-school-of-mages-set-booster-display'][1].manualValue = 92.98
  lookup['661-strixhaven-school-of-mages-draft-booster-box'][1].manualValue = 93.15


}

main();
