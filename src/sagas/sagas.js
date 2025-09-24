// import { delay } from 'redux-saga'
import { put, takeLatest, all, call } from 'redux-saga/effects';
// import { delay } from 'redux-saga';
import $ from 'jquery';
import { cloneDeep } from 'lodash';
import {
	GETQUESTIONNAIREACTION,
	GET_PDF_DOWNLOAD_LINK_ACTION,
	PDF_IS_CREATING_ACTION,
	GET_PREVIOUS_SURVEY_ACTION,
	PREVIOUS_SURVEY_LOADING_ACTION,
	UPLOAD_SURVEY_DATA_ACTION,
	GET_BACKEND_INFOS_SAGA_ACTION,
	QUEST_IS_UPLOADING
} from '../actions';
import { PDF_CREATE_PATH, GET_PDF_PATH, PDF_CSS_FILENAME, BASE_BACKEND_URL, XML_PATH } from '../constants/config';

export const GETQUESTIONNAIRESAGAACTION = 'get_questionnaire_saga_action';
export const GET_PDF_DOWNLOAD_SAGA_ACTION = 'get_pdf_saga_action';

function getQuestionPromise(source) {
	return new Promise((resolve, reject) => {
		$.ajax({
			url: source.path,
			// xhrFields: {
			//     withCredentials: true
			// },
			method: 'POST',
			data: source.data,
			dataType: 'json',
		})
			.done(data => {
				data = JSON.parse(JSON.stringify(data).replace(/"\s+|\s+"/g, '"'));
				if (data) {
					data.recomendationsAreUsedInCategory = false;
				}
				if(!data.config) {
					resolve({ questFound: false });
					return;
				}
				if (data.config.language.languages instanceof Array === false) {
					data.config.language.languages = [data.config.language.languages];
				}

                // Fallback for old questionnaires with ownbar
                if (data.config.graphs.default === 'ownbar') {
					data.config.graphs.default = 'bar';
				}

                const ownbarOptionIndex = data.config.graphs.graphSwitchOptions.options.indexOf('ownbar');
                if (ownbarOptionIndex !== -1) { // We have ownbar in list of options
                    const barOptionIndex = data.config.graphs.graphSwitchOptions.options.indexOf('bar');

                    if (barOptionIndex === -1) {
                        data.config.graphs.graphSwitchOptions.options.splice(ownbarOptionIndex, 1, 'bar'); // Change ownbar to bar
                    } else {
                        data.config.graphs.graphSwitchOptions.options.splice(ownbarOptionIndex, 1); // Delete ownbar
                    }
				}

				data.number_of_blocks_overall = 0;
				if (data.categories instanceof Array === false) {
					const categories = cloneDeep(data.categories);
					data.categories = [];
					data.categories[0] = categories;
				}

				if (data.config.graphs.graphSwitchOptions.options instanceof Array === false) {
					data.config.graphs.graphSwitchOptions.options = [data.config.graphs.graphSwitchOptions.options];
				}
				data.maxValueInAllCategories = 0;
				data.categories.forEach((category, categoryIndex) => {
					// We need the max value for every category for the recommendations
					data.categories[categoryIndex].maxAchievablePointsInThisCategory = 0;
					if (category.recommendationsIsUsed && (category.recommendationsIsUsed === '1')) {
						data.recomendationsAreUsedInCategory = true;
					}

					// We need the ranges for the recommendations in array if we have the plugin installed
					if ((typeof data.config.recommendationsIsUsed !== 'undefined') && (data.config.recommendationsIsUsed === '1') && (category.recommendationsGroup.recommendationsRanges instanceof Array === false)) {
						category.recommendationsGroup.recommendationsRanges = [category.recommendationsGroup.recommendationsRanges];
					}

					// Only in the react app because we need rgba in the whole app
					if (category.catcolor) {
						let newCatColor = category.catcolor.replace('rgb', 'rgba');
						newCatColor = newCatColor.replace(')', ',1)');
						category.catcolor = newCatColor;
					}

					if (category.categoryPages instanceof Array === false) {
						const categoryPages = cloneDeep(category.categoryPages);
						category.categoryPages = [];
						category.categoryPages[0] = categoryPages;
					}
					category.categoryPages.forEach((currentPage, pageIndex) => {
						if (currentPage.blocks instanceof Array === false) {
							const blocks = cloneDeep(currentPage.blocks);
							currentPage.blocks = [];
							currentPage.blocks[0] = blocks;
						}

						currentPage.blocks.forEach((currentBlock, blockIndex) => {
							currentBlock.key = `block-key${categoryIndex}${pageIndex}${blockIndex}`;
							data.number_of_blocks_overall += 1;
							let blockMaxValue = 0;
							// const max = 0; // max answerValue from all blockAnswers of the block (if radio or input) or all values together (if checkbox)
							if (currentBlock.blockAnswers instanceof Array === false) {
								const blockAnswers = cloneDeep(currentBlock.blockAnswers);
								currentBlock.blockAnswers = [];
								currentBlock.blockAnswers[0] = blockAnswers;
							}

							currentBlock.blockAnswers.forEach((one_answer, i) => {
								const intAnswerValue = parseInt(one_answer.answerValue, 10);
								currentBlock.blockAnswers[i].answerValue = intAnswerValue;
								if (data.categories[categoryIndex].evaluateCategory === '1') {
									if (currentBlock['@attributes'].type === 'check') {
										blockMaxValue += intAnswerValue;
									}
									if (currentBlock['@attributes'].type === 'inputrange') {
										if (i === 1) {
											blockMaxValue = intAnswerValue;
										}
									}
									if (currentBlock['@attributes'].type === 'radio') {
										if (blockMaxValue < intAnswerValue) {
											blockMaxValue = intAnswerValue;
										}
									}
									
								}
							});
							if (data.categories[categoryIndex].evaluateCategory === '1') {
								if (blockMaxValue > data.maxValueInAllCategories) {
									data.maxValueInAllCategories = blockMaxValue;
								}
								data.categories[categoryIndex].maxAchievablePointsInThisCategory += blockMaxValue;
							}

							// if (
							//     currentBlock['@attributes'].type === 'radio' &&
							//     currentPage.pageEvaluate !== '0'
							// ) {
							//     currentBlock.blockAnswers.forEach(one_answer => {
							//         // iterate over anwers to get the highest answerValue of all blockAnswers. Than norm them to 10 as max answerValue
							//         if (parseInt(one_answer.answerValue, 10) > max) {
							//             max = parseInt(one_answer.answerValue, 10);
							//         }
							//     });
							//     currentBlock.blockAnswers.forEach((one_answer, i) => {
							//         // norm the values to 10
							//         const newvalue =
							//             parseInt(
							//                 currentBlock.blockAnswers[i].answerValue,
							//                 10
							//             ) / max;
							//         currentBlock.blockAnswers[i].standardizedAnswerValue = Math.round(
							//             newvalue * 10
							//         ); // round 0 decimals;
							//     });
							// }

							// if (
							//     currentBlock['@attributes'].type === 'check' &&
							//     currentPage.pageEvaluate !== '0'
							// ) {
							//     currentBlock.blockAnswers.forEach(one_answer => {
							//         // iterate over anwers to get the highest answerValue of all blockAnswers. Than norm them to 10 as max answerValue
							//         max += parseInt(one_answer.answerValue, 10);
							//     });
							//     currentBlock.blockAnswers.forEach((one_answer, i) => {
							//         // norm the values to 10
							//         const newvalue =
							//             parseInt(
							//                 currentBlock.blockAnswers[i].answerValue,
							//                 10
							//             ) / max;
							//         currentBlock.blockAnswers[i].answerValue = Math.round(
							//             newvalue * 10
							//         ); // round 0 decimals;
							//     });
							// }

							// if (
							//     currentBlock['@attributes'].type ===
							//         'inputrange' &&
							//     currentPage.pageEvaluate !== '0'
							// ) {
							//     max = parseInt(
							//         currentBlock.blockAnswers[0].answerValue[1],
							//         10
							//     ); // the second answerValue is allways the max answerValue at inputrange
							//     currentBlock.blockAnswers[0].answerValue[0] = Math.round(
							//         (currentBlock.blockAnswers[0].answerValue[0] / max) * 10
							//     ); // norm the values to 10 as maximum
							//     currentBlock.blockAnswers[0].answerValue[1] = Math.round(
							//         (currentBlock.blockAnswers[0].answerValue[1] / max) * 10
							//     );
							// }
						});
					});
				});
				resolve(data);
			})
			.fail(err => {
				reject(err);
			});
	});
}

