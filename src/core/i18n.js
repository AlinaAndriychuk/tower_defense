import en from '../locales/en';

const languages = {
    en,
};

let currentLang = 'en';

const i18n = {
    setLang(langCode) {
        if (languages[langCode]) {
            currentLang = langCode;
        } else {
            console.warn(`Language ${langCode} not found. Falling back to "en".`);
            currentLang = 'en';
        }
    },
    _has(id) {
        return id in languages[currentLang];
    },
    get(id) {
        if (this._has(id)) {
            return languages[currentLang][id];
        } else {
            console.warn(`Text with id '${id}' not found.`);
            return id;
        }
    }
};

export default i18n;