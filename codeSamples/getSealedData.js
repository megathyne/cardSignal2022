const fs = require("fs/promises");
const axios = require("axios");

async function main() {
  const response = await axios.get("https://api.mtgstocks.com/sealed");
  await fs.writeFile(`./${new Date().toJSON()}.json`, JSON.stringify(response.data));
}

main();
