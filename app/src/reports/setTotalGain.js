const { msrpLookup } = require("../constants");
const processData = require("../processData");

function getGain(current, original) {
  return ((current - original) / original) * 100;
}

function parseDate(dateNumber) {
  return new Date(dateNumber).toJSON().split("T")[0];
}

const main = async () => {
  console.log("================================================");
  console.log("==========      SET TOTAL GAIN     =============");
  console.log("================================================");
  const data = await processData();

  const results = [];
  for (const set in data) {
    const { ytd, analyticPrices } = data[set];

    const mid = data[set].prices.market.find((data) => parseDate("2022-07-01") === parseDate(data[0]));
    const current = data[set].prices.market.find((p) => parseDate(new Date(data[set].today)) === parseDate(p[0]));
    let midYTD;
    if (mid && current) {
      const ytdGain = ((current[1] - mid[1]) / mid[1]) * 100;
      midYTD = [data[set].product.slug, ytdGain, current[1] - mid[1]];
    } else midYTD = [null, null, null];

    const val000 = analyticPrices[0];
    if (val000) {
      const age = 2022 - new Date(data[set].set.date).getFullYear();
      if (age >= 1) {
        const cagr = (Math.pow(val000[1] / msrpLookup[set], 1 / age) - 1) * 100;
        const totalGain = getGain(val000[1], msrpLookup[set]);

        results.push({ midYTD: midYTD[1] || 0, ytd: ytd[1] || 0, age, totalGain, cagr, set });
      } else {
        const totalGain = getGain(val000[1], msrpLookup[set]);
        results.push({ midYTD: midYTD[1] || 0, ytd: 0, age, totalGain, cagr: 0, set });
      }
    }
  }

  console.log(
    "YTD".padStart(7) +
      "MID-YTD".padStart(10) +
      "Age".padStart(10) +
      "   " +
      "Total Gain".padStart(10) +
      "CAGR".padStart(10) +
      "   " +
      "SET NAME"
  );
  results
    .sort((a, b) => (a.age > b.age ? 1 : -1))
    .forEach(({ ytd, midYTD, age, totalGain, cagr, set }) => {
      console.log(
        ytd.toFixed(2).padStart(7) +
          midYTD.toFixed(2).padStart(10) +
          age.toFixed(0).padStart(10) +
          "   " +
          totalGain.toFixed(2).padStart(10) +
          cagr.toFixed(2).padStart(10) +
          "   " +
          set.split("-").splice(1).join(" ")
      );
    });
};

main();
