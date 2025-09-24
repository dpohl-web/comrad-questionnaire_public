import { GETQUESTIONNAIRESAGAACTION } from '../sagas/sagas';

export default function categories_pages_quantity(state = {}, action) {
	switch (action.type) {
		case GETQUESTIONNAIRESAGAACTION: {
			const questionnaireData = action.data;
			if (typeof action.data.questFound === 'undefined') {
				state.cats = {};
				state.cats_quantity = questionnaireData.categories instanceof Array ? questionnaireData.categories.length : 1;

				// TODO: still needed? allways array cause of the saga function?
				if (questionnaireData.categories instanceof Array) {
					// no matter if array or not! first cat is 0 and second 1 etc...
					questionnaireData.categories.forEach((category, i) => {
						state.cats[i] = {};
						state.cats[i].pages = category.categoryPages instanceof Array ? category.categoryPages.length : 1;
					});
				} else {
					state.cats[0].pages =
						questionnaireData.categories.categoryPages instanceof Array
							? questionnaireData.categories.categoryPages.length
							: 1;
				}
			}

			return state;
		}
		default:
			return state;
	}
}
