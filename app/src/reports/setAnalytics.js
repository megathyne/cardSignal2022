const processData = require("../processData");

const main = async () => {
  console.log("================================================");
  console.log("==========   SET ANALYTICS   =============");
  console.log("================================================");
  const data = await processData();

  let heading = "YTD".padStart(10);
  heading += "0".padStart(10);
  heading += "15".padStart(10);
  heading += "30".padStart(10);
  heading += "60".padStart(10);
  heading += "90".padStart(10);
  heading += "120".padStart(10);
  heading += "150".padStart(10);
  heading += "       SET";
  console.log(heading);

  for (const set in data) {
    const { ytd, analyticPrices } = data[set];

    const val000 = analyticPrices[0] ? analyticPrices[0][1].toFixed(2) : "";
    const val015 = analyticPrices[1] ? analyticPrices[1][1].toFixed(2) : "";
    const val030 = analyticPrices[2] ? analyticPrices[2][1].toFixed(2) : "";
    const val060 = analyticPrices[3] ? analyticPrices[3][1].toFixed(2) : "";
    const val090 = analyticPrices[4] ? analyticPrices[4][1].toFixed(2) : "";
    const val120 = analyticPrices[5] ? analyticPrices[5][1].toFixed(2) : "";
    const val150 = analyticPrices[6] ? analyticPrices[6][1].toFixed(2) : "";

    let row = (ytd[1] ? ytd[1].toFixed(2) : "").padStart(10);
    row += val000.padStart(10);
    row += val015.padStart(10);
    row += val030.padStart(10);
    row += val060.padStart(10);
    row += val090.padStart(10);
    row += val120.padStart(10);
    row += val150.padStart(10);
    row += "       " + set.split("-").splice(1).join(" ");
    console.log(row);
  }
};

main();
