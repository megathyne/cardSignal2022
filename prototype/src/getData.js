const fs = require("fs/promises");
const FS = require("fs");
const axios = require("axios");
const { setTimeout } = require("timers/promises");
const { boxTypes } = require("./constants");

const WAIT = 8000;

async function getSealed() {
  try {
    const response = await axios.get("https://api.mtgstocks.com/sealed");
    return response.data;
  } catch (error) {
    console.log(error.data);
  }
}

async function getSealedDetails(id) {
  try {
    const response = await axios.get(`https://api.mtgstocks.com/sealed/${id}`);
    return response.data;
  } catch (error) {
    console.log(error.data);
  }
}

async function getSealedPrices(id) {
  try {
    const response = await axios.get(
      `https://api.mtgstocks.com/sealed/${id}/prices`
    );
    return response.data;
  } catch (error) {
    console.log(error.data);
  }
}

async function getExpectedValue(id) {
  try {
    const response = await axios.get(
      `https://api.mtgstocks.com/card_sets/${id}/ev`
    );
    return response.data;
  } catch (error) {
    console.log(error.code);
    return false;
  }
}

async function main() {
  const today = new Date().toJSON().split("T")[0];
  var masterDir = `./data/${today}`;

  if (!FS.existsSync(masterDir)) {
    FS.mkdirSync(masterDir);
  }

  const sealedOverview = await getSealed();
  const fileName = `./data/${today}/SEALED_OVERVIEW_${today}.json`;
  await fs.writeFile(fileName, JSON.stringify(sealedOverview));

  const evDir = `${masterDir}/ev`;
  if (!FS.existsSync(evDir)) {
    FS.mkdirSync(evDir);
  }

  for (const master of sealedOverview) {
    const evFile = `${evDir}/${master.slug}-${today}.json`;
    try {
      console.log("FINDING: ", evFile);
      await fs.readFile(evFile);
      console.log("FOUND: ", evFile);
    } catch (error) {
      console.log("FETCHING: ", evFile);
      await setTimeout(WAIT, "result");
      const masterEv = await getExpectedValue(master.id);
      if (masterEv !== false) {
        console.log("FETCHED: ", evFile);
        console.log("SAVING: ", evFile);
        await fs.writeFile(evFile, JSON.stringify(masterEv));
        console.log("SAVED: ", evFile);
      } else {
        console.log("FAILURE: ", evFile);
      }
    }
  }

  const fetchList = sealedOverview.reduce(
    (p, masterItem) =>
      p.concat(
        masterItem.products.map(({ id, name, slug }) => ({ id, name, slug }))
      ),
    []
  );

  for (const item of fetchList) {
    const setDetails = `./data/${today}/${item.slug}-${today}.json`;
    const setPrices = `./data/${today}/${item.id}-prices-${today}.json`;

    if (boxTypes.includes(item.name)) {
      try {
        console.log("FINDING: ", setDetails);
        await fs.readFile(setDetails);
        console.log("FOUND: ", setDetails);

        console.log("FINDING: ", setPrices);
        await fs.readFile(setPrices);
        console.log("FOUND: ", setPrices);
      } catch (error) {
        await setTimeout(WAIT, "result");
        console.log("FETCHING: ", setDetails);
        const details = await getSealedDetails(item.id);
        console.log("FETCHED: ", setDetails);
        console.log("SAVING: ", setDetails);
        await fs.writeFile(setDetails, JSON.stringify(details));
        console.log("SAVED: ", setDetails);

        await setTimeout(WAIT, "result");
        console.log("FETCHING: ", setPrices);
        const prices = await getSealedPrices(item.id);
        console.log("FETCHED: ", setPrices);
        console.log("SAVING: ", setPrices);
        await fs.writeFile(setPrices, JSON.stringify(prices));
        console.log("SAVED: ", setPrices);
      }
    }
  }
}

main();
