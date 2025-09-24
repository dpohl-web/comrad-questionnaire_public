import { combineReducers } from 'redux';
import test from './test';
import questionnaireData from './questionData';
import categories_pages_quantity from './categoriesQuantity';
import count_cats from './countCats';
import count_pages from './countPages';
import language from './language';
import count_blocks from './countBlocks';
import values_not_for_categories from './valuesNotForCategories';
import pdfIsCreating from './pdfIsCreating';
import getPreviousSurveyData from './getPreviousSurveyData';
import backendInfos from './backend_infos';
import questIsUploading from './quest_is_uploading';





const Reducer = combineReducers({
    test,
    questionnaireData,
    categories_pages_quantity,
    count_cats,
    count_pages,
    language,
    count_blocks,
    values_not_for_categories,
    pdfIsCreating,
    getPreviousSurveyData,
    backendInfos,
    questIsUploading
});

export default Reducer;