import { Cart } from "./Cart.js"
import { Products } from "./Products.js"
import { HomePage } from "./HomePage.js"
import { Login } from "./Login.js"

class Webstore {
    
    constructor() {
        // div z ilością produktów na ikonce koszyka
        this.cartProductsQuantity = document.querySelector(".productsQuantity");
    };
    
    setupCart() {
        this.cart = new Cart();
    };

    setupProducts(){
        this.products = new Products();
    };

    setupHomePage() {
        this.homePage = new HomePage();
    };

    setupLogin() {
        this.login = new Login(this.cart.productQuantity);
    }

    firstSession(){
        if(sessionStorage.getItem("productQuantity") === null){
            sessionStorage.setItem("productQuantity",0);
            let cart = [];
            sessionStorage.setItem("Cart",JSON.stringify(cart));
        };
    };

    //inicjacja skryptu
    init() {
        this.firstSession();
        this.setupCart();
        this.setupProducts();
        this.setupLogin();

        this.setPage();
    };

    getDataFromAPI(productImg,productName,productPrice,productDesc,count,productCategoryCount){

        fetch(`https://fakestoreapi.com/products/category/${this.products.categoryNames[productCategoryCount]}`)
        .then(response => response.json())
        .then(product => {
            // if cardCount < product.length 
            
            productImg.innerHTML = `<img src="${product[count].image}" alt="">`
            productName.innerHTML =`<span>${product[count].title}</span>`
            productPrice.innerHTML =`<span>${product[count].price}</span><span>zł</span>`
            productDesc.innerHTML = product[count].description;
        })
    };

    // tworzenie cards dla produktów
    createProductCard(count){
        let productCategoryCount = 0;
        this.products.productRow.forEach( productRow => {
            for(let i = 0; i < count; i++){
                //cards
                const card = document.createElement("div");
                card.classList.add("card","product-card");
                productRow.appendChild(card);
    
                //container dla img produktu
                const productImg = document.createElement("div");
                productImg.classList.add("product-container");
                card.appendChild(productImg);
    
                //row dla product name i price
                const row = document.createElement("div");
                row.classList.add("row");
                card.appendChild(row);
    
                //product name 
                const productName = document.createElement("div");
                productName.classList.add("product-name");
                row.appendChild(productName);
    
                //product price
                const productPrice = document.createElement("div");
                productPrice.classList.add("product-price");
                card.appendChild(productPrice);
    
                //product desc
                const productDesc = document.createElement("p");
                productDesc.classList.add("product-desc");
                card.appendChild(productDesc);
    
                //btn do dodania do koszyka
                const addCartBtn = document.createElement("button");
                addCartBtn.classList.add("blue-btn","add-cart-btn");
                addCartBtn.innerText = "Dodaj do koszyka";
                card.appendChild(addCartBtn);
    
                this.getDataFromAPI(productImg,productName,productPrice,productDesc,i,productCategoryCount);
            };
            productCategoryCount++;
        });
        
    };

    // w zależności od lokalizacji metoda będzie ustawiać nawigację, ilość produktów na ikonce koszyka itp.
    setPage(){
        if(this.cart.productQuantity > 0){
            this.cartProductsQuantity.innerText = this.cart.productQuantity;
            this.cartProductsQuantity.style.display = "block";
        }else{
            this.cartProductsQuantity.style.display = "none";
        };;

        if(location == "http://127.0.0.1:5500/Website.html"){
            this.setupHomePage();
            this.homePage.newsletterHandler();
            this.createProductCard(2);
            this.login.getUsers();

            // przyciski buttonów dodających produkty
            this.productsButton = document.querySelectorAll(".add-cart-btn");
            // dodanie do koszyka
            this.products.addCartButtonHandler(this.productsButton);
        };

        if(location == "http://127.0.0.1:5500/Products.html"){
            this.createProductCard(4);
            // przyciski buttonów dodających produkty
            this.productsButton = document.querySelectorAll(".add-cart-btn");
            // dodanie do koszyka
            this.products.addCartButtonHandler(this.productsButton);
        };

        if(location == "http://127.0.0.1:5500/Cart.html"){
            const cart = sessionStorage.getItem("Cart");
            if(cart !== "[]"){
                this.cart.init();
            }
        };

        if(location == "http://127.0.0.1:5500/Login.html"){
            this.login.getUsers();
        };

        this.setNav();
    };

    setNav(){
        let user = JSON.parse(sessionStorage.getItem("User"));

        const loginContainer = document.querySelector(".username");
        const nav = document.querySelector(".nav .row");

        if(user !== null){
            if(location != "http://127.0.0.1:5500/Website.html"){
                nav.style.marginLeft = "20%";
            };
            loginContainer.innerHTML = `
            <span class="username-span"></span><i class="fa-icon fa-regular fa-user"></i>
            <button class="logoutBtn">Wyloguj się</button>`
            this.login.logout();
        }else{
            if(location != "http://127.0.0.1:5500/Website.html"){
                nav.style.marginLeft = "10%";
                loginContainer.style.display = "none";
            }else{
                loginContainer.innerHTML = `<button class="login-btn"><span>Zaloguj się </span> <i class="fa-icon fa-solid fa-arrow-right fa-2xs"></i><i class="fa-icon fa-regular fa-user"></i></button>` 
                this.login.loginBtnHandler();
            };
        };
    };

};

let webstore = new Webstore();
webstore.init();
