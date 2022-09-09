const taxRate = 8.63 / 100; // Suffolk
// const taxRate = 0; // Missouri
// const taxRate = 0;
// const taxRate = 0;
// const taxRate = 0;

const shippingCost = 0;

const shoppingList = [
  { set: "AFR draft", cost: 71.49, quantity: 1 },
];
const totalQuanity = shoppingList.reduce((p, c) => (p += c.quantity), 0);
const shippingPerItem = shippingCost / totalQuanity;

let totalCost = 0;

console.log("taxRate: " + taxRate * 100 + "   shippingCost: " + shippingCost + "   shippingPerItem: " + shippingPerItem);
const heading =
  "NAME".padEnd(15) + "PRICE".padStart(15) + "AFTER TAX".padStart(15) + "AFTER SHIPPING".padStart(20) + "AFTER SHIPPING EACH".padStart(20);
console.log(heading);
shoppingList.forEach(({ set, cost, quantity }) => {
  const afterTax = cost * (1 + taxRate);
  const afterShipping = afterTax + shippingPerItem;
  totalCost += afterShipping;

  const bodyLine =
    set.padEnd(15) +
    cost.toFixed(2).padStart(15) +
    afterTax.toFixed(2).padStart(15) +
    afterShipping.toFixed(2).padStart(20) +
    (afterShipping / quantity).toFixed(2).padStart(20);
  console.log(bodyLine);
});

console.log("Total: " + totalCost.toFixed(2));
