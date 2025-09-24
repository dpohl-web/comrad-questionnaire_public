import { CATVALUESCOUNTALLCACTION } from '../actions';
import { GO_BACK_ONE_PAGE } from '../actions';

export default function count_cats(state = 0, action) {
    switch (action.type) {
        case CATVALUESCOUNTALLCACTION:
        case GO_BACK_ONE_PAGE:
            state = action.cat_new;
            
            return state;
        default:
            
            return state;
    }
}