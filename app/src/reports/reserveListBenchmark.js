const fs = require("fs/promises");
const { TODAY } = require("../constants");
const { MtgData } = require("../lib");

const BENCHMARK_LIST = [
  // Sliver Queen
  // word of command
  { slug: "8999-gaea-s-cradle" }, // LAND add underground sea
  { slug: "8604-academy-rector" }, // WHITE
  { slug: "9646-humility" }, // WHITE
  { slug: "9960-peacekeeper" }, // WHITE
  { slug: "8702-replenish" }, // WHITE
  { slug: "10159-tithe" }, // WHITE
  { slug: "15502-copy-artifact" }, // BLUE
  { slug: "9650-intuition" }, // BLUE
  { slug: "9285-mind-over-matter" }, // BLUE
  { slug: "8823-palinchron" }, // BLUE
  { slug: "11842-power-artifact" }, // BLUE
  { slug: "11866-transmute-artifact" }, // BLUE
  { slug: "9174-time-spiral" }, // BLUE
  { slug: "16013-timetwister" }, // BLUE -- remove
  { slug: "9562-corpse-dance" }, // BLACK
  { slug: "10436-shallow-grave" }, // BLACK
  { slug: "20721-yawgmoth-s-will" }, // BLACK
  { slug: "15554-fork" }, // RED
  { slug: "15744-wheel-of-fortune" }, // RED
  { slug: "9589-earthcraft" }, // GREEN
  { slug: "9350-survival-of-the-fittest" }, // GREEN
  { slug: "8792-grim-monolith" }, // ARTIFACT
  { slug: "9442-mox-diamond" }, // ARTIFACT
  { slug: "10345-lion-s-eye-diamond" }, // ARTIFACT
  { slug: "8810-memory-jar" }, // ARTIFACT
  { slug: "9955-null-rod" }, // ARTIFACT
];

const main = async () => {
  console.log("====================================================");
  console.log("============   RESERVE LIST BENCHMARK   ============");
  console.log("====================================================");

  const files = await fs.readdir("../../data");
  files.sort((a, b) => (new Date(a).getTime() > new Date(b).getTime() ? 1 : -1));

  for (const date of files) {
    try {
      const mtgData = new MtgData(date);
      const rlPrices = (await mtgData.getReserveList()).data.prints;

      const bechmarkEnriched = BENCHMARK_LIST.map((b) => {
        const card = rlPrices.find((f) => f.slug === b.slug);
        return { name: card.name, set: card.card_set.name, price: card.latest_prices.market, date: TODAY };
      });

      let total = 0;
      bechmarkEnriched.forEach((i) => {
        total += i.price;
        const line = i.name.padEnd(25) + i.set.padEnd(20) + i.price.toFixed(2).padStart(10) + "     " + i.date.padStart(10);
        // console.log(line);
      });
      console.log(date + "   ---------------------------------------------------- " + total.toFixed(2).padStart(10));
    } catch (error) {}
  }
};

main();
