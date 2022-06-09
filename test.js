
const prices =  {

}



let position;
const averageRange = [];
const averageData = prices.average.find((f, i) => {
  averagePosition = i;
  return f[0] === anniversaryDateUnix;
});

for (let index = averagePosition - 5; index < averagePosition - 5; index++) {
  const element = prices.average[index];
  if(element) averageRange.push(element[1])
}

if (averageData) {
  const price = averageData[1];
  const change = ((price - msrpLookup[slug]) / msrpLookup[slug]) * 100;
  const data = { year, date, price, change };

  product.childPrices.average.push(data);
  intervalLookup[i].average.push({ slug, change: data.change });
}