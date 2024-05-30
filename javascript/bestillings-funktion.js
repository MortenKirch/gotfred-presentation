const parentElement = document.getElementById("myForm");
const url = "../json/kager2.json";
let totalQuantity = 0;

fetch(url)
    .then(response => {
        if (!response.ok) {
            throw new Error("fejl i responsen");
        }
        return response.json();
    })
    .then(data => {
        const kageData = data.kager;
        kageData.forEach(kage => createProductElement(kage));
    })
    .catch(error => {
        console.error("Error:", error);
    });

function createProductElement(kage) {
    const figure = document.createElement("figure");
    figure.classList.add("produkt-figure");

    const productName = document.createElement("h2");
    productName.classList.add("produkt-overskrift");
    productName.textContent = kage.navn;

    const productInfo = document.createElement("div");
    productInfo.classList.add("produkt-information");

    const productImageContainer = document.createElement("div")
    productImageContainer.classList.add("product-image-container")
    const productImage = document.createElement("img");
    productImage.classList.add("produkt-billede");
    productImage.src = kage.billede;
    productImage.alt = `billede af ${kage.navn}`;

    const productDescription = document.createElement("p");
    productDescription.classList.add("produkt-p");
    productDescription.textContent = kage.beskrivelse;

    const productIcons = createIcons(kage.ikoner);

    const buttonsDiv = createQuantityButtons();

    const addButton = document.createElement("button");
    addButton.type = "button";
    addButton.classList.add("tilfojButton", "produkt-tilfoj-knap");
    addButton.textContent = "Læg i kurv";
    addButton.onclick = function() {
        displayValue(this.parentNode.querySelector(".output"), this);
        updateTotalQuantity();
    };
    productImageContainer.append(productImage)
    productInfo.append(productImageContainer, productDescription, productIcons, buttonsDiv, addButton);
    figure.append(productName, productInfo, );
    parentElement.appendChild(figure);
}

function createIcons(icons) {
    const productIcons = document.createElement("div");
    productIcons.classList.add("produkt-ikoner");

    icons.forEach(icon => {
        const iconContainer = document.createElement("div");
        iconContainer.classList.add("product-icon-tooltip");

        const iconElement = document.createElement("img");
        iconElement.src = icon.url;
        iconElement.alt = icon.navn;
        iconElement.classList.add("product-icon");

        const tooltipText = document.createElement("span");
        tooltipText.classList.add("tooltiptext");
        tooltipText.textContent = `denne kage indeholder ${icon.navn}`;

        iconContainer.appendChild(iconElement);
        iconContainer.appendChild(tooltipText);
        productIcons.appendChild(iconContainer);
    });
    return productIcons;
}



function createQuantityButtons() {
    const buttonsDiv = document.createElement("div");

    const outputInput = document.createElement("input");
    outputInput.type = "text";
    outputInput.classList.add("output", "produkt-button-value");
    outputInput.value = "0";
    outputInput.readOnly = true;

    const minusButton = document.createElement("button");
    minusButton.type = "button";
    minusButton.classList.add("produkt-minus-button");
    minusButton.textContent = "-";
    minusButton.onclick = function() {
        adjustValue(this.parentNode.querySelector(".output"), -1);
    };

    const plusButton = document.createElement("button");
    plusButton.type = "button";
    plusButton.classList.add("produkt-plus-button");
    plusButton.textContent = "+";
    plusButton.onclick = function() {
        adjustValue(this.parentNode.querySelector(".output"), 1);
    };

    buttonsDiv.append(minusButton, outputInput, plusButton);
    return buttonsDiv;
}

function adjustValue(outputField, change) {
    let currentValue = parseInt(outputField.value);
    let newValue = currentValue + change;
    if (newValue < 0) {
        newValue = 0;
    }
    outputField.value = newValue;
}

function displayValue(outputField, addButton) {
    let currentValue = parseInt(outputField.value);
    if (currentValue > 0) {
        let productName = addButton.parentNode.parentNode.querySelector(".produkt-overskrift").textContent;

        let listItem = document.createElement("input");
        listItem.value = `${currentValue}x ${productName}`;
        listItem.classList.add("koeb-liste");
        listItem.readOnly = true;
        listItem.name = "Kager";

        let deleteItem = document.createElement("button");
        deleteItem.textContent = "Fjern";
        deleteItem.classList.add("removeButton");

        let displayArea = document.querySelector(".displayArea");
        displayArea.append(deleteItem, listItem);

        deleteItem.addEventListener("click", function() {
            displayArea.removeChild(listItem);
            displayArea.removeChild(deleteItem);
            updateTotalQuantity();
        });

        outputField.value = 0;
        styleAddButton(addButton, true);

        updateTotalQuantity();

        setTimeout(function() {
            styleAddButton(addButton, false);
        }, 3000);
    } else {
        alert("Vælg venligst mindst 1 kage");
    }
}

function styleAddButton(button, isAdded) {
    if (isAdded) {
        button.style.backgroundColor = "#2D65B6";
        button.style.color = "#FFFFFF";
        button.textContent = "I kurven";
    } else {
        button.style.backgroundColor = "#E7F1FF";
        button.style.color = "#000000";
        button.textContent = "Læg i kurv";
    }
}

const totalPriceElement = document.querySelector(".total-pris");

function updateTotalQuantity() {
    const orderListItems = document.querySelectorAll(".koeb-liste");
    totalQuantity = 0;

    orderListItems.forEach(orderItem => {
        const quantityText = orderItem.value.split("x")[0].trim();
        const quantity = parseInt(quantityText);
        if (!isNaN(quantity)) {
            totalQuantity += quantity;
        }
    });

    const priceForFour = 188;
    const priceForSix = 280;
    const priceForOne = 48;
    let totalPrice = 0;

    if (totalQuantity === 1) {
        totalPrice = priceForOne;
        totalPriceElement.value = `Du mangler 3 kager`;
    } else if (totalQuantity === 2) {
        totalPrice = priceForOne * 2;
        totalPriceElement.value = `Du mangler 2 kager`;
    } else if (totalQuantity === 3) {
        totalPrice = priceForOne * 3;
        totalPriceElement.value = `Du mangler 1 kage`;
    } else if (totalQuantity % 2 !== 0) {
        totalPriceElement.value = `ulige antal kager`;
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

function formSubmit(event) {
    event.preventDefault();

    if (totalQuantity < 4) {
        alert("Du skal bestille mindst 4 kager");
    } else {
        alert(`Tak for din bestilling! Du har bestilt ${totalQuantity} kager.`);
    }
}


function formSubmit(event) {
    event.preventDefault(); 

    if (totalQuantity < 4) {
        alert("Vælg venligst mindst 4 kager.");
    } else if (totalQuantity > 20) {
        alert("Du kan maksimalt vælge 20 kager.");
    }
    else {
        form.submit()
    }
}

// laver en eventlistener til at kalde formSubmit
const form = document.querySelector(".form");
form.addEventListener("submit", formSubmit);
