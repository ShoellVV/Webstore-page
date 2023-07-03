export class HomePage {
    constructor(){
        // button koszyka
        this.cartButton = document.querySelector(".cart-button");
        // input maila
        this.inputEmail = document.querySelector(".news-input");
        // submit maila
        this.submitNewsBtn = document.querySelector(".submit-input");
        // div wiadomości przy walidacji e-mail
        this.msgBox = document.querySelector(".msg-box");
        // category name
        this.categoryName = document.querySelectorAll(".category-name");
    };



    // po submitcie maila, waliduje czy wpisano poprawnie maila, jeśli nie, zostanie wyświetlona wiadomość
    newsletterHandler() {
        this.submitNewsBtn.addEventListener("click", event => {
            event.preventDefault();
            
            this.msgBox.classList.remove("valid-mail");
            this.msgBox.classList.remove("invalid-mail");
            
            this.validateEmail();
        });
    };

    // walidacja maila
    validateEmail() {
        const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/;

        if(this.inputEmail.value.match(emailRegex)){
            this.inputEmail.value = "";

            this.msgBox.classList.add("valid-mail");
            this.msgBox.innerHTML = "Dziękujemy za dołączenie do naszego newslettera!"
        } else{
            this.msgBox.classList.add("invalid-mail");
            this.msgBox.innerHTML = "Wpisany e-mail jest niepoprawny!"
        };
    };

};