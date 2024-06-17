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

    const productImageContainer = document.createElement("div");
    productImageContainer.classList.add("product-image-container");
    const productImage = document.createElement("img");
    productImage.classList.add("produkt-billede");
    productImage.src = kage.billede;
    productImage.alt = `billede af ${kage.navn}`;

    const productDescription = document.createElement("p");
    productDescription.classList.add("produkt-p");
    productDescription.textContent = kage.beskrivelse;

    const productIcons = createIcons(kage.ikoner);

    const buttonsDiv = createQuantityButtons(kage.navn);

    const addButton = document.createElement("button");
    addButton.type = "button";
    addButton.classList.add("tilfojButton", "produkt-tilfoj-knap");
    addButton.textContent = "Læg i kurv";
    addButton.onclick = function() {
        displayValue(this.parentNode.querySelector(".output"), this, kage.navn);
    };

    productImageContainer.append(productImage);
    productInfo.append(productImageContainer, productDescription, productIcons, buttonsDiv, addButton);
    figure.append(productName, productInfo);
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
        tooltipText.textContent = `Denne kage indeholder ${icon.navn}`;

        iconContainer.appendChild(iconElement);
        iconContainer.appendChild(tooltipText);
        productIcons.appendChild(iconContainer);
    });
    return productIcons;
}

function createQuantityButtons(kageName) {
    const buttonsDiv = document.createElement("div");

    const outputInput = document.createElement("input");
    outputInput.type = "text";
    outputInput.classList.add("output", "produkt-button-value");
    outputInput.value = "0";
    outputInput.readOnly = true;
    outputInput.dataset.kageName = kageName;

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

function displayValue(outputField, addButton, kageName) {
    let currentValue = parseInt(outputField.value);
    if (currentValue > 0) {
        let listItem = document.createElement("input");
        listItem.value = `${currentValue}x ${kageName}`;
        listItem.classList.add("koeb-liste");
        listItem.readOnly = true;
        listItem.dataset.kageName = kageName;

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
    let totalRegularCakes = 0;
    let totalPetitMix = 0;
    let totalPrice = 0;

    orderListItems.forEach(item => {
        const parts = item.value.split("x ");
        const quantity = parseInt(parts[0].trim());
        const name = parts[1].trim();

        if (name === "PETITE MIX") {
            totalPetitMix += quantity;
            totalPrice += quantity * 145; // Adjust the price for Petit Mix if necessary
        } else {
            totalRegularCakes += quantity;
        }
    });

    // Update totalQuantity for regular cakes only
    totalQuantity = totalRegularCakes;

    // Check if only the Petit Mix is ordered
    if (totalRegularCakes === 0 && totalPetitMix > 0) {
        totalPriceElement.value = `Total pris: ${totalPetitMix * 145} DKK`;
        return;
    }

    // Check if there are no cakes in the order list
    if (totalRegularCakes === 0 && totalPetitMix === 0) {
        // No cakes in the order list
        totalPriceElement.value = "Vælg venligst mindst 4 kager";
        return;
    }

    // Check for an odd number of regular cakes
    if (totalRegularCakes % 2 !== 0) {
        totalPriceElement.value = `Ulige antal kager`;
        return;
    }

    // Calculate price for regular cakes
    if (totalRegularCakes == 1) {
        totalPriceElement.value = `Du mangler 3 kager`;
        return;
    } else if (totalRegularCakes == 2) {
        totalPriceElement.value = `Du mangler 2 kager`;
        return;
    } else if (totalRegularCakes == 3) {
        totalPriceElement.value = `Du mangler 1 kage`;
        return;
    } else if (totalRegularCakes == 4) {
        totalPrice += 188;
    } else if (totalRegularCakes == 6) {
        totalPrice += 280;
    } else if (totalRegularCakes == 8) {
        totalPrice += 188 * 2;
    } else if (totalRegularCakes == 10) {
        totalPrice += 280 + 188;
    } else if (totalRegularCakes == 12) {
        totalPrice += 280 * 2;
    } else if (totalRegularCakes == 14) {
        totalPrice += 280 + 188 * 2;
    } else if (totalRegularCakes == 16) {
        totalPrice += 280 * 2 + 188;
    } else if (totalRegularCakes == 18) {
        totalPrice += 280 * 3;
    } else if (totalRegularCakes == 20) {
        totalPrice += 280 * 2 + 188 * 2;
    } else {
        alert("Du kan maksimalt vælge 20 kager brug venligst kontakt formularen på kontakt os siden");
        return;
    }

    // Update total price
    totalPriceElement.value = `Total pris: ${totalPrice} DKK`;
}
function formSubmit(event) {
    event.preventDefault();

    const orderListItems = document.querySelectorAll(".koeb-liste");
    let totalRegularCakes = 0;
    let totalPetitMix = 0;

    // Clear previous hidden inputs
    const hiddenInputs = document.querySelectorAll(".order-detail");
    hiddenInputs.forEach(input => input.remove());

    orderListItems.forEach(item => {
        const parts = item.value.split("x ");
        const quantity = parseInt(parts[0].trim());
        const name = parts[1].trim();

        if (name === "PETITE MIX") {
            totalPetitMix += quantity;
        } else {
            totalRegularCakes += quantity;
        }

        // Create a hidden input for each cake in the order list
        const hiddenInput = document.createElement("input");
        hiddenInput.type = "hidden";
        hiddenInput.readOnly = true;
        hiddenInput.name = `Bestilte Kager`;
        hiddenInput.value = `${quantity}x ${name}`;
        hiddenInput.classList.add("order-detail");
        form.appendChild(hiddenInput);
    });

    // Update totalQuantity for regular cakes only
    totalQuantity = totalRegularCakes;

    if (totalRegularCakes < 4) {
        alert("Vælg venligst mindst 4 af de almindelige kager.");
    } else if (totalRegularCakes > 20) {
        alert("Du kan maksimalt vælge 20 af de almindelige kager.");
    } else if (totalRegularCakes % 2 !== 0){
        alert("du har valgt et ulige antal kager du skal vælge et lige antal,")
    } else{
        form.submit();
    }
}

// Add an event listener to call formSubmit
const form = document.querySelector(".form");
form.addEventListener("submit", formSubmit);


