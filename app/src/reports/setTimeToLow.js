const processData = require("../processData");

const main = async () => {
  console.log("================================================");
  console.log("=============   SET TIME TO LOW   ===============");
  console.log("================================================");
  const data = await processData();

  const output = [];
  for (const slug in data) {
    if (data[slug].prices) {
      const result = data[slug].prices.market.reduce(
        function (prev, current) {
          return prev[1] < current[1] ? prev : current;
        },
        [null, 99999999]
      );

      const oldest = data[slug].prices.market[0];

      if (result[0] && oldest[0]) {
        const timeToLow = (result[0] - new Date(data[slug].set.date).getTime()) / (1000 * 60 * 60 * 24);
        output.push([
          data[slug].set.date,
          new Date(oldest[0]).toJSON().split("T")[0],
          new Date(result[0]).toJSON().split("T")[0],
          result[1],
          timeToLow,
          slug.split("-").splice(1).join(" "),
        ]);
      }
    }
  }
  console.log(
    "Release Date".padEnd(18) +
      "Oldest Price".padEnd(18) +
      "Date of Low".padEnd(15) +
      "Price of Low".padStart(12) +
      "Time to Low".padStart(15) +
      "   Set Name"
  );
  output
    .sort((a, b) => (a[2] > b[2] ? -1 : 1))
    .forEach((item) => {
      console.log(
        item[0].padEnd(18) +
          item[1].padEnd(18) +
          item[2].padEnd(15) +
          item[3].toFixed(2).padStart(12) +
          item[4].toFixed(0).padStart(15) +
          ("   " + item[5])
      );
    });
};

main();
