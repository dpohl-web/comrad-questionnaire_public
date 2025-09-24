const devBuild = false;
const devMode = false;
export const VERSION = "1.1.6";
// const devBackendDomain = 'http://wp.vips.lokal/';
// const devBackendDomain = 'http://wp.questionnaire.local/';
const devBackendDomain = 'http://wp.gsd.lokal/';
// const prodBackendDomain = 'https://reveal-eu.org/';
const prodBackendDomain = `${window.location.origin}/`
// const prodBackendDomain = 'http://wp.survey.lokal/';
// const prodBackendDomain = 'http://wp.questionnaire.local/';

if (devMode) {
    window.__INITIAL_STATE__.questFilename = 'newbla66';
}

export const XML_PATH =
	devMode || devBuild
		? `${devBackendDomain}wp-json/comrad/v1/get-public-questionaire`
		: `${prodBackendDomain}wp-json/comrad/v1/get-public-questionaire`;
export const COUNT_PATH =
	devMode || devBuild
		? `${devBackendDomain}wp-json/comrad/v1/counter`
		: `${prodBackendDomain}wp-json/comrad/v1/counter`;

export const PDF_CREATE_PATH =
	devMode || devBuild
		? `${devBackendDomain}wp-json/comrad/v1/create-pdf`
		: `${prodBackendDomain}wp-json/comrad/v1/create-pdf`;

export const GET_PDF_PATH =
	devMode || devBuild
		? `${devBackendDomain}wp-json/comrad/v1/get-pdf`
		: `${prodBackendDomain}wp-json/comrad/v1/get-pdf`;

export const BASE_BACKEND_URL = devMode || devBuild ? devBackendDomain : prodBackendDomain;

export const PDF_CSS_FILENAME = devMode || devBuild ? 'questionnaire' : 'questionnaire';