function getPdfLinkPromise(params) {
	return new Promise((resolve, reject) => {
		$.ajax({
			url: PDF_CREATE_PATH,
			// xhrFields: {
			//     withCredentials: true
			// },
			method: 'POST',
			data: {
				htmlString: params[0],
				needsHead: 1,
				pdfcss: PDF_CSS_FILENAME,
				email: params[1],
				pdfEmailPassword: params[2],
				questionnaireFileName: params[3]
			},
			dataType: 'json',
		})
			.done(data => {
				// filename
				resolve(data);
			})
			.fail(err => {
				reject(err);
			});
	});
}

function makeRequest(pdfName, method) {
	// Create the XHR request
	const request = new XMLHttpRequest();

	// Return it as a Promise
	return new Promise((resolve, reject) => {
		// Setup our listener to process compeleted requests
		request.onreadystatechange = function() {
			// Only run if the request is complete
			if (request.readyState !== 4) return;

			// Process the response
			if (request.status >= 200 && request.status < 300) {
				// If successful
				resolve(request);
			} else {
				// If failed
				reject(new Error({
					status: request.status,
					statusText: request.statusText,
				}));
			}
		};

		// Setup our HTTP request
		request.open(method || 'GET', GET_PDF_PATH, true);
		request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
		request.responseType = 'blob';

		// Send the request
		request.send(`pdfName=${pdfName}`);
	});
}

