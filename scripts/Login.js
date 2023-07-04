import { Products } from "./Products.js"

export class Login {
    constructor(quantity){  

        this.users = [];
        this.products = new Products();
        this.productsQuantity = quantity;

        if(location == "https://shoellvv.github.io/Webstore-page/index.html"){
            // popuUp logowania
            this.loginPopUp = document.getElementById("popup");
            // button submit logowania
            this.submitLoginButton = document.querySelector(".submit-popup");
            // close login button
            this.closePopUpButton = document.querySelector(".btn-popup");
            //login input
            this.loginInput = document.querySelector(".login-input");
            // password input
            this.passwordInput = document.querySelector(".password-input");
            // msg login failed
            this.msgLogin = document.querySelector(".msg-login");
        }

        if(location == "https://shoellvv.github.io/Webstore-page/Login.html"){
            //logged input
            this.loggedInput = document.querySelector(".logged-input");
            //imie
            this.name = document.querySelector(".name-input");
            //nazwisko
            this.surname = document.querySelector(".surname-input");  
            //phoneNumber
            this.phoneNumber = document.querySelector(".phone-input")
            //email
            this.email = document.querySelector(".mail-input");
            //adress
            this.address = document.querySelector(".address-input");
            //city
            this.city = document.querySelector(".city-input")
            //zip-code
            this.zipCode = document.querySelector(".zipCode-input");
            //updateBtn
            this.updateBtn = document.querySelector(".update-submit");

            this.countId = 0;
        }
    };

    firstLoginCart(){
        if(sessionStorage.getItem("userCartExecuted") === null || sessionStorage.getItem("userCartExecuted") === "false"){
            sessionStorage.setItem("userCartExecuted","false");
            this.userCartExecuted = JSON.parse(sessionStorage.getItem("userCartExecuted"));
        }else{
            this.userCartExecuted = JSON.parse(sessionStorage.getItem("userCartExecuted"));
        };
    };

    loginBtnHandler(){
        this.loginButton = document.querySelector(".login-btn");

        this.loginButton.addEventListener("click", event =>{
            this.loginPopUp.classList.add("popup-visible");

            this.closePopUp();
            this.submitLogin();
        })
    };

    submitLogin(){
        this.submitLoginButton.addEventListener("click", event =>{
            event.preventDefault();
            sessionStorage.setItem("userCartExecuted","false");
            this.checkUserData();
        })
    };

    closePopUp(){
        this.closePopUpButton.addEventListener("click", event => {

            this.loginInput.value="";
            this.passwordInput.value="";
            this.loginPopUp.classList.remove("popup-visible");
        })
    };

    getUsers(){
        fetch('https://fakestoreapi.com/users')
        .then(response=>response.json())
        .then(data=>{
            for(let i = 0; i < data.length; i++){
                let user = {
                    username: data[i].username,
                    password: data[i].password,
                    name: data[i].name.firstname,
                    surname: data[i].name.lastname,
                    phone: data[i].phone,
                    email: data[i].email,
                    address: data[i].address.street + " " + data[i].address.number,
                    city: data[i].address.city,
                    zipCode:data[i].address.zipcode,
                    id:data[i].id
                }
                this.users.push(user);
            };
            if(location == "https://shoellvv.github.io/Webstore-page/Login.html"){
                this.setAccountInformation();
            }
        });
    };

    // sprawdzenie czy wpisany login i hasło są poprawne
    checkUserData(){
        let user = {
            username: this.loginInput.value,
            password: this.passwordInput.value
        }

        let loginAttempt = (element) => element.username === user.username && element.password === user.password;
        
        
        if(this.users.some(loginAttempt)){
            this.msgLogin.innerText = "";
            window.location.href = "https://shoellvv.github.io/Webstore-page/Login.html";
            sessionStorage.setItem("Cart", "[]");
            sessionStorage.setItem("productQuantity", 0)
            sessionStorage.setItem("User",JSON.stringify(user.username));
        }else{
            this.msgLogin.innerText = "Proszę wpisać poprawny login/hasło";
        };
       
    };

    setAccountInformation(){

        let user = JSON.parse(sessionStorage.getItem("User"));

        for(let i = 0; i < this.users.length; i++){
            if(this.users[i].username == user){

                this.loggedInput.value = this.users[i].username;
                this.name.value = this.users[i].name;
                this.surname.value = this.users[i].surname;
                this.phoneNumber.value = this.users[i].phone;
                this.email.value = this.users[i].email;
                this.address.value = this.users[i].address;
                this.city.value = this.users[i].city;
                this.zipCode.value = this.users[i].zipCode;
                this.userID = this.users[i].id;
            };
        };

        this.getUserCart();
    };

    getUserCart(){
        this.firstLoginCart();

        if(!this.userCartExecuted){
            let product = {
                pImg: null,
                pName: null,
                pPrice: null,
                quantity: null
            };
            fetch(`https://fakestoreapi.com/carts/user/${this.userID}`)
            .then(response=>response.json())
            .then(data=>{
                product.quantity = data[0].products[this.countId].quantity;
                this.productsQuantity += product.quantity;
                sessionStorage.setItem("productQuantity",JSON.stringify(this.productsQuantity));

                if(data[0].products[this.countId] !== undefined){
                    return fetch(`https://fakestoreapi.com/products/${data[0].products[this.countId].productId}`);
                };
            })
            .then(response=>response.json())
            .then(data =>{ 
                product.pImg = data.image
                product.pPrice = data.price
                product.pName = data.title
                this.countId += 1;
    
                this.products.addProductToStorage(product.pImg,product.pName,product.pPrice,product.quantity)
                this.getUserCart();
            })
            .catch(() =>{
                sessionStorage.setItem("userCartExecuted","true");
                this.countId = 0
                return});
        }
       
    };

    logout() {
        const logoutBtn = document.querySelector(".logoutBtn")

        logoutBtn.addEventListener("click", event =>{
            sessionStorage.setItem("userCartExecuted","false");
            sessionStorage.removeItem("User");
            sessionStorage.setItem("productQuantity", 0);
            sessionStorage.setItem("Cart","[]");
            location.href ="https://shoellvv.github.io/Webstore-page/index.html";
        })
    };

};
