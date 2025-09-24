import produce from 'immer';
import { GET_BACKEND_INFOS_SAGA_ACTION } from '../actions';

export default produce(
	(draft, action) => {
		switch (action.type) {
			case GET_BACKEND_INFOS_SAGA_ACTION:
				Object.keys(action.backendInfos).forEach(key => {
					draft[key] = action.backendInfos[key];
				});
		}
	},
	{ is_compare: false }
);
