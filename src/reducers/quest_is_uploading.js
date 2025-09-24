import { QUEST_IS_UPLOADING } from '../actions';

export default function questIsUploading(state = { isLoading: false, message: '', status: '', token: '' }, action) {
    switch (action.type) {
    case QUEST_IS_UPLOADING: {
        
        const newstate = { isLoading: action.data.isLoading , ...action.data.newData };
        
        return newstate;
    }
    default:
        
        return state;
    }
}
