// import { cloneDeep } from 'lodash';

export default function changePlaceholderInString(string, returnValues) {
	const reg = /%%#\w{4,}#%%/g;
	const foundArray = string.match(reg);
	let replaceString;
	let i = 0;
	let mapObject = {};
	let replaceReg;
	let returnString;

	if (foundArray) {
		for (i; i < foundArray.length; i++) {
			const bIndex = foundArray[i].indexOf('b');
			const afterBIndex = foundArray[i].indexOf('#%');
			const pageNumber = foundArray[i].substring(4, bIndex);
			const blockNumber = foundArray[i].substring(bIndex + 1, afterBIndex);
			replaceString = returnValues[pageNumber - 1][blockNumber - 1];
			mapObject = { ...mapObject, [foundArray[i]]: replaceString };
		}

		replaceReg = new RegExp(Object.keys(mapObject).join('|'), 'gi');

		returnString = string.replace(replaceReg, matched => mapObject[matched]);
		return returnString;
	}
	return string;
}

export const generateKey = pre => `${pre}_${new Date().getTime()}`;

export function generateChartDataSetFromResult(questionnaireData) {
	const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
	const today = new Date();
	const completeToday = today.toLocaleTimeString('en-EN', options);

	const resultDataSet = {};
	const newArray = [];
	questionnaireData.categories.forEach(oneCat => {
		if (oneCat.evaluateCategory === '1') {
			oneCat.categoryPages.forEach(onePage => {
				if (onePage.pageEvaluate === '1') {
					onePage.blocks.forEach((oneBlock, y) => {
						newArray.push(getValues(onePage.savedFormValues, y));
					});
				}
			});
		}
	});
	resultDataSet.data = newArray;
	resultDataSet.label = completeToday;
	resultDataSet.fileName = questionnaireData.config.questionnaireFileName;

	return resultDataSet;
}

export function getValues(catvaluesDiagramObject, blockIndex) {
    let key;
    const regEx = new RegExp(`^${blockIndex}(_d+)*`, 'g');
    let value = 0;
    for (key in catvaluesDiagramObject) {
        if (key.match(regEx)) {
            value += parseInt(catvaluesDiagramObject[key], 10);
        }
    }

    return value;
};


/**
 * takes a string phrase and breaks it into separate phrases
 * no bigger than 'maxwidth', breaks are made at complete words.
 */
export function formatLabel(str, maxwidth) {
	const sections = [];
	const words = str.split(' ');
	let temp = '';

	words.forEach((item, index) => {
		if (temp.length > 0) {
			const concat = `${temp} ${item}`;

			if (concat.length > maxwidth) {
				sections.push(temp);
				temp = '';
			} else if (index == words.length - 1) {
				sections.push(concat);
				return;
			} else {
				temp = concat;
				return;
			}
		}

		if (index == words.length - 1) {
			sections.push(item);
			return;
		}

		if (item.length < maxwidth) {
			temp = item;
		} else {
			sections.push(item);
		}
	});

	return sections;
}
