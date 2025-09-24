import { CHANGE_DEFAULT_LANGUAGE_ACTION } from '../actions';
import { GETQUESTIONNAIRESAGAACTION } from '../sagas/sagas';

// const defaultLanguage = typeof window.__INITIAL_STATE__ !== 'undefined' && typeof window.__INITIAL_STATE__.QUESTIONNAIRE__LANGUAGE != 'undefined' ? window.__INITIAL_STATE__.QUESTIONNAIRE__LANGUAGE : 'en';
const browserLanguage = (() => {
    const browserLocale = window.navigator.language || window.navigator.userLanguage;
    return browserLocale.toLowerCase();
})();

/**
 * Detect the language for the content. If Browser language is available in content languages, we use it.
 * If Browser language is more specific (e.g. de-de) we searhc for fallback as de in content languages if de-de is not available
 * If not. we use the default language of the questionnare.
 *
 * @param {object} contentLanguages // The object with all available content languages
 * @public
 * @returns empty string or locale string
 */
const defaultLanguage = (contentLanguages) => {
    const indexOfBrowserLanguageMinus = browserLanguage.indexOf('-');
    let defaultLocale = '';
    const isCompleteLanguage = contentLanguages.find((value) => value.short === browserLanguage);

    if (isCompleteLanguage) {
        defaultLocale = isCompleteLanguage.short;
    } else if (!isCompleteLanguage && (indexOfBrowserLanguageMinus !== -1)) { // Look for fallback language of the same language (e.g. de instead of de-BE)
        const shortBrowserLanguage = browserLanguage.substring(0, indexOfBrowserLanguageMinus);
        const isShortCompleteLanguage = contentLanguages.find((value) => value.short === shortBrowserLanguage);

        if(isShortCompleteLanguage) {
            defaultLocale = isShortCompleteLanguage.short;
        }
    }
    
    return defaultLocale;
};

// function defaultLanguage(translationsObject, language) {
//     return Object.keys(translationsObject).find((value) => value === language) ? language : 'en';
// }
export default function language(state = 'en', action) {
    switch (action.type) {
    case CHANGE_DEFAULT_LANGUAGE_ACTION: {
        const newState = action.defaultLanguage;
        return newState;
    }
    case GETQUESTIONNAIRESAGAACTION: {

        if (typeof action.data.questFound === 'undefined') {
            let defaultLoc = defaultLanguage(action.data.config.language.languages);
            if (defaultLoc === '') {
                defaultLoc = action.data.config.language.default ? action.data.config.language.default : 'en';
            }
            return defaultLoc;
        }
        return state;
    }
    default:
        return state;
    }
}
