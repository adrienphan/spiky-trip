//Product : Class
class Product{
    constructor(name, picture, alt, reference, price, category){
        this.name = name;
        this.picture = picture;
        this.alt = alt;
        this.reference = reference;
        this.price = price;
        this.category = category;
        this.articleCard = `<div class="article-card">
            <img class="article-image" src="${this.picture}" alt="${this.alt}">
            <div class="card-info">
                <div class="name-price">
                    <div class="name">${this.name}</div>
                    <div class="price">${this.price} €</div>
                </div>
                <div class="ref-add">
                    <div class="ref">${this.reference}</div>
                    <button class="addButton" id="add-${this.reference}">Ajouter au panier</button>
                </div>
            </div>
        </div>`;
        this.cartCard = `<div class="cart-article">
            <p class="cart-article-delete" id="delete-${this.reference}">&times;</p>
            <p class="cart-article-name">${this.name}</p>
            <div class="quantity-container">
                <button class="minusInCart" id="decrease-${this.reference}">-</button>
                <p id="number-${this.reference}"></p>
                <button class="plusInCart" id="increase-${this.reference}">+</button>
            </div>
            <p class="cart-article-price">${this.price}€</p>
        </div>`
    }
}
//Products list : Array
const productList = readLocalStorage("spikyArticles");
//cart Array : contains objects {product : product, quantity : number of the product}
let cart = readLocalStorage("cart");
let total;
/* |**************************|
   |         Elements         |
   |**************************| */
const articlesContainer = document.querySelector("#articles-container");
const categoryList = document.querySelectorAll(".category");
const cartModal = document.getElementById("myCart");
const cartButton = document.getElementById("cartBtn");
const closeModalBtn = document.getElementById("closeModal");
const cartArticles = document.getElementById("cart-articles");
const totalElement = document.getElementById("total");
// const addToCartBtn = document.querySelectorAll(".addButton")
/* |**************************|
   |          Events          |
   |**************************| */
//display category on click
for (const category of categoryList) {
    //removes border-bottom on selected category
    category.addEventListener("click", ()=>{
        categoryList.forEach(element => {
            element.classList.remove("current");
        });
        //displays categories
        if (category.id.match("category1")){
            DisplayCategory(productList.category1);
            category.className = 'category current';
        }
        if (category.id.match("category2")){
            DisplayCategory(productList.category2);
            category.className = 'category current';
        }
        if (category.id.match("category3")){
            DisplayCategory(productList.category3);
            category.className = 'category current';
        }
    });
}
//Open The Cart Modal
cartButton.addEventListener("click", ()=>{
    DisplayCart();
    cartModal.style.display = "block";
});
//Close the Cart Modal when Clicking the X
closeModalBtn.addEventListener("click", ()=>{
    cartModal.style.display = "none";
});
//Close the Cart Modal when clicking outside
document.addEventListener("click", (e)=>{
    if (e.target == cartModal){
        cartModal.style.display = "none";
    }
});
//Call AddToCart when clicking the Add to Cart button
document.addEventListener("click", (e)=>{
    if(e.target.className == "addButton") {
        e.target.style.backgroundColor = "#8396C0";
        e.target.style.color = "#fff"
        setTimeout(() => {
            e.target.style.backgroundColor = "#fff";
            e.target.style.color = "#8396C0"
        }, 200);
        AddToCart(e.target.id.substring(4));
    }
});
//Call DeleteArticleFromCart when clicking the X on an article
document.addEventListener("click", (e)=>{
    if(e.target.id.includes("delete-")){
        const refToDeleteFromCart = e.target.id.substring(7);
        DeleteArticleFromCart(refToDeleteFromCart);
    }
});

document.addEventListener("click", (e)=>{
    if(e.target.className == "plusInCart"){
        const refToIncrease = e.target.id.substring(9);
        IncreaseQuantity(refToIncrease);
    }
})
document.addEventListener("click", (e)=>{
    if(e.target.className == "minusInCart"){
        const refToDecrease = e.target.id.substring(9);
        DecreaseQuantity(refToDecrease);
    }
})
/* |**************************|
   |        Functions         |
   |**************************| */
//Display Category
function DisplayCategory(category){
    articlesContainer.innerHTML = "";
    for (const article of category) {
        card = document.createElement("div");
        card.innerHTML = article.articleCard;
        articlesContainer.appendChild(card);
    }
}
//Add article to Cart
function AddToCart(itemReference){
    let itemCategory = "category" + itemReference.slice(0,1);

    //if cart contains product
    if(cart.filter(e =>{
        return e.product.reference == productList[itemCategory][itemReference.slice(2)].reference;
    }).length > 0) {
        //action if cart contains product
        let productToIncrement = cart.find(obj => {
            return obj.product.reference == itemReference;
        });
        productToIncrement.quantity++;
    } else cart.push({
        //action if cart doesn't contain product
        product : productList[itemCategory][itemReference.slice(2)],
        quantity : 1
    });
    
}
//Fill the Cart Modal with the necessary info
function DisplayCart(){
    //displays/refreshes cart on modal
    cartArticles.innerHTML = "";
    cart.forEach(element => {
        cartDiv = document.createElement("div");
        cartDiv.innerHTML = element.product.cartCard;
        cartArticles.appendChild(cartDiv);
    });
    //displays Total price
    total = 0;
    cart.forEach(element => {
        total += element.product.price*element.quantity
    });
    totalElement.innerHTML = total.toFixed(2) + " €";
    //display number of items
    cart.forEach(element => {
        const numberTarget = document.getElementById("number-" + element.product.reference);
        numberTarget.innerHTML = element.quantity;

        // numberTarget.innerHTML = element.quantity;
    });
    addToLocalStorage(cart, "cart");
}
function IncreaseQuantity(ref){
    let productToIncrement = cart.find(obj => {
        return obj.product.reference == ref;
    });
    productToIncrement.quantity++;
    DisplayCart();
}
function DecreaseQuantity(ref){
    let productToDecrement = cart.find(obj => {
        return obj.product.reference == ref;
    });
    productToDecrement.quantity--;
    DisplayCart();
}
//Deletes all units of an article from the cart
function DeleteArticleFromCart(ref){
    let productToDelete = cart.find(obj => {
        return obj.product.reference == ref;
    });
        cart.splice(cart.findIndex(element => element == productToDelete),1);
        DisplayCart();
}
function addToLocalStorage(data, emplacement){
    let toAdd = JSON.stringify(data);
    localStorage.setItem(emplacement, toAdd);
}
function readLocalStorage(emplacement){
    return JSON.parse(localStorage.getItem(emplacement));
}
// function FadeIn(element){
//     element.style.display = block;
//     let opacity = 0.1;
//     let timer = setInterval(()=>{
//         if(opacity >= 1){
//             clearInterval(timer);
//         }
//         element.style.opacity = opacity;
//         element.style.filter = "alpha(opacity=" + op*100 + ")";
//         op += op*0.1
//     }, 50);
// }
// function FadeOut(element){
//     let opacity = 1;
//     let timer = setInterval(()=>{
//         if(opacity <= 0.1){
//             clearInterval(timer);
//             element.style.display = none;
//         }
//         element.style.opacity = opacity;
//         element.style.filter = "alpha(opacity=" + op*100 + ")";
//         op -= op*0.1
//     }, 50);
// }

/* TODO
changer le nombre d'articles du panier
Panier vide au démarrage
Bonus
Style des onglets de catégories
Rendre le site beau
Page d'accueil
Ajouter nouveaux articles
*/

if(readLocalStorage("spikyArticles") == null || readLocalStorage("spikyArticles") == ""){
    addToLocalStorage(
        {
        category1 : [
            new Product('Sac de baroudeur','./src/image01.jpg', 'description', 100, '120.00', 'Sacs'),
            new Product("Sac Ado","./src/image02.jpg", "description", 101, "25.00", "Sacs"),
            new Product("Sac Mode","./src/image03.jpg", "description", 102, "120.00", "Sacs")
        ],
        category2 : [
            new Product("Valise 'Vernis à ongles'","./src/image04.jpg", "description", 200, "75.00", "Valises"),
            new Product("Valise Vintage","./src/image05.jpg", "description", 201, "199.99", "Valises"),
            new Product("Valise perdue","./src/image06.jpg", "description", 202, "1.00", "Valises")
        ],
        category3 : [
            new Product("Cactus 'L'Original'","./src/image07.jpg", "description", 300, "150.00", "Cactus"),
            new Product("Cactus 'Boule'","./src/image08.jpg", "description", 301, "12.00", "Cactus"),
            new Product("Cactus de Tennis","./src/image09.jpg", "description", 302, "150.00", "Cactus")
        ]
    }, "spikyArticles")
}
if (readLocalStorage("cart") == null || readLocalStorage("cart") == ""){
    addToLocalStorage([], "cart");
}