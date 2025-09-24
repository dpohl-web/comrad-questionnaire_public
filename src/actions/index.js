export const TESTACTION = 'testaction';
export const GETQUESTIONNAIREACTION = 'get_questionnaire_action';
export const COUNTPAGESACTION = 'count_pages';
export const COUNTCATSACTION = 'count_cats';
export const CATVALUESCOUNTALLCACTION = 'catValuesCountAll';
export const CHANGE_DEFAULT_LANGUAGE_ACTION = 'changedefaultlanguageaction';
export const GET_PDF_DOWNLOAD_LINK_ACTION = 'get_pdf_download_link_action';
export const GET_PDF__ACTION = 'GET_PDF__ACTION';
export const PDF_IS_CREATING_ACTION = 'PDF_IS_CREATING_ACTION';
export const GET_PREVIOUS_SURVEY_ACTION = 'GET_PREVIOUS_SURVEY_ACTION';
export const PREVIOUS_SURVEY_LOADING_ACTION = 'PREVIOUS_SURVEY_LOADING_ACTION';
export const UPLOAD_SURVEY_DATA_ACTION = 'UPLOAD_SURVEY_DATA_ACTION';
export const GET_BACKEND_INFOS_SAGA_ACTION = 'GET_BACKEND_INFOS_SAGA_ACTION';
export const QUEST_IS_UPLOADING = 'QUEST_IS_UPLOADING';
export const DELETE_COMPARE_LIST_ELEMENT = 'DELETE_COMPARE_LIST_ELEMENT';
export const PUSH_RESULT_TO_COMPARE_LIST = 'PUSH_RESULT_TO_COMPARE_LIST';
export const GO_BACK_ONE_PAGE = 'GO_BACK_ONE_PAGE';
export const SAVE_FORM_VALUES = 'SAVE_FORM_VALUES';


export function testAction(hallo) {
    return { type: TESTACTION, hallo };
}

export function getPreviousSurveyDataAction(data) {
    return { type: GET_PREVIOUS_SURVEY_ACTION, data };
}

export function getPreviousSurveyDataAdHocAction(data) {
    return { type: PREVIOUS_SURVEY_LOADING_ACTION, data };
}

export function uploadSurveyDataAction(data) {
    return { type: UPLOAD_SURVEY_DATA_ACTION, data };
}

export function deleteCompareListElement(index) {
    return { type: DELETE_COMPARE_LIST_ELEMENT, index };
}

export function pushResultToCompareList(data) {
    return { type: PUSH_RESULT_TO_COMPARE_LIST, data };
}

export function catValuesCountAll(cat_new, page_new, cat, blocks_of_current_page, values_not_for_categories, count_pages = 0, savedFormValues = {}) {
    return {
        type: CATVALUESCOUNTALLCACTION,
        cat_new,
        page_new,
        cat,
        blocks_of_current_page,
        values_not_for_categories,
        count_pages,
        savedFormValues
    };
}

export function goBackOnePage(cat_new, page_new, blocks_of_current_page) {
    return {
        type: GO_BACK_ONE_PAGE,
        cat_new,
        page_new,
        blocks_of_current_page,
    };
}

export function saveFormValues(cat, count_pages, savedFormValues) {
    return {
        type: SAVE_FORM_VALUES,
        cat,
        count_pages,
        savedFormValues
    };
}

export function getQuestionaireAction(source) {
    return { type: GETQUESTIONNAIREACTION, source };
}

export function getPdfLinkAction(htmlString, email, pdfEmailPassword, questionnaireFileName) {
    return { type: GET_PDF_DOWNLOAD_LINK_ACTION, htmlString, email, pdfEmailPassword, questionnaireFileName };
}

export function changeDefaultLanguageAction(defaultLanguage) {
    return { type: CHANGE_DEFAULT_LANGUAGE_ACTION, defaultLanguage };
}