function getPdfPromise(pdfName) {
	
	
	return makeRequest(pdfName, 'POST').then(request => {
		const filename = 'result.pdf';

		const blob = new Blob([request.response], {
			type: 'application/pdf',
		});
		const link = document.createElement('a');
		link.href = window.URL.createObjectURL(blob);
		link.download = filename;

		document.body.appendChild(link);

		link.click();

		document.body.removeChild(link);
		return request;
	});
}

function* watchGetPdfLinkAction() {
	yield takeLatest(GET_PDF_DOWNLOAD_LINK_ACTION, getPdfLinkSagaAction);
}

function* watchGetQuestionnaire() {
	yield takeLatest(GETQUESTIONNAIREACTION, getQuestionSagaAction);
}

function* getPdfLinkSagaAction(action) {
	let data;
	let value = { isLoading: true, responseString: '', status: '' };
	yield put({ type: PDF_IS_CREATING_ACTION, value });
	try {
		data = yield call(getPdfLinkPromise, [action.htmlString, action.email, action.pdfEmailPassword, action.questionnaireFileName]);

		if (data.filename === 'byemail') {
			value = {
				isLoading: false,
				responseString: data.message,
				status: data.status,
			};
			yield put({ type: PDF_IS_CREATING_ACTION, value });
		} else if (data.status === 'success') {
			value = {
				isLoading: true,
				responseString: data.message,
				status: data.status,
			};
			yield put({ type: PDF_IS_CREATING_ACTION, value });
			
			try {
				data = yield call(getPdfPromise, data.filename);
				value = {
					isLoading: false,
					responseString: '',
					status: '',
				};
				yield put({ type: PDF_IS_CREATING_ACTION, value });
			} catch (err) {
				value = {
					isLoading: false,
					responseString: `${err.status}: ${err.statusText}`,
					status: 'fail',
				};
				yield put({ type: PDF_IS_CREATING_ACTION, value });
			}
		} else {
			value = {
				isLoading: false,
				responseString: data.message,
				status: data.status,
			};
			yield put({ type: PDF_IS_CREATING_ACTION, value });
		}

	} catch (err) {
		value = {
			isLoading: false,
			responseString: `${err.status}: ${err.statusText}`,
			status: 'fail',
		};
		yield put({ type: PDF_IS_CREATING_ACTION, value });
	}

	// try {
	//     const response = yield call(getPdfPromise, data.filename);
	//     value = { isLoading: false, responseString: response.message };
	//     yield put({ type: PDF_IS_CREATING_ACTION, value });

	// } catch (err) {
	//     // value = { isLoading: false, responseString: `${err.status}: ${err.statusText}` };
	//     // yield put({ type: PDF_IS_CREATING_ACTION, value });
	//     
	// }
}

