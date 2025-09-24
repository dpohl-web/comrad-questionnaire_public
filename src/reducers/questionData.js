import { GETQUESTIONNAIRESAGAACTION } from '../sagas/sagas';
import { CATVALUESCOUNTALLCACTION, SAVE_FORM_VALUES } from '../actions';

export default function questionnaireData(state = false, action) {
    switch (action.type) {
    case GETQUESTIONNAIRESAGAACTION: {
        const newQuestionnaireData = action.data;
        
        

        return newQuestionnaireData;
    }
    case SAVE_FORM_VALUES:
    case CATVALUESCOUNTALLCACTION:
        const {
            cat,
            count_pages,
            savedFormValues
        } = action;
        const newState = { ...state };

        newState.categories[cat].categoryPages[count_pages].savedFormValues = savedFormValues;
        
        return newState;
    default:
        
        return state;
    }
}
