/* eslint-disable import/prefer-default-export */
export const translationObject = window.questionnaireTranslationObject;

export function tryToTranslate(languageObject, language, string) {
	
	if (typeof languageObject[language][string] !== 'undefined') {
		return languageObject[language][string]
	}
	
	return string;
}
