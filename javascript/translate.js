function googleTranslateElementInit() {
    new google.translate.TranslateElement({pageLanguage: 'en'}, 'google_translate_element');
}

function translateToLanguage(languageCode) {
    console.log(`Translating to ${languageCode}`);

    function attemptTranslation(retries) {
        const googleTranslateElement = document.querySelector('iframe.goog-te-banner-frame');
        if (googleTranslateElement) {
            try {
                const translateDropdown = googleTranslateElement.contentWindow.document.querySelector('.goog-te-combo');
                if (translateDropdown) {
                    translateDropdown.value = languageCode;
                    translateDropdown.dispatchEvent(new Event('change'));
                    console.log(`Translation to ${languageCode} successful`);
                } else {
                    console.error("Translation dropdown not found.");
                }
            } catch (e) {
                console.error("Error accessing Google Translate iframe:", e);
                if (retries > 0) {
                    console.log("Retrying...");
                    setTimeout(() => attemptTranslation(retries - 1), 1000); // Increased delay
                } else {
                    console.error("Failed to access Google Translate iframe after multiple attempts.");
                }
            }
        } else if (retries > 0) {
            console.log("Google Translate iframe not found. Retrying...");
            setTimeout(() => attemptTranslation(retries - 1), 1000); // Increased delay
        } else {
            console.error("Google Translate iframe not found after multiple attempts.");
        }
    }

    if (!document.querySelector('iframe.goog-te-banner-frame')) {
        new google.translate.TranslateElement({pageLanguage: 'en'}, 'google_translate_element');
        setTimeout(() => {
            attemptTranslation(20); // Increased retry count
        }, 2000); // Increased initial delay
    } else {
        attemptTranslation(20); // Increased retry count
    }
}

function translateToDanish() {
    translateToLanguage('da');
}

function translateToEnglish() {
    translateToLanguage('en');
}

document.addEventListener('DOMContentLoaded', (event) => {
    document.getElementById('translateToDanish').addEventListener('click', translateToDanish);
    document.getElementById('translateToEnglish').addEventListener('click', translateToEnglish);
});
