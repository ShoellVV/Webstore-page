import { Cart } from "./Cart.js"

export class Products {

    constructor(){
        // karty produktów
        this.products = document.querySelectorAll(".product-card");
        // product row
        this.productRow = document.querySelectorAll(".product-row");
        // ilość produktów na ikonce koszyka
        this.cartProductsQuantity = document.querySelector(".productsQuantity");
        //cart
        this.cart = new Cart();
        this.categoryNames = ["electronics","jewelery","men's clothing","women's clothing"];
    };

     // handler dla buttonów w cardsach produktów, w celu wyświetlenie ilości produktów na ikonie koszyka, dodadniu produktu do koszyka
     addCartButtonHandler(buttons){
        buttons.forEach(button => {
            button.addEventListener("click", event => {
                
                this.addProductData(button);

                this.displayQuantityOnCartIcon();
            });
        });
    };

    //pobranie danych produktu, który jest dodawany do koszyka
    addProductData(element){
        let product = element.parentNode;
        let productImg = product.children[0].children[0].attributes[0].nodeValue;
        let productName = product.children[1].children[0].innerText;
        let productPrice = product.children[2].children[0].innerText;

        this.addProductToStorage(productImg, productName, productPrice);
    };

    //dodanie produktu do koszyka w session storage;
    addProductToStorage(img,name,price, quantity = 1){
        let product = {
            pImg: img,
            pName: name,
            pPrice: price,
            quantity: quantity
        };

        const cart = JSON.parse(sessionStorage.getItem("Cart"));
        let quantityChanged = false;

        if(cart.length == 0){
            cart.push(product);
            sessionStorage.setItem("Cart", JSON.stringify(cart));
        }else{
            for(let i = 0; i < cart.length; i++){
                if(cart[i].pName == product.pName){
                    cart[i].quantity += 1;
                    quantityChanged = true;
                    sessionStorage.setItem("Cart", JSON.stringify(cart));
            }};

            if(quantityChanged == false){
                cart.push(product);
                sessionStorage.setItem("Cart", JSON.stringify(cart));
            };          
        };
    };

    displayQuantityOnCartIcon(){

        let quantity = (parseInt(sessionStorage.getItem("productQuantity"))+1);
        sessionStorage.setItem("productQuantity", quantity.toString());
        this.cart.productQuantity = parseInt(sessionStorage.getItem("productQuantity"));

        //liczba produktów w koszyku dla głównej strony
       
            this.cartProductsQuantity.innerText = this.cart.productQuantity;

            if(this.cart.productQuantity > 0){
                this.cartProductsQuantity.style.display = "block";
            }else{
                this.cartProductsQuantity.style.display = "none";
            };
    };
}