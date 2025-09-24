import { CATVALUESCOUNTALLCACTION } from '../actions';
import { GO_BACK_ONE_PAGE } from '../actions';

export default function count_pages(state = 0, action) {
    switch (action.type) {
        case CATVALUESCOUNTALLCACTION:
        case GO_BACK_ONE_PAGE:
            state = action.page_new;
            
            return state;
        default:
            
            return state;
    }
}