import { PDF_IS_CREATING_ACTION } from '../actions';

export default function pdfIsCreating(state = { isLoading: false, responseString: '', status: '' }, action) {
    switch (action.type) {
    case PDF_IS_CREATING_ACTION: {
        
        const newstate = { ...action.value };
        return newstate;
    }
    default:
        
        return state;
    }
}
