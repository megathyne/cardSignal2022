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

  const col1 = 18,
    col2 = 18,
    col3 = 15,
    col4 = 12,
    col5 = 15;
  console.log(
    "Release Date".padEnd(col1) +
      "Oldest Price".padEnd(col2) +
      "Date of Low".padEnd(col3) +
      "Price of Low".padStart(col4) +
      "Time to Low".padStart(col5) +
      "   Set Name"
  );
  output
    .sort((a, b) => (a[2] > b[2] ? -1 : 1))
    .forEach((item) => {
      console.log(
        item[0].padEnd(col1) +
          item[1].padEnd(col2) +
          item[2].padEnd(col3) +
          item[3].toFixed(2).padStart(col4) +
          item[4].toFixed(0).padStart(col5) +
          ("   " + item[5])
      );
    });
};

main();