function getBackendInfosPromise() {
	return new Promise((resolve, reject) => {
		$.ajax({
			url: XML_PATH,
			// xhrFields: {
			//     withCredentials: true
			// },
			method: 'POST',
			data: { infos: 'true' },
			dataType: 'json',
		})
			.done(data => {
				resolve(data);
			})
			.fail(err => {
				reject(err);
			});
	});
}

function* getQuestionSagaAction(action) {
	try {
		const backendInfos = yield call(getBackendInfosPromise);
		yield put({ type: GET_BACKEND_INFOS_SAGA_ACTION, backendInfos });
	} catch (err) {
		console.error('error getQuestionSagaAction', err);
	}

	try {
		const data = yield call(getQuestionPromise, action.source);
		yield put({ type: GETQUESTIONNAIRESAGAACTION, data });
		
	} catch (err) {
		console.error('error getQuestionSagaAction 2', err);
	}
}

function* watchgetPreviousSurveyDataAction() {
	yield takeLatest(GET_PREVIOUS_SURVEY_ACTION, getPreviousSurveyDataAction);
}

function* getPreviousSurveyDataAction(action) {
	
	yield put({ type: PREVIOUS_SURVEY_LOADING_ACTION, data: { isSurveyLoading: true, newData: { status: '', message: '' } } });
    try {
		const data = yield call(getPreviousSurveyPromise, action.data);
		
		yield put({ type: PREVIOUS_SURVEY_LOADING_ACTION, data: { isSurveyLoading: false, newData: data } });
	} catch (err) {
		
		yield put({ type: PREVIOUS_SURVEY_LOADING_ACTION, data: { isSurveyLoading: false, newData: { status: 'error', message: 'connectionError' } } });
	}
}

function getPreviousSurveyPromise(getData) {
    // const testobject = {
	// 	data: [2, 3, 4, 5, 6, 7],
	// 	label: 'testlabel'
	// };
	
	return new Promise((resolve, reject) => {
		$.ajax({
			url: `${BASE_BACKEND_URL}wp-json/comrad/v1/comrad-compare-getdata`,
			// xhrFields: {
			//     withCredentials: true
			// },
			method: 'POST',
			data: {
				getData
			},
			dataType: 'json',
		})
			.done(data => {
				// filename
				resolve(data);
			})
			.fail(err => {
				reject(err);
        	});
	});
}

function* watchuploadSurveyDataAction() {
	yield takeLatest(UPLOAD_SURVEY_DATA_ACTION, uploadSurveyDataSaga);
}

function* uploadSurveyDataSaga(action) {
	
    yield put({ type: QUEST_IS_UPLOADING, data: { isLoading: true, newData: null } });
    try {
		const data = yield call(uploadResultData, action.data);
		
		yield put({ type: QUEST_IS_UPLOADING, data: { isLoading: false, newData: data } });
	} catch (err) {
		
		yield put({ type: QUEST_IS_UPLOADING, data: { isLoading: false, newData: { status: 'fail', message: 'connectionError' } } });
	}
}

function uploadResultData(resultData) {
	return new Promise((resolve, reject) => {
		$.ajax({
			url: `${BASE_BACKEND_URL}wp-json/comrad/v1/comrad-compare-setgetdata`,
			// xhrFields: {
			//     withCredentials: true
			// },
			method: 'POST',
			data: {
				resultData
			},
			dataType: 'json',
		})
			.done(data => {
				// filename
				resolve(data);
			})
			.fail(err => {
				reject(err);
			});
	});
}

export default function* rootSaga() {
	yield all([
		watchGetQuestionnaire(),
		watchGetPdfLinkAction(),
		watchgetPreviousSurveyDataAction(),
		watchuploadSurveyDataAction()
	]);
}
