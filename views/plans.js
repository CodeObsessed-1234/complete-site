let cart = document.getElementById("cart");
console.log("hi");
function add(e) {
  let choosenOne = document.createElement('div');
  choosenOne.className = "choosenOne";
  let p = document.createElement('p');
  p.innerText = e.id;
  choosenOne.appendChild(p);
  cart.appendChild(choosenOne);
}
const data = require("mysql")
