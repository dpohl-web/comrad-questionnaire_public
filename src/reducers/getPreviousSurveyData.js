import { PREVIOUS_SURVEY_LOADING_ACTION, DELETE_COMPARE_LIST_ELEMENT, PUSH_RESULT_TO_COMPARE_LIST } from '../actions';

/**
 * state has to be
 * {
 * 	isSurveyLoading: boolean;
 * 	data: [{
 * 		data: number[];
 * 		label: string;
 * 		token: string;
 * 	}];
 *  status: string;
 *  message: string;
 * }
 */
export default function getPreviousSurveyData(state = { isSurveyLoading: false, data: [], status: '', message: '' }, action) {
	switch (action.type) {
		case PREVIOUS_SURVEY_LOADING_ACTION:
			
			state = {
				...state,
				isSurveyLoading: action.data.isSurveyLoading,
				data:
					action.data.newData && action.data.newData.data && action.data.newData.status === 'success'
						? [...state.data, action.data.newData.data]
						: [...state.data],
				status: action.data.newData.status,
				message: action.data.newData.message,
			};
			
			return state;
		case DELETE_COMPARE_LIST_ELEMENT: {
			
			const newData = [...state.data];
			newData.splice(action.index, 1);
			state = {
				...state,
				data: newData,
			};
			
			return state;
		}
		case PUSH_RESULT_TO_COMPARE_LIST: {
			
			const newData = [...state.data];
			const resultData = { data: action.data.data, label: action.data.label, token: 'from-result' };
			newData.push(resultData);

			state = {
				...state,
				data: newData,
			};
			
			return state;
		}
		default:
			
			return state;
	}
}
