import { createSelector } from 'reselect';
import { translationObject } from '../constants/translation';

const getContentLanguage = state => state.language;
/* eslint-disable import/prefer-default-export */
export const getUiLanguageSelector = createSelector(
	[getContentLanguage],
	(contentLanguage) => {
		const uiLanguage = getUiLanguage(contentLanguage);
		return uiLanguage;
	}
);

/**
 * Detect the language for the ui. If content language is available in ui languages, we use it.
 * If content language is more specific (e.g. de-de) we search for fallback as de in ui languages if de-de is not available
 * If not. we use english.
 *
 * @param {string} contentLanguage // The string with content language
 * @returns {string} ui locale string with fallback to en
 */
const getUiLanguage = (contentLanguage) => {
	const uiLanguages = Object.keys(translationObject);
    const indexOfContentLanguageMinus = contentLanguage.indexOf('-');
    let uiLanguage = 'en';
    const isCompleteLanguage = uiLanguages.find((value) => value === contentLanguage);

    if (isCompleteLanguage) {
        uiLanguage = isCompleteLanguage;
    } else if (!isCompleteLanguage && (indexOfContentLanguageMinus !== -1)) { // Look for fallback language of the same language (e.g. de instead of de-BE)
        const shortContentLanguage = contentLanguage.substring(0, indexOfContentLanguageMinus);
        const isShortCompleteLanguage = uiLanguages.find((value) => value === shortContentLanguage);

        if(isShortCompleteLanguage) {
            uiLanguage = isShortCompleteLanguage;
        }
    }
    
    return uiLanguage;
};
