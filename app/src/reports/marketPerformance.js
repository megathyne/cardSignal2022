const processData = require("../processData");

const main = async () => {
  console.log("================================================");
  console.log("==========   MARKET PERFORMANCE   ==============");
  console.log("================================================");
  const data = await processData();

  const filter = [
    "2883-kamigawa-neon-dynasty-set-booster-display",
    "2880-kamigawa-neon-dynasty-draft-booster-box",
    "2877-innistrad-double-feature-draft-booster-box",
    "2023-innistrad-crimson-vow-set-booster-display",
    "2020-innistrad-crimson-vow-draft-booster-box",
    "1955-innistrad-midnight-hunt-set-booster-display",
    "1949-innistrad-midnight-hunt-draft-booster-box",
    "963-adventures-in-the-forgotten-realms-set-booster-display",
    "958-adventures-in-the-forgotten-realms-draft-booster-box",
    "422-modern-horizons-2-set-booster-display",
    "437-modern-horizons-2-draft-booster-box",
    "496-strixhaven-school-of-mages-set-booster-display",
    "661-strixhaven-school-of-mages-draft-booster-box",
    "535-time-spiral-remastered-draft-booster-box",
    "406-kaldheim-set-booster-display",
    "258-kaldheim-draft-booster-box",
    "73-commander-legends-draft-booster-box",
    "707-zendikar-rising-set-booster-display",
    "599-zendikar-rising-draft-booster-box",
    "107-double-masters-booster-box",
    "253-jumpstart-booster-box",
    "80-core-set-2021-booster-box",
    "239-ikoria-lair-of-behemoths-booster-box",
    "521-theros-beyond-death-booster-box",
    "512-throne-of-eldraine-booster-box",
    "92-core-set-2020-booster-box",
    "368-modern-horizons-booster-box",
    "606-war-of-the-spark-booster-box",
    "452-ravnica-allegiance-booster-box",
    "533-ultimate-masters-booster-box",
    "236-guilds-of-ravnica-booster-box",
    "51-core-set-2019-booster-box",
    "61-battlebond-booster-box",
    "102-dominaria-booster-box",
  ];

  let totalVal000 = 0;
  let totalVal015 = 0;
  let totalVal030 = 0;
  let totalVal060 = 0;
  let totalVal090 = 0;
  let totalVal120 = 0;
  let totalVal150 = 0;

  let totalVal015Counter = 0;
  let totalVal000Counter = 0;
  let totalVal030Counter = 0;
  let totalVal060Counter = 0;
  let totalVal090Counter = 0;
  let totalVal120Counter = 0;
  let totalVal150Counter = 0;

  for (const set in data) {
    if (filter.includes(set)) {
      const { analyticPrices } = data[set];

      if (analyticPrices[0]) {
        totalVal000 += analyticPrices[0][1];
        totalVal000Counter++;
      }
      if (analyticPrices[1]) {
        totalVal015 += analyticPrices[1][1];
        totalVal015Counter++;
      }
      if (analyticPrices[2]) {
        totalVal030 += analyticPrices[2][1];
        totalVal030Counter++;
      }
      if (analyticPrices[3]) {
        totalVal060 += analyticPrices[3][1];
        totalVal060Counter++;
      }
      if (analyticPrices[4]) {
        totalVal090 += analyticPrices[4][1];
        totalVal090Counter++;
      }
      if (analyticPrices[5]) {
        totalVal120 += analyticPrices[5][1];
        totalVal120Counter++;
      }
      if (analyticPrices[6]) {
        totalVal150 += analyticPrices[6][1];
        totalVal150Counter++;
      }
    }
  }

  console.log(`Counter Debug: ${filter.length} Filter Count`);
  console.log(`Counter Debug: ${totalVal000Counter} Total 000: ${totalVal000.toFixed(2)} `);
  console.log(`Counter Debug: ${totalVal015Counter} Total 015: ${totalVal015.toFixed(2)} `);
  console.log(`Counter Debug: ${totalVal030Counter} Total 030: ${totalVal030.toFixed(2)} `);
  console.log(`Counter Debug: ${totalVal060Counter} Total 060: ${totalVal060.toFixed(2)} `);
  console.log(`Counter Debug: ${totalVal090Counter} Total 090: ${totalVal090.toFixed(2)} `);
  console.log(`Counter Debug: ${totalVal120Counter} Total 120: ${totalVal120.toFixed(2)} `);
  console.log(`Counter Debug: ${totalVal150Counter} Total 150: ${totalVal150.toFixed(2)} `);
};

main();
