const processData = require("../processData");

const main = async () => {
  console.log("================================================");
  console.log("==========   SET ANALYTICS   =============");
  console.log("================================================");
  const data = await processData();

  const col1 = 10;

  let heading = "YTD".padStart(col1);
  heading += "0".padStart(col1);
  heading += "15".padStart(col1);
  heading += "30".padStart(col1);
  heading += "60".padStart(col1);
  heading += "90".padStart(col1);
  heading += "120".padStart(col1);
  heading += "150".padStart(col1);
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
    row += val000.padStart(col1);
    row += val015.padStart(col1);
    row += val030.padStart(col1);
    row += val060.padStart(col1);
    row += val090.padStart(col1);
    row += val120.padStart(col1);
    row += val150.padStart(col1);
    row += "       " + set.split("-").splice(1).join(" ");
    console.log(row);
  }
};

main();
