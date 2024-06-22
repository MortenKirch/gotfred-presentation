function googleTranslateElementInit() {
    new google.translate.TranslateElement({
        pageLanguage: 'en',
        includedLanguages: 'en,fr,es,de,it,zh-CN,ja,ko,pt,ru', // Specify languages you want to support
        layout: google.translate.TranslateElement.InlineLayout.SIMPLE
    }, 'google_translate_element'
);
}