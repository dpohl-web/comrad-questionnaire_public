import { CATVALUESCOUNTALLCACTION } from '../actions';
import { GO_BACK_ONE_PAGE } from '../actions';

export default function count_blocks(state = 0, action) {
    switch (action.type) {
        case CATVALUESCOUNTALLCACTION:
            state += action.blocks_of_current_page;
            return state;
        case GO_BACK_ONE_PAGE:
                state -= action.blocks_of_current_page;
                return state;
        default:
            return state;
    }
}