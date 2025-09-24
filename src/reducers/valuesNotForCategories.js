import { CATVALUESCOUNTALLCACTION } from '../actions';

export default function values_not_for_categories(state = [], action) {
    switch (action.type) {
        case CATVALUESCOUNTALLCACTION:
            state = action.values_not_for_categories;
            return state;
        default:
            return state;
    }
}