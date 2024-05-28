
"use strict"
// DOMContentLoaded, sørger for at den loader content på siden først
document.addEventListener("DOMContentLoaded", function() {
//    forskellige billede sources i et array,
    let images = ["/pictures/infographic/ig-aeblekage.webp","/pictures/infographic/ig-banoffee.webp","/pictures/infographic/ig-fragilite.webp","/pictures/infographic/ig-hindbaer.webp","/pictures/infographic/ig-peach.webp","/pictures/infographic/ig-yuzu.webp"];
    let currentIndex = 0;
    let currentImage = document.getElementById('image-swap-om-os');

    function changeImage() {
        // Fade out  current image
        currentImage.style.opacity = 0;

        setTimeout(function() {
            // ændre image source til næste image
            currentIndex = (currentIndex + 1) % images.length;
            currentImage.src = images[currentIndex];

            // Fade in ny image
            currentImage.style.opacity = 1;
        }, 1500); // css transtision duration/tid
    }
    // længden mellem hvert image swap, 10000ms/10 sek
    setInterval(changeImage, 8000);
});
