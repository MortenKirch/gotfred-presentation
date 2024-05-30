// DOMContentLoaded, sørger for at den loader content på siden først
document.addEventListener("DOMContentLoaded", function() {
//    forskellige billede sources i et array,
    let images = ["pictures/cafe-1.webp", "pictures/cafe-2.webp", "pictures/cafe-3.webp", "pictures/cafe-4.webp"];
    let currentIndex = 0;
    let currentImage = document.getElementById('gotfred-cafe-image');

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
    setInterval(changeImage, 5000);
    
});
