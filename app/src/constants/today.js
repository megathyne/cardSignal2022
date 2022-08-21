// const TODAY = "2022-08-15";

const tzoffset = new Date().getTimezoneOffset() * 60000; //offset in milliseconds
const localISOTime = new Date(Date.now() - tzoffset).toISOString().slice(0, -1);
const TODAY = localISOTime.split("T")[0];
console.log(TODAY);

module.exports = TODAY;
