const parentElement = document.getElementById("myForm");

// Url til vores json fil
const url = "../json/kager.json";

// Global variable til at holde mængden af kager valgt
let totalQuantity = 0;

// Fetch JSON data
fetch(url)
    .then(response => {
        // tjekker om responsen er okay, hvis ikke bruger vi throw til at se om der er en error
        if (!response.ok) {
            throw new Error("fejl i responsen");
        }
        // hvis responsen er okay, konverter vi dataen til json
        return response.json();
    })
    .then(data => {
        // modtager dataen fra vores respons og laver en const til at tage fat om den data vi vil bruge
        const kageData = data.kager;

        // laver et forEach loop, for at tage fat om de forskellige objekter der er i vores json fil
        // og laver elementer til hvert objekt
        kageData.forEach(kage => {
            // laver et figure element til alle kagerne
            const figure = document.createElement("figure");
            figure.classList.add("produkt-figure");

            // laver en overskift til alle kagerne
            const productName = document.createElement("h2");
            productName.classList.add("produkt-overskrift");
            productName.textContent = kage.navn;

            // laver en div som skal indholde dataen fra kagerne
            const productInfo = document.createElement("div");
            productInfo.classList.add("produkt-information");

            // laver et img tag til kagerne og tager deres billede og insætter, samt laver alt text
            const productImage = document.createElement("img");
            productImage.classList.add("produkt-billede");
            productImage.src = kage.billede;
            productImage.alt = `billede af ${kage.navn}`;

            // laver et p element som skal indholde beksrivelsen af vores kager
            const productDescription = document.createElement("p");
            productDescription.classList.add("produkt-p");
            productDescription.textContent = kage.beskrivelse;

            // laver en div til som skal indeholde vores ikoner
            const productIcons = document.createElement("div");
            productIcons.classList.add("produkt-ikoner");

            // laver et for each loop af vores ikoner så den tager alle ikonerne som er givet i json filen
            kage.ikoner.forEach(iconUrl => {
                const icon = document.createElement("img");
                icon.src = iconUrl;
                icon.alt = "Ikon til kagerne";
                productIcons.appendChild(icon);
            });

            // laver vores div som skal indholde vores plus og minus knapper som mængden af kager valgt
            const buttonsDiv = document.createElement("div");

            // laver elementet for mængden af kager valgt bliver tilføget
            const outputInput = document.createElement("input");
            outputInput.type = "text";
            outputInput.classList.add("output", "produkt-button-value");
            outputInput.value = "0";
            // lavet til en readOnly så man ikke kan skrive en værdi men skal bruge knapperne
            outputInput.readOnly = true;

            // laver minus knap
            const minusButton = document.createElement("button");
            minusButton.type = "button";
            minusButton.classList.add("produkt-minus-button");
            minusButton.textContent = "-";
            // giver minus knappen en funktion som tager fat i vores output
            minusButton.onclick = function() {
                // laver funktion adjustValue og tilføjer 2 arguments
                // bruger this.parentNode finder et element med class output som er et child af den klikkede minus knap
                // og -1 til at ændre værdien af output
                adjustValue(this.parentNode.querySelector(".output"), -1);
            };


            // laver plus knappen, som er det samme som minus knappen bare at den ændre value til +1 istedet for -1
            const plusButton = document.createElement("button");
            plusButton.type = "button";
            plusButton.classList.add("produkt-plus-button");
            plusButton.textContent = "+";
            plusButton.onclick = function() {
                adjustValue(this.parentNode.querySelector(".output"), 1);
            };

            // appender knapper og input til at være i deres respektive div
            buttonsDiv.appendChild(minusButton);
            buttonsDiv.appendChild(outputInput);
            buttonsDiv.appendChild(plusButton);

            // laver tilføj knap og giver den en funktion på onclick 
            const addButton = document.createElement("button");
            addButton.type = "button";
            addButton.classList.add("tilfojButton", "produkt-tilfoj-knap");
            addButton.textContent = "TILFØJ";
            // starter 2 funktioner, displayValue og UpdateTotalQuantity
            addButton.onclick = function() {
                displayValue(this.parentNode.querySelector(".output"), this);
                updateTotalQuantity();
            };

            // appender elementerne til informations div´en 
            productInfo.appendChild(productImage);
            productInfo.appendChild(productDescription);
            productInfo.appendChild(productIcons);
            productInfo.appendChild(buttonsDiv);
            productInfo.appendChild(addButton);

            // appender overskrift of information til figuren
            figure.appendChild(productName);
            figure.appendChild(productInfo);

            // appender figuren til vores form
            parentElement.appendChild(figure);
        });


        // laver funktion så at plus og minus knapper fungere som de skal, ved at tilføje eller fratage 1 fra current value
        function adjustValue(outputField, change) {
            let currentValue = parseInt(outputField.value);
            let newValue = currentValue + change;

            // laver en if statment som gør at value ikke kan gå i minus
            if (newValue < 0) {
                newValue = 0;
            }

            // opdatere output/input til at være en ny value
            outputField.value = newValue;
            
        }

    }).catch(error => {
        // catch tager fat hvis der eventuelt er fejl i vores fetch, også console logger den Error
        console.error("Error:", error);
    });


