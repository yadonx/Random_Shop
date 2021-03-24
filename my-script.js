let $cartCounter = 0

let $cart = JSON.parse(localStorage.getItem("cart"))
if ($cart == null)
  $cart = new Array()
updateCartIcon()

function indexTable() {
  $("#shopCartText").text($cartCounter)
  const $products = $("#products")
  fetch('http://webacademy.se/fakestore/')
    .then(res => res.json())
    .then(data => generateHtml(data))
    .catch(err => console.error(error));


  const generateHtml = (data) => {

    data.forEach(element => {
      var $row = `
          <div class="card border-danger mb-3 col-md-6 col-sd-1">
            <div class="card-header text-center" style="font-size: 1.3rem" id="title">${element.title}</div>
              <div class="card-body">
                <div> <img  class="img-thumbnail" src="${element.image}"  alt="jadu"></div>
                <div> <p>${element.description} </p></div>
                <br>
                <div class="buy"> <p>Pris: <span>${element.price.toFixed(2)}</span> € 
                <button class="btn btn-danger btnFunk" style="margin-left: 1rem;" id="${element.id}">Add to cart</Button></p>
                </div>
            </div>
            </div>`
      $products.append($row)
    })
    $(".btnFunk").click(addToCart)
  }
}

function orderTable(){
  $("#shopCartText").text($cartCounter)
  sendOrder()
  const $products = $("#products")
  let $sum = 0
  if ($cart.length != 0){
  $cart.forEach(element => {
  var $row = `    
  <tr class="product-row" class="table-dark">
    <td>${element.title}</td>
    <td id="amount"><a class="btn btn-danger decrease-btn" id="${element.id}">-</a> <span>${element.amount}</span> <a class="btn btn-danger increase-btn" id="${element.id}">+</a></td>
    <td id="price"><span>${element.price}</span> € <a class="btn btn-danger float-right remove-btn" id="${element.id}">X</a></td>
  </tr>
   `
        $products.append($row)
        $sum += element.price * element.amount
      })

$(".remove-btn").click(removeProduct)
$(".increase-btn").click(increaseAmount)
$(".decrease-btn").click(decreaseAmount)
} else
$("#form").hide()
var $row = `    
<tr class="table-dark">
<td>Total price: </td>
<td></td>
<td><span id="sum">${$sum.toFixed(2)}</span> €</td>
</tr>`
$products.append($row)
}

function sendOrder(){
$("#sendOrderBtn").click(function(){
  let $phonenr = $("#input-phonenr")
  let $name = $("#input-name")
  let $adress = $("#input-adress")
  let $email = $("#input-email")
  $("input:hidden").val(null);
  if($cartCounter == 0){
  alert("The cart is empty!")
  clearFields($name,$phonenr,$adress,$email)
}else if($phonenr.val() == "" || $email.val() == "" || $adress.val() == "" || $name.val() == ""){
    alert("Fill in all the red fields!")
    if($name.val() == "")
    $name.addClass("fail")
    if($phonenr.val() == "")
    $phonenr.addClass("fail")
    if($adress.val() == "")
    $adress.addClass("fail")
    if($email.val() == "")
    $email.addClass("fail")
    
  }else{
    // Här ska en funktion för att skicka order till kund / db xD
    alert("Thanks for ordering!\nOrder sent to: " + $email.val() + "\nName: " + $name.val() +"\nAdress: " + $adress.val())
    clearFields($name,$phonenr,$adress,$email)
    clearCart()
    $("#shopCartText").text($cartCounter)
    clearOrder()
}
})
}

function clearOrder(){
  $(".product-row").empty()
  $("#sum").text(0.00.toFixed(2))
}

function clearFields($name,$phonenr,$adress,$email){
  $name.removeClass("fail")
  $name.val("")
  $phonenr.removeClass("fail")
  $phonenr.val("")
  $adress.removeClass("fail")
  $adress.val("")
  $email.removeClass("fail")
  $email.val("")
  $("#form").hide()
}

function updateOrder(element, op) {
  let $amount = Number($(element).parent().parent().children("#amount").children("span").text())
  let $amountTxt = $(element).parent().parent().children("#amount").children("span")
  let $price = Number($(element).parent().parent().children("#price").children("span").text())
  let $sum = Number($("#sum").text())
  

  if (op == "x") {
    $sum -= ($amount * $price)
    $cartCounter -= $amount
    removeRow(element)
  } else if (op == "+") {
    $sum += $price
    $amountTxt.text(++$amount)
    $cartCounter += 1
  } else {
    $sum -= $price
    $amountTxt.text(--$amount)
    $cartCounter -= 1
    if($amount == 0)
    removeRow(element)
  }


  $("#sum").text($sum.toFixed(2))
  $("#shopCartText").text($cartCounter)
}

function removeRow(element){
  $cart = $cart.filter(item => item.id != element.id) 
  $(element).parent().parent().remove()
}

function removeProduct() {
  updateOrder(this, "x")
  saveCart()
}

function decreaseAmount() {
  $cart.find(item => item.id == this.id).amount--
  updateOrder(this, "-")
  saveCart()
}

function increaseAmount() {
  updateOrder(this, "+")
  $cart.find(item => item.id == this.id).amount++
  saveCart()
}

function updateCartIcon() {
  $cart.forEach(element => {
    $cartCounter += element.amount
  })
  
}

function addToCart() {
  const $id = this.id
  const $this = $(this)
  var $product = $cart.find(item => item.id == $id)
  if ($product == undefined)
    $cart.push({"id": $id, 
    "amount": 1, 
    "title": $this.parent().parent().parent().parent().children("#title").text(), 
    "price": $this.parent().children("span").text()})
  else
    $product.amount += 1
  $("#shopCartText").text(++$cartCounter)
  saveCart()
}

function saveCart() {
  localStorage.setItem("cart", JSON.stringify($cart))
}

function clearCart() {
  localStorage.removeItem("cart")
  $cart = new Array()
  $cartCounter = 0
  console.log("cart cleared")
}

function viewPort() {
  if (document.documentElement.clientWidth < 500) {
    $("#body").toggleClass("container")
    $("#div-products").toggleClass("container")
  }
}