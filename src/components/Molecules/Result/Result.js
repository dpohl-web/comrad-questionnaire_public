import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Transition, animated, SpringRef } from '@react-spring/web';
import Select from 'react-select';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import classnames from 'classnames';
import PulseLoader from 'react-spinners/PulseLoader';
import moment from 'moment';
import './Result.css';
import ResultCalculatorClass from './ResultCalculatorClass';
import { translationObject } from '../../../constants/translation';
import * as helperFunctions from '../../../helpers/helperFunctions';
import ApplicationFooter from '../ApplicationFooter/ApplicationFooter';
import CustomButton from '../../Atoms/CustomButtom/CustomButtom';
import GeneralCheckbox from '../../Atoms/Generalcheckbox/Generalcheckbox';
import DownloadPdf from '../DownloadPdf/DownloadPdf';
import TargetNewCross from '../../svg/target-new-cross';
import CustomCharts from '../CustomCharts/CustomCharts';
import {faCopy, faChartSimple} from '@fortawesome/free-solid-svg-icons'

class Result extends PureComponent {
    transRef = SpringRef();
	resultDataSet = {};
    isVisible = true;

	constructor(props) {
		super(props);
        this.chartRefView = React.createRef();
        this.chartRefPdf = React.createRef();
		this.state = {
			/* eslint-disable-next-line react/destructuring-assignment */
			selectedOption: this.props.questionnaireData.config.graphs.default,
			copiedToClipboard: false,
			isRecommendationInPdf: true,
		};

		this.funcMap = {
			title: this.renderResultHeader,
			graphs: this.renderCharts,
			'editor content': this.renderResultDescription,
			'recommendations': this.renderRecommendations,
		};
	}

	/**
	 * If the result is not in the store in getPreviousSurveyData.data, it has to be stored.
	 * Maybe it was deleted in compare page. Then it is stored here again.
	 */
	componentDidMount() {
		const { pushResultToCompareList, questionnaireData, getPreviousSurveyData } = this.props;
		const resultIsStored = getPreviousSurveyData.data.find(data => data.token === 'from-result');
		if (!resultIsStored) {
			const resultData = helperFunctions.generateChartDataSetFromResult(questionnaireData);

			pushResultToCompareList(resultData);
		}
	}

	handleChange = selectedOption => {
		this.setState({ selectedOption: selectedOption.value });
	};

	uploadResultData = () => {
		const { questionnaireData, uploadSurveyDataAction } = this.props;
		const data = helperFunctions.generateChartDataSetFromResult(questionnaireData);
		uploadSurveyDataAction(data);
	};

	renderSpinner = isactive => {
		const { questionnaireData } = this.props;
		const {
			config: {
				mainColors: { primaryColor },
			},
		} = questionnaireData;

		return (
			<div className="sweet-loading">
				<PulseLoader size={20} color={primaryColor} loading={isactive} />
			</div>
		);
	};

	getDynamicContent = (
		number,
		primaryColor,
		resultPageHeaderTitle,
		resultPageHeaderDescription,
		isNotPdf,
		catLength,
		language,
		selectedOption,
		selectBoxOptions,
		catsWithoutTheGeneralInfos,
		maxValueInAllCategories,
		createPdfOptions,
		backendInfos
	) => {
		const { questionnaireData } = this.props;
		const { isRecommendationInPdf } = this.state;
		const methodList = questionnaireData.config.priorityListObject.priorityList;
		let content = null;
		const method = this.funcMap[methodList[number]];

		if (typeof method === 'function') {
			switch (methodList[number]) {
				case 'title': {
					content = method(primaryColor, resultPageHeaderTitle);
					break;
				}
				case 'graphs': {
					content = method(
						isNotPdf,
						catLength,
						language,
						questionnaireData,
						selectedOption,
						selectBoxOptions,
						catsWithoutTheGeneralInfos,
						maxValueInAllCategories,
						createPdfOptions
					);
					break;
				}
				case 'editor content': {
					content = method(resultPageHeaderDescription);
					break;
				}
				case 'recommendations': {
					if (isNotPdf || isRecommendationInPdf) {
						if (backendInfos.is_recommendations && (questionnaireData.config.recommendationsIsUsed === '1') && questionnaireData.recomendationsAreUsedInCategory) { // Only if the plugin is installed and the global switch is true and in at least one category recommendation is used
							content = method(primaryColor, questionnaireData, language);
						}
					}
					break;
				}
				default: {
					return content;
				}
			}
		}
		return content;
	};

	renderResultHeader = (primaryColor, resultPageHeaderTitle) => (
			<div className="grid-x grid-padding-x align-center result__wrapper">
				<div className="cell small-24">
					<h2 style={{ color: primaryColor }}>{resultPageHeaderTitle}</h2>
				</div>
			</div>
	);

	renderResultDescription = resultPageHeaderDescription => (
		<div className="cell small-24 result_description clearfix">
			<div
				dangerouslySetInnerHTML={{
					__html: resultPageHeaderDescription,
				}}
			/>
		</div>
	);

    getCategoryValues() {
        const { questionnaireData } = this.props;
        let categoryValues = [];
        Object.values(questionnaireData.categories).forEach((category, i) => {
            categoryValues[i] = 0;
            Object.values(category.categoryPages).forEach((page, y) => {
                if(page.savedFormValues){
                    const values = Object.values(page.savedFormValues);
                    categoryValues[i] += values.reduce((a, b) => a + b, 0);
                }
            });
        });

        return categoryValues;
    }

	/**
	 * Only be called, if the plugin is installed and global switch for recommendations is true. And if recommendations should appear in the pdf and it is pdf.
	 * Renders the recommendations.
	 */
	renderRecommendations = (primaryColor, questionnaireData, language) => {
		const { uiLanguage } = this.props;

		return (
			<div className="cell small-24 result_recommendations clearfix">
				<h2 style={{ color: primaryColor }}>{translationObject[uiLanguage].recommendationsTitle}</h2>
				{questionnaireData.categories.map((category, index) => {
					const isEvaluated = category.evaluateCategory === '1';
					const recommendationsIsUsed = category.recommendationsIsUsed === '1';
					let achievedPercentInThisCategory = 0;

                    if (isEvaluated && recommendationsIsUsed) {
						achievedPercentInThisCategory = this.getCategoryValues()[index] / category.maxAchievablePointsInThisCategory * 100;
						const recommendation = this.getRecomendationsRangeForCategory(
								achievedPercentInThisCategory,
								category.recommendationsGroup.recommendationsRanges,
								category.recommendationsGroup.recommendationsContentArray,
								language
							);
						
                        if (recommendation === '') {
                        
                            return null;
                        }
						
                        return (
							<div key={category.categoryName[language]} className="">
								<h3 style={{ color: category.catcolor }}>{category.categoryName[language]}</h3>
								<p
									dangerouslySetInnerHTML={{
										__html: recommendation,
									}}
								/>
							</div>)
							
					}
                    
					return null;
				})}
			</div>
		);

		
		
	};

	getRecomendationsRangeForCategory = (achievedPercentInThisCategory, rangesArray, recommendationsContentArray, language) => {
		const newRangesArray = [...rangesArray, '100'];
		let recommendation = '';
		let decimalRange;
		for(let x = 0; x < newRangesArray.length; x++) {
			decimalRange = parseInt(newRangesArray[x], 10);
			if (achievedPercentInThisCategory <= decimalRange) {
				if (recommendationsContentArray[x].isActive === '0') {
					break;
				}
				recommendation = recommendationsContentArray[x].recommendationContent[language];
				break;
			}
		}
		return recommendation;
	}

	renderCharts = (
		isNotPdf,
		catLength,
		language,
		questionnaireData,
		selectedOption,
		selectBoxOptions,
		catsWithoutTheGeneralInfos,
		maxValueInAllCategories,
		createPdfOptions,
		notCreateSelectBox
	) =>
            (
			<div>
				{isNotPdf && (questionnaireData.config.graphs.showGraphSwitch === '1') && !notCreateSelectBox && (
					<div className="graph-selectbox-wrapper">
						<div className="graph-selectbox">
							<Select
								value={selectedOption}
								onChange={this.handleChange}
								options={selectBoxOptions}
								/* eslint-disable-next-line react/destructuring-assignment */
								placeholder={translationObject[this.props.uiLanguage].selectGraph}
							/>
						</div>
					</div>
				)}
				<div className="result__chart-container-wrapper">
                    <CustomCharts
                        language={language}
                        isNotPdf={isNotPdf}
                        catLength={catLength}
                        questionnaireData={questionnaireData}
                        selectedOption={selectedOption}
                        selectBoxOptions={selectBoxOptions}
                        catsWithoutTheGeneralInfos={catsWithoutTheGeneralInfos}
                        maxValueInAllCategories={maxValueInAllCategories}
                        createPdfOptions={createPdfOptions}
                        chartId={createPdfOptions ? 'customchart-pdf' : 'customchart-view'}
                        containerId={createPdfOptions ? 'containerid-pdf' : 'containerid-view'}
                        chartRefPdf={createPdfOptions ? null : this.chartRefPdf}
                        ref={createPdfOptions ? this.chartRefPdf : this.chartRefView}
                    />
				</div>
			</div>
		);

	renderInterpretationOne = (
		primaryColor,
		language,
		resultImageCategoriesTop,
		resultImageCategoriesRight,
		resultImageCategoriesBottom,
		resultImageCategoriesLeft,
		stylesForInterpretations,
		interpretationOne
	) => (
		<div className="grid-x grid-padding-x result__wrapper result__wrapper--interpretation-one">
			<div className="cell small-24">
				<h3 style={{ color: primaryColor }}>{`${
					/* eslint-disable-next-line react/destructuring-assignment */
					translationObject[this.props.uiLanguage].interpretation
				} 1`}</h3>
				<div className="result__wrapper-image">
					<span className="result__image-categories result__image-categories--top">{resultImageCategoriesTop}</span>
					<span className="result__image-categories result__image-categories--right">{resultImageCategoriesRight}</span>
					<span className="result__image-categories result__image-categories--bottom">{resultImageCategoriesBottom}</span>
					<span className="result__image-categories result__image-categories--left">{resultImageCategoriesLeft}</span>
					<div className="result__image-container">
						<div className="result__category result__category--a">
							<div
								className="result__bullet result__bullet--cat-a"
								style={{
									bottom: `${stylesForInterpretations[0][0]}%`,
								}}
							>
								&#xf217;
							</div>
						</div>
						<div className="result__category result__category--b">
							<div
								className="result__bullet result__bullet--cat-b"
								style={{
									left: `${stylesForInterpretations[0][1]}%`,
								}}
							>
								&#xf217;
							</div>
						</div>
						<div className="result__category result__category--c">
							<div
								className="result__bullet result__bullet--cat-c"
								style={{
									top: `${stylesForInterpretations[0][2]}%`,
								}}
							>
								&#xf217;
							</div>
						</div>
						<div className="result__category result__category--d">
							<div
								className="result__bullet result__bullet--cat-d"
								style={{
									right: `${stylesForInterpretations[0][3]}%`,
								}}
							>
								&#xf217;
							</div>
						</div>
						<img className="result__image" src={require('../../../img/target_new_ring.png')} alt="dummy" />
					</div>
				</div>
				<p
					dangerouslySetInnerHTML={{
						__html: interpretationOne,
					}}
				/>
			</div>
			<div className="applicationbody__block-border applicationbody__block-border--bottom-left" />
			<div className="applicationbody__block-border applicationbody__block-border--bottom-right" />
		</div>
	);

	renderInterpretationTwo = (
		primaryColor,
		language,
		stylesForInterpretations,
		resultImageCategoriesTopRight,
		resultImageCategoriesBottomRight,
		resultImageCategoriesBottomLeft,
		resultImageCategoriesTopLeft,
		interpretationTwo
	) => (
		<div className="grid-x grid-padding-x result__wrapper result__wrapper--interpretation-two">
			<div className="cell small-24">
				<h3 style={{ color: primaryColor }}>{`${
					/* eslint-disable-next-line react/destructuring-assignment */
					translationObject[this.props.uiLanguage].interpretation
				} 2`}</h3>
				<div className="result__wrapper-image">
					<div className="result__image-container" id="result__wrapper-image_two">
						<div className="result__category result__category--a">
							<div
								className="result__bullet result__bullet--cat-e"
								style={{
									bottom: `${stylesForInterpretations[1].x}%`,
									left: `${50 + stylesForInterpretations[1].y / 2}%`,
								}}
							>
								&#xf217;
							</div>
						</div>
						<div className="result__category result__category--b">
							<span
								style={{ color: primaryColor }}
								className="result__image-categories result__image-categories--top-right"
							>
								{resultImageCategoriesTopRight}
							</span>
							<span
								style={{ color: primaryColor }}
								className="result__image-categories result__image-categories--bottom-right"
							>
								{resultImageCategoriesBottomRight}
							</span>
						</div>
						<div className="result__category result__category--c" />
						<div className="result__category result__category--d">
							<span
								style={{ color: primaryColor }}
								className="result__image-categories result__image-categories--bottom-left"
							>
								{resultImageCategoriesBottomLeft}
							</span>
							<span
								style={{ color: primaryColor }}
								className="result__image-categories result__image-categories--top-left"
							>
								{resultImageCategoriesTopLeft}
							</span>
						</div>
						<TargetNewCross />
					</div>
				</div>
				<p
					dangerouslySetInnerHTML={{
						__html: interpretationTwo,
					}}
				/>
			</div>
			<div className="applicationbody__block-border applicationbody__block-border--bottom-left" />
			<div className="applicationbody__block-border applicationbody__block-border--bottom-right" />
		</div>
	);

	renderLiterature = (primaryColor, language, literature) => {
		const { uiLanguage } = this.props;
		return (
			<div className="grid-x grid-padding-x result__wrapper result__wrapper--literature">
				<div className="cell small-24">
					<h3 style={{ color: primaryColor }}>{translationObject[uiLanguage].literature}</h3>
					{literature.map(oneLiteratureRow => (
						<p>{oneLiteratureRow}</p>
					))}
				</div>
				<div className="applicationbody__block-border applicationbody__block-border--bottom-left" />
				<div className="applicationbody__block-border applicationbody__block-border--bottom-right" />
			</div>
		);
	}

	// returns object {0: {maxvalue: int, name: string}, 1: {}...}
	calcMaxPossibleValuesOfCategories = () => {
		// i=1 cause we start after the general information at category 2
		let i = 1;

		const maxPossibleCatValuesObject = {};
		const { questionnaireData, language } = this.props;
		const { categories } = questionnaireData;
		for (i; i < categories.length; i++) {
			maxPossibleCatValuesObject[i - 1] = {};
			maxPossibleCatValuesObject[i - 1].name = categories[i].categoryName[language];
			maxPossibleCatValuesObject[i - 1].maxvalue = 0;

			// get the max values for all pages and blocks
			categories[i].categoryPages.forEach(currentPage => {
				if (!currentPage.pageEvaluate || currentPage.pageEvaluate === '0') {
					return;
				}
				currentPage.blocks.forEach(currentBlock => {
					let maxInCurrentAnswers = 0;
					// var max = 0;
					// maxPossibleCatValuesObject[i-1]['maxvalue'] = 0;
					if (currentBlock['@attributes'].type === 'radio') {
						currentBlock.blockAnswers.forEach(currentAnswer => {
							if (currentAnswer.answerValue > maxInCurrentAnswers) {
								maxInCurrentAnswers = currentAnswer.answerValue;
							}
						});
					}

					if (currentBlock['@attributes'].type === 'check') {
						currentBlock.blockAnswers.forEach(currentAnswer => {
							maxInCurrentAnswers += currentAnswer.answerValue;
						});
					}

					if (currentBlock['@attributes'].type === 'inputrange') {
						/* eslint-disable-next-line prefer-destructuring */
						maxInCurrentAnswers = currentBlock.blockAnswers[0].answerValue[1];
					}

					maxPossibleCatValuesObject[i - 1].maxvalue += maxInCurrentAnswers;
				});
			});
		}
		return maxPossibleCatValuesObject;
	};

	getStylesForCategories = () => {
        const categoryValues = this.getCategoryValues();
		const maxValuesOfCategories = this.calcMaxPossibleValuesOfCategories();

		const calculateCategoriesObject = new ResultCalculatorClass(maxValuesOfCategories, categoryValues); // api vor calculating of styles
		const stylesForInterpretations = calculateCategoriesObject.get_styles();
		return stylesForInterpretations;
	};


	generateGraphSelectOptions = () => {
		const { questionnaireData } = this.props;
		const selectOptions = questionnaireData.config.graphs.graphSwitchOptions.options;

		const newOptions = selectOptions.map(option => ({
			value: option,
			label: option,
		}));

		return newOptions;
	};

	// for checkboxes
	toggleCheckbox = (value, name) => {
		this.setState(
			{
				[name]: value,
			}
		);
	};

	render() {
		const { selectedOption, copiedToClipboard, isRecommendationInPdf } = this.state;

		const {
			language,
			questionnaireData,
			values_not_for_categories,
			footer,
			pdfIsCreating,
			questIsUploading,
			backendInfos,
			compareGraphs,
			uiLanguage,
			getPdfLinkAction
		} = this.props;
		const {
			maxValueInAllCategories,
			recomendationsAreUsedInCategory,
			config: {
				mainColors: { primaryColor },
				questionnaireFileName,
				pdfGroup,
				recommendationsIsUsed
			},
		} = questionnaireData;

		// create Selectboxoptions for the graphs if showGraphSwitch is true
		const selectBoxOptions = questionnaireData.config.graphs.showGraphSwitch === '1' ? this.generateGraphSelectOptions() : null;
		const resultPageHeaderTitle = helperFunctions.default(
			questionnaireData.resultpage.header.title[language],
			values_not_for_categories
		);
        const resultPageCompareButtonString = questionnaireData.config.graphs.resultpagecomparebuttonstring ?? {};

		const resultPageHeaderDescription = helperFunctions.default(
			questionnaireData.resultpage.header.description[language],
			values_not_for_categories
		);
		const interpretationOne =
			questionnaireData.resultpage.body.showtomsstyle === '1' &&
			questionnaireData.resultpage.body.interpretation[0]['@attributes'].required === '1'
				? questionnaireData.resultpage.body.interpretation[0].description[language]
				: false;
		const interpretationTwo =
			questionnaireData.resultpage.body.showtomsstyle === '1' &&
			questionnaireData.resultpage.body.interpretation[1]['@attributes'].required === '1'
				? questionnaireData.resultpage.body.interpretation[1].description[language]
				: false;
		const literature =
			questionnaireData.resultpage.body.literature['@attributes'].required === '1'
				? questionnaireData.resultpage.body.literature.p
				: false;
		// for interpretation one
		const resultImageCategoriesTop =
			interpretationOne !== false ? questionnaireData.categories[1].categoryName[language] : null;
		const resultImageCategoriesRight =
			interpretationOne !== false ? questionnaireData.categories[2].categoryName[language] : null;
		const resultImageCategoriesBottom =
			interpretationOne !== false ? questionnaireData.categories[3].categoryName[language] : null;
		const resultImageCategoriesLeft =
			interpretationOne !== false ? questionnaireData.categories[4].categoryName[language] : null;
		// for interpretation two
		const resultImageCategoriesTopRight =
			interpretationTwo !== false ? questionnaireData.resultpage.body.interpretation[1].image_categories[0][language] : null;
		const resultImageCategoriesBottomRight =
			interpretationTwo !== false ? questionnaireData.resultpage.body.interpretation[1].image_categories[1][language] : null;
		const resultImageCategoriesBottomLeft =
			interpretationTwo !== false ? questionnaireData.resultpage.body.interpretation[1].image_categories[2][language] : null;
		const resultImageCategoriesTopLeft =
			interpretationTwo !== false ? questionnaireData.resultpage.body.interpretation[1].image_categories[3][language] : null;

		// for the diagrams
		const catsWithoutTheGeneralInfos = questionnaireData.categories.slice(1);
		const catLength = catsWithoutTheGeneralInfos.length;

		//
		const stylesForInterpretations = this.getStylesForCategories();

		const resultResponseBackgroundColor = classnames('result__response-message-wrapper', {
			'response--success': questIsUploading.status === 'success',
			'response--error': questIsUploading.status === 'fail',
		});

		return (
			<div className="result">
                <Transition
                    items={this.isVisible}
                    keys={null}
                    from={{ right: '100px', opacity: 0 }}
                    enter={{ right: '0px', opacity: 1 }}
                    leave={{ right: '100px', opacity: 0 }}
                >
                    {(style, item) => (
                <animated.div  className="quest-animated-div" style={{ ...style }}>
				<div className="applicationbody-result grid-container result__shown-result">

					{this.getDynamicContent(
						0,
						primaryColor,
						resultPageHeaderTitle,
						resultPageHeaderDescription,
						true,
						catLength,
						language,
						selectedOption,
						selectBoxOptions,
						catsWithoutTheGeneralInfos,
						maxValueInAllCategories,
						false,
						backendInfos
					)}

					{this.getDynamicContent(
						1,
						primaryColor,
						resultPageHeaderTitle,
						resultPageHeaderDescription,
						true,
						catLength,
						language,
						selectedOption,
						selectBoxOptions,
						catsWithoutTheGeneralInfos,
						maxValueInAllCategories,
						false,
						backendInfos
					)}

					{interpretationOne !== false
						? this.renderInterpretationOne(
								primaryColor,
								language,
								resultImageCategoriesTop,
								resultImageCategoriesRight,
								resultImageCategoriesBottom,
								resultImageCategoriesLeft,
								stylesForInterpretations,
								interpretationOne
						  )
						: null}

					{interpretationTwo !== false
						? this.renderInterpretationTwo(
								primaryColor,
								language,
								stylesForInterpretations,
								resultImageCategoriesTopRight,
								resultImageCategoriesBottomRight,
								resultImageCategoriesBottomLeft,
								resultImageCategoriesTopLeft,
								interpretationTwo
						  )
						: null}

					{this.getDynamicContent(
						2,
						primaryColor,
						resultPageHeaderTitle,
						resultPageHeaderDescription,
						true,
						catLength,
						language,
						selectedOption,
						selectBoxOptions,
						catsWithoutTheGeneralInfos,
						maxValueInAllCategories,
						false,
						backendInfos
					)}

					{this.getDynamicContent(
							3,
							primaryColor,
							resultPageHeaderTitle,
							resultPageHeaderDescription,
							true,
							catLength,
							language,
							selectedOption,
							selectBoxOptions,
							catsWithoutTheGeneralInfos,
							maxValueInAllCategories,
							false,
							backendInfos
					)}

					{literature !== false ? this.renderLiterature(primaryColor, language, literature) : null}

					<div className="grid-x grid-padding-x result__wrapper result__wrapper--interpretation-two">
						{backendInfos.is_compare && compareGraphs === '1' && (
							<div className="cell small-24">
								<p>{translationObject[uiLanguage].uploadResultDataDescription}</p>
								{!questIsUploading.isLoading && (
									<div className="margin-bottom--medium">
										<CustomButton
                                            buttonIcon={faChartSimple}
											buttonString={resultPageCompareButtonString[uiLanguage] ? resultPageCompareButtonString[uiLanguage] : translationObject[uiLanguage].uploadResultData}
											backgroundColor={primaryColor}
                                            isActionButton={true}
											onClick={this.uploadResultData}
                                            isDisabled={questIsUploading.status === 'success'}
										/>
									</div>
								)}
								{this.renderSpinner(questIsUploading.isLoading)}

								{questIsUploading.status === 'fail' && (
									<div className={resultResponseBackgroundColor}>
										<span className="result__response-message">
											{
												translationObject[uiLanguage][
													questIsUploading.message
												]
											}
										</span>
									</div>
								)}
								{questIsUploading.status === 'success' && (
									<div className={resultResponseBackgroundColor}>
										<p className="result__response-message">
											{
												translationObject[uiLanguage][
													questIsUploading.message
												]
											}
										</p>
										<span className="result__response-message">{questIsUploading.token}</span>
										<CopyToClipboard
											text={questIsUploading.token}
											onCopy={() => this.setState({ copiedToClipboard: true })}
										>
                                            <CustomButton
                                                buttonString={translationObject[uiLanguage].copyToClipboard}
                                                buttonIcon={faCopy}
                                                backgroundColor={primaryColor}
                                                onClick={null}
                                                wrapperClasses={'result__copy-to-clipboard-button'}
                                                isActionButton={true}
                                            />
										</CopyToClipboard>
										{copiedToClipboard && (
											<span className="result__successfull-copied">
												{translationObject[uiLanguage].successfullCopied}
											</span>
										)}
									</div>
								)}
							</div>
						)}
						<div className="cell small-24">
							{(recomendationsAreUsedInCategory && pdfGroup && (recommendationsIsUsed === '1') && ((pdfGroup.pdfDirectly === '1') || (pdfGroup.pdfAsEmail === '1'))) && (
								<GeneralCheckbox
									label={translationObject[uiLanguage].wantRecomendationsInPdf}
									handleCheckboxChange={this.toggleCheckbox}
									name="isRecommendationInPdf"
									primaryColor={primaryColor}
									value={isRecommendationInPdf}
									labelPosition="right"
								/>
							)}
							<DownloadPdf
								pdfIsCreating={pdfIsCreating}
								uiLanguage={uiLanguage}
								primaryColor={primaryColor}
								getPdfLinkAction={getPdfLinkAction}
								questionnaireFileName={questionnaireFileName}
								pdfGroup={pdfGroup}
							/>
						</div>
					</div>
                </div>
				</animated.div>
                )}
				</Transition>

				{/* For the base64 image of the graph we need a hidden generated graph with fixed size */}
				<div className="result__chart-nirvana-wrapper">
					<div className="result__chart-nirvana">
						{this.renderCharts(
							true,
							catLength,
							language,
							questionnaireData,
							selectedOption,
							selectBoxOptions,
							catsWithoutTheGeneralInfos,
							maxValueInAllCategories,
							true,
							true
						)}
					</div>
				</div>

				{/* to download pdf we have to have an output out of the viewport in a fix size */}
				<div className="applicationbody-result--for-pdf-wrapper">
					<div id="divToPrint" className="applicationbody-result grid-container applicationbody-result--for-pdf">
						{this.getDynamicContent(
							0,
							primaryColor,
							resultPageHeaderTitle,
							resultPageHeaderDescription,
							false,
							catLength,
							language,
							selectedOption,
							selectBoxOptions,
							catsWithoutTheGeneralInfos,
							maxValueInAllCategories,
							false,
							backendInfos
						)}

						{this.getDynamicContent(
							1,
							primaryColor,
							resultPageHeaderTitle,
							resultPageHeaderDescription,
							false,
							catLength,
							language,
							selectedOption,
							selectBoxOptions,
							catsWithoutTheGeneralInfos,
							maxValueInAllCategories,
							false,
							backendInfos
						)}

						{interpretationOne !== false
							? this.renderInterpretationOne(
									primaryColor,
									language,
									resultImageCategoriesTop,
									resultImageCategoriesRight,
									resultImageCategoriesBottom,
									resultImageCategoriesLeft,
									stylesForInterpretations,
									interpretationOne
							  )
							: null}

						{interpretationTwo !== false
							? this.renderInterpretationTwo(
									primaryColor,
									language,
									stylesForInterpretations,
									resultImageCategoriesTopRight,
									resultImageCategoriesBottomRight,
									resultImageCategoriesBottomLeft,
									resultImageCategoriesTopLeft,
									interpretationTwo
							  )
							: null}

						{this.getDynamicContent(
							2,
							primaryColor,
							resultPageHeaderTitle,
							resultPageHeaderDescription,
							false,
							catLength,
							language,
							selectedOption,
							selectBoxOptions,
							catsWithoutTheGeneralInfos,
							maxValueInAllCategories,
							false,
							backendInfos
						)}

						{this.getDynamicContent(
							3,
							primaryColor,
							resultPageHeaderTitle,
							resultPageHeaderDescription,
							false,
							catLength,
							language,
							selectedOption,
							selectBoxOptions,
							catsWithoutTheGeneralInfos,
							maxValueInAllCategories,
							false,
							backendInfos
						)}

						{backendInfos.is_compare && compareGraphs === '1' && questIsUploading.token !== '' && (
							<div className="grid-x grid-padding-x result__pdf-token">
								<div className="cell small-24">
									{translationObject[uiLanguage].pdfTokenDescription}:
									<h3>{questIsUploading.token}</h3>
								</div>
							</div>
						)}
						{literature !== false ? this.renderLiterature(primaryColor, language, literature) : null}
						<div className="applicationbody__spacer" />
						<ApplicationFooter footer={footer} language={language} logoAsBackgroundImage="true" />
						<div style={{ 'fontStyle': 'italic', 'color': '#777' }}>
							{moment().format('dddd, MMMM Do YYYY, h:mm:ss a')}
						</div>
					</div>
				</div>
			</div>
		);
	}
}

Result.propTypes = {
	language: PropTypes.string.isRequired,
	questionnaireData: PropTypes.object.isRequired,
	values_not_for_categories: PropTypes.array.isRequired,
	footer: PropTypes.object.isRequired,
	getPdfLinkAction: PropTypes.func.isRequired,
	pdfIsCreating: PropTypes.object.isRequired,
	uploadSurveyDataAction: PropTypes.func.isRequired,
	backendInfos: PropTypes.object.isRequired,
	compareGraphs: PropTypes.string.isRequired,
	pushResultToCompareList: PropTypes.func.isRequired,
	getPreviousSurveyData: PropTypes.object.isRequired,
	uiLanguage: PropTypes.string.isRequired
};

export default Result;