// laver en function som hedder display value, som går ind og tager outputField og addButton som 
// argumenter. så at vores tilføj knap og den value vi har fra outputfield bliver brugt
function displayValue(outputField, addButton) {
    // bruger parseInt til at ændre vores tekst string til et nummer
    let currentValue = parseInt(outputField.value);

    // laver et if statment til at sikre at den valgte value er over 0
    if (currentValue > 0) {
        // tager fat i produktets navn og tager dens text.content
        let productName = addButton.parentNode.parentNode.querySelector(".produkt-overskrift").textContent;

        // laver et input element til vores orderList,
        let listItem = document.createElement("input");
        listItem.value = `${currentValue}x ${productName}`;
        listItem.classList.add("koeb-liste");
        listItem.readOnly = true;
        listItem.name = "Kager";

        // laver en knap som gør det muligt at fjerne den valgte kage.
        let deleteItem = document.createElement("button");
        deleteItem.textContent = "Fjern";
        deleteItem.classList.add("removeButton");

        // tager fat i displayArea så at vi kan apend elementerne i den
        let displayArea = document.querySelector(".displayArea");

        // appender elementerne til displayArea
        displayArea.appendChild(deleteItem);
        displayArea.appendChild(listItem);

        // laver en eventListener som gør det muligt at fjerne elemeneterne fra displayArea
        deleteItem.addEventListener("click", function() {
            displayArea.removeChild(listItem);
            displayArea.removeChild(deleteItem);
            updateTotalQuantity();
        });

        // sætter output value til 0 efter man har trykket tilføg
        outputField.value = 0;

        // ændre farven på tilføg knappen og ændre teksten til tilføjet
        addButton.style.backgroundColor = "#2D65B6";
        addButton.style.color = "#FFFFFF";
        addButton.textContent = "TILFØJET";

        // opdatere den totale mængde af kager
        updateTotalQuantity();
        // kalder på en funktion som resetter farven på knappen
        setTimeout(function() {
            resetAddButton();
        }, 3000);
    // laver function til at resætte farve og tekst tilbage til start
        function resetAddButton() {
            addButton.style.backgroundColor = "#E7F1FF";
            addButton.style.color = "#000000";
            addButton.textContent = "TILFØJ";
        }

    } else {
        // laver et else statement som går ind og siger du skal vægle mindst en kage hvis du bare trykker tilføg
        alert("Vælg venligst mindst 1 kage");
    }

}

// her laver vi en funktion som udregner hvor mange kager som brugeren har valgt
const totalPriceElement = document.querySelector(".total-pris");
function updateTotalQuantity() {
    const orderListItems = document.querySelectorAll(".koeb-liste");
    totalQuantity = 0;

    // bruger et forEach loop, som går igennem hver input som har class koeb-liste
    orderListItems.forEach(orderItem => {
        const quantityText = orderItem.value.split("x")[0].trim(); 
        const quantity = parseInt(quantityText);
        if (!isNaN(quantity)) { 
            totalQuantity += quantity;
        }
    });

    // definerer vores forskellige priser 
    const priceForFour = 188;
    const priceForSix = 280;
    const priceForOne = 48; 
    let totalPrice = 0;

    // if statement for at udregne prisen alt efter hvor mange kager brugeren har valgt 
    if (totalQuantity === 1) {
        totalPrice = priceForOne;
        totalPriceElement.value = `Du mangler 3 kager`;
    } else if (totalQuantity === 2){
        totalPrice = priceForOne * 2;
        totalPriceElement.value = `Du mangler 2 kager`;
    } else if (totalQuantity === 3){  
        totalPrice = priceForOne * 3;
        totalPriceElement.value = `Du mangler 1 kage`;
    } else if (totalQuantity % 2 !== 0) {
        totalPriceElement.value = `ulige antal kager`;
        console.log(totalPriceElement.value);
    } else if (totalQuantity === 4) {
        totalPrice = priceForFour;
        totalPriceElement.value = `Total pris: ${totalPrice} DKK`;
    } else if (totalQuantity === 6) {
        totalPrice = priceForSix;
        totalPriceElement.value = `Total pris: ${totalPrice} DKK`;
    } else if (totalQuantity === 8) {
        totalPrice = priceForFour * 2;
        totalPriceElement.value = `Total pris: ${totalPrice} DKK`;
    } else if (totalQuantity === 10) {
        totalPrice = priceForSix + priceForFour;
        totalPriceElement.value = `Total pris: ${totalPrice} DKK`;
    } else if (totalQuantity === 12) {
        totalPrice = priceForSix * 2;
        totalPriceElement.value = `Total pris: ${totalPrice} DKK`;
    } else if (totalQuantity === 14) {
        totalPrice = priceForFour * 2 + priceForSix;
        totalPriceElement.value = `Total pris: ${totalPrice} DKK`;
    } else if (totalQuantity === 16) {
        totalPrice = priceForSix * 2 + priceForFour;
        totalPriceElement.value = `Total pris: ${totalPrice} DKK`;
    } else if (totalQuantity === 18) {
        totalPrice = priceForSix * 3;
        totalPriceElement.value = `Total pris: ${totalPrice} DKK`;
    } else if (totalQuantity === 20) {
        totalPrice = priceForSix * 2 + priceForFour * 2;
        totalPriceElement.value = `Total pris: ${totalPrice} DKK`;
    } 
    
    console.log(totalQuantity);
    console.log("Total pris:", totalPrice);
}

// en funktion som submitter vores form, men kun efter at have tjekket at antallet af kager er
// over 4 og under 20
function formSubmit(event) {
    event.preventDefault(); 

    if (totalQuantity < 4) {
        alert("Vælg venligst mindst 4 kager.");
    } else if (totalQuantity > 20) {
        alert("Du kan maksimalt vælge 20 kager.");
    } 
}

// laver en eventlistener til at kalde formSubmit
const form = document.querySelector(".form");
form.addEventListener("submit", formSubmit);
