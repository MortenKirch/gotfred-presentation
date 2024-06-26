"use strikt"
// DOMContentLoaded, sørger for at den loader content på siden først
document.addEventListener("DOMContentLoaded", function() {
//    forskellige billede sources i et array,
    let images = [ "/pictures/billede-catering-4.webp", "/pictures/billede-catering-5.webp",  "/pictures/billede-catering-3.png","/pictures/billede-catering-6.webp", "/pictures/billede-catering-7.webp"];
    let currentIndex = 0;
    let currentImage = document.getElementById('catering-image');

    function changeImage() {
        // Fade out  current image
        currentImage.style.opacity = 0;

        setTimeout(function() {
            // ændre image source til næste image
            currentIndex = (currentIndex + 1) % images.length;
            currentImage.src = images[currentIndex];

            // Fade in ny image
            currentImage.style.opacity = 1;
        }, 1000); // css transtision duration/tid
    }
    // længden mellem hvert image swap, 5000ms/5 sek
    setInterval(changeImage, 8000);
    
});
