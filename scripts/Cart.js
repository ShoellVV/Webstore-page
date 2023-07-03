export class Cart {

    constructor() {
        this.productQuantity = parseInt(sessionStorage.getItem("productQuantity"));

        if(location == "http://127.0.0.1:5500/Cart.html"){
            this.tableBody = document.querySelector(".table-body");
            this.summaryExecuted = false;
        };
    };

    init(){
        this.addProduct();
        this.priceSummary();

        this.changeQuantityOfProduct();

        document.querySelector(".go-further").addEventListener("click", event =>{
            let cart = [];
            sessionStorage.setItem("Cart", JSON.stringify(cart));
            sessionStorage.setItem("productQuantity", JSON.stringify(0));
            location.reload();
        });

    };  

    //dodanie produktu
    addProduct(){

        let cart = JSON.parse(sessionStorage.getItem("Cart"));

        for(let i = 0; i < cart.length; i++){
            //wiersz
            const row = document.createElement("tr");
            row.classList.add("product");
            this.tableBody.appendChild(row);

            // pierwsza komórka(zdjęcie i nazwa produktu)
            const td1 = document.createElement("td");
            row.appendChild(td1);

            const productImg = document.createElement("img");
            productImg.src = cart[i].pImg;
            td1.appendChild(productImg);

            const productName = document.createElement("span");
            productName.classList.add("product-name");    
            productName.innerText = cart[i].pName;
            td1.appendChild(productName);

            // komórka z inputem numerycznym do ilości produktu
            const td2 = document.createElement("td");
            row.appendChild(td2);

            const inputQuantity = document.createElement("input");
            inputQuantity.classList.add("product-quantity");
            inputQuantity.type = "number";
            inputQuantity.value = cart[i].quantity;
            inputQuantity.inputmode ="numberic";
            inputQuantity.min = "1";
            td2.appendChild(inputQuantity);

            // komórka z ceną
            const td3 = document.createElement("td");
            td3.classList.add("product-price");
            row.appendChild(td3);

            const productPrice = document.createElement("span");
            productPrice.classList.add("price");
            productPrice.innerText = cart[i].pPrice;
            td3.appendChild(productPrice);

            const currency = document.createElement("span");
            currency.innerText ="zł";
            td3.appendChild(currency);

            // komórka z przyciskiem usuwania produktu
            const td4 = document.createElement("td");
            row.appendChild(td4);

            const deleteBtn = document.createElement("button");
            deleteBtn.classList.add("delete-btn");
            td4.appendChild(deleteBtn);

            const xMark = document.createElement("i");
            xMark.classList.add("fa-solid", "fa-xmark");
            deleteBtn.appendChild(xMark);

            deleteBtn.addEventListener("click", event => this.deleteProduct(event,row));
        }
    };

    // usuwanie produktu z koszyka
    deleteProduct(event,product){
        event.preventDefault();
        

        /////////////////////////
        ///// usunięcie produktu z sessionStorage
        /////////////////////////

        let cart = JSON.parse(sessionStorage.getItem("Cart"));
        let newCart = [];
        let productName = event.target.parentNode.parentNode.parentNode.childNodes[0].childNodes[1].innerText;
        for(let i = 0; i < cart.length; i++){
            if(cart[i].pName !== productName){
                newCart.push(cart[i]);
            }
        };
        sessionStorage.setItem("Cart",JSON.stringify(newCart));

        ///////////////////////////////
        ///// ilość produktów
        ///////////////////////////////

        //zmiana ogólnej ilości produktów 
        let deletedQuantity = product.children[1].children[0].value;
        let currentQuantity = sessionStorage.getItem("productQuantity");
        let newQuantity = parseInt(currentQuantity - deletedQuantity);
        //zapisanie całkowitej ilości produktów po usunięciu w sessionStorage
        sessionStorage.setItem("productQuantity", JSON.stringify(newQuantity));
        this.productQuantity = parseInt(sessionStorage.getItem("productQuantity"));
        this.cartProductsQuantity.innerText = this.productQuantity;

        //usunięcie produktu z tabeli
        this.tableBody.removeChild(product);

        // aktualizacja podsumowanej ceny
        this.priceSummary(true);
    };

    // event listener na zmiany ilości produktu w koszyku i zapisanie zmiany w sessionStorage
    changeQuantityOfProduct(){
        if(this.productQuantity > 0){
            this.quantityInputs = document.querySelectorAll(".product-quantity");
        };

        this.quantityInputs.forEach( input =>{
            let inputValue = input.value;
            input.addEventListener("change", event => {
                let productName = input.parentNode.parentNode.children[0].innerText
                let cart = JSON.parse(sessionStorage.getItem("Cart"));
                // zmiana ogólnej ilośći produktów
                let quantity = parseInt(sessionStorage.getItem("productQuantity"));
                if(inputValue < input.value){
                    quantity = quantity + parseInt(input.value - inputValue);
                    inputValue = input.value;
                    sessionStorage.setItem("productQuantity", JSON.stringify(quantity));
                }else{
                    quantity = quantity - (parseInt(inputValue - input.value));
                    inputValue = input.value;
                    sessionStorage.setItem("productQuantity", JSON.stringify(quantity));
                };
                // zmiana ilości produktu w sessionStorage
                for(let i = 0; i < cart.length; i++){
                    if(cart[i].pName === productName){
                        cart[i].quantity = parseInt(inputValue);
                        sessionStorage.setItem("Cart", JSON.stringify(cart));
                    }
                }
                // zmiana ilości produktów na ikonce koszyka i zmiana sumy koszyka
                this.cartProductsQuantity.innerText = quantity;
                this.priceSummary(true);
            })
        });
    }

    // suma ceny wszystkich produktów
    priceSummary(deletedOrChanged = false){
        let summaryPrice = 0;
        if(this.productQuantity >= 1){

            //sumowanie ceny wszystkich produktów w koszyku
            
            const products = document.querySelectorAll(".product");
            products.forEach( product =>{
                let quantity = parseInt(product.childNodes[1].firstChild.value);
                let price = parseFloat(product.childNodes[2].childNodes[0].innerText);
                summaryPrice += quantity * price;
            });
            // odejmowanie ceny z sumy przy usunięciu produktu z koszyka
            if(deletedOrChanged){
                const summary = document.querySelector(".summaryPrice");
                summary.innerText = `${summaryPrice.toFixed(2)}zł`
            }

            // dodanie wiersza z sumą koszyka
            const summary = document.createElement("tr");
            summary.classList.add("summary");
            summary.innerHTML= `<td></td>
            <td>Razem</td>
            <td class="summaryPrice">${summaryPrice.toFixed(2)}zł</td>
            <td></td>`
            if(this.summaryExecuted === false){
                this.tableBody.appendChild(summary);  
                this.summaryExecuted = true;
            }
        };
        
        //usunięcie wiersza z sumą koszyka
        if(this.productQuantity < 1 ){
            const summary = document.querySelector(".summary");
            this.tableBody.removeChild(summary);
            this.summaryExecuted = false;
        }
    };
}