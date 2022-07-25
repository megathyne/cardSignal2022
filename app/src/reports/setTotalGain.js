const { msrpLookup } = require("../constants");
const processData = require("../processData");

function getGain(current, original) {
  return ((current - original) / original) * 100;
}

const main = async () => {
  console.log("================================================");
  console.log("==========      SET TOTAL GAIN     =============");
  console.log("================================================");
  const data = await processData();

  console.log("YTD".padStart(7) + "Age".padStart(10) + "   " + "Total Gain".padStart(10) + "CAGR".padStart(10) + "   " + "SET NAME");
  for (const set in data) {
    const { ytd, analyticPrices } = data[set];

    const val000 = analyticPrices[0];
    if (val000) {
      const age = 2022 - new Date(data[set].set.date).getFullYear();
      if (age >= 1) {
        const cagr = (Math.pow(val000[1] / msrpLookup[set], 1 / age) - 1) * 100;
        const totalGain = getGain(val000[1], msrpLookup[set]);
        console.log(
          (ytd[1] || 0).toFixed(2).padStart(7) +
            age.toFixed(0).padStart(10) +
            "   " +
            totalGain.toFixed(2).padStart(10) +
            cagr.toFixed(2).padStart(10) +
            "   " +
            set.split("-").splice(1).join(" ")
        );
      } else {
        const totalGain = getGain(val000[1], msrpLookup[set]);
        console.log(
          "".padStart(7) +
            age.toFixed(0).padStart(10) +
            "   " +
            totalGain.toFixed(2).padStart(10) +
            "".padStart(10) +
            "   " +
            set.split("-").splice(1).join(" ")
        );
      }
    }
  }
};

main();
