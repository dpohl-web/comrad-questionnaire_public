import React from 'react';
import classnames from 'classnames';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { Route, Routes, } from 'react-router-dom';
import $ from 'jquery';
import { connect } from 'react-redux';
import { Transition } from '@react-spring/web'
import ApplicationHeader from '../../components/Molecules/ApplicationHeader/ApplicationHeader';
import ApplicationBody from '../../components/Molecules/ApplicationBody/ApplicationBody';
import Result from '../../components/Molecules/Result/Result';
import './Application.css';
import * as Actions from '../../actions';
import { XML_PATH, COUNT_PATH } from '../../constants/config';
import SettingsPage from '../../components/Molecules/SettingsPage/SettingsPage';
import ComparePage from '../../components/Molecules/ComparePage/ComparePage';
import { getUiLanguageSelector } from '../../selectors';

class Application extends React.Component {
	questIsCounted = false;

	constructor(props) {
		super(props);

		this.renderApplicationBodyQuestionnaire = this.renderApplicationBodyQuestionnaire.bind(this);
		this.renderApplicationBodyResult = this.renderApplicationBodyResult.bind(this);
	}

	componentDidMount() {
        const config = window.__INITIAL_STATE__ || {};
        const { questFilename } = config;
		const { getQuestionaireAction } = this.props;
		const srcData = {
			path: XML_PATH,
			data: {
				name: questFilename,
			},
		};

		getQuestionaireAction(srcData);
	}

	countQuestViewed() {
		const { questionnaireData } = this.props;
		const counterData = {
			counter: 'add',
			filename: questionnaireData.config.questionnaireFileName,
		};
		$.ajax({
			url: COUNT_PATH,
			method: 'POST',
			data: counterData,
			dataType: 'json',
		})
			.done(data => {})
			.fail(err => {});
	}

	renderApplicationBodyResult() {
		const {
			language,
			questionnaireData,
			count_blocks,
			values_not_for_categories,
			changeDefaultLanguageAction,
			getPdfLinkAction,
			pdfIsCreating,
			getPreviousSurveyDataAction,
			getPreviousSurveyData,
			getPreviousSurveyDataAdHocAction,
			uploadSurveyDataAction,
			backendInfos,
			questIsUploading,
			deleteCompareListElement,
			pushResultToCompareList,
			uiLanguage,
			location
		} = this.props;
		const ApplicationClassNames = classnames('Application', {
			'Application--active': true,
		});
		const title = questionnaireData.head.title[language];
		const { number_of_blocks_overall } = questionnaireData;
		const { config: { mainColors } } = questionnaireData;
		const compareGraphs =
			typeof questionnaireData.config.graphs.compareGraphs !== 'undefined' &&
			questionnaireData.config.graphs.compareGraphs === '1'
				? '1'
				: '0';

		return (
			<div className={ApplicationClassNames}>
				<ApplicationHeader
					title={title}
					count_blocks={count_blocks}
					number_of_blocks_overall={number_of_blocks_overall}
					button_text={questionnaireData.head.button.text[language]}
					button_link={questionnaireData.head.button.link}
					showButton={questionnaireData.config.showHeaderButton}
					primaryColor={mainColors.primaryColor}
					secondaryColor={mainColors.secondaryColor}
					logoUrl={questionnaireData.head.logo.url}
					showLogo={questionnaireData.head.logo.showLogo}
					showBackgroundImage={questionnaireData.head.backgroundImage.showBackgroundImage}
					backgroundUrl={questionnaireData.head.backgroundImage.backgroundUrl}
					backendInfos={backendInfos}
					compareGraphs={compareGraphs}
					uiLanguage={uiLanguage}
				/>

							<Transition
								items={location}
								from={{ transform: 'translateY(100px)', opacity: 0 }}
								enter={{ transform: 'translateY(0px)', opacity: 1 }}
								leave={{ transform: 'translateY(100px)', opacity: 0 }}
							>
								{(style, item) => (
									<Routes location={item}>
										<Route
											path="settings"
											element={
												<SettingsPage
													language={language}
													questionnaireData={questionnaireData}
													changeDefaultLanguageAction={changeDefaultLanguageAction}
													uiLanguage={uiLanguage}
													style={style}
												/>
											}
										/>
										{backendInfos.is_compare === true && compareGraphs === '1' && (
											<Route
												path="compare"
												element={
													<ComparePage
														language={language}
														questionnaireData={questionnaireData}
														footer={questionnaireData.footer}
														getPdfLinkAction={getPdfLinkAction}
														pdfIsCreating={pdfIsCreating}
														getPreviousSurveyDataAction={getPreviousSurveyDataAction}
														getPreviousSurveyData={getPreviousSurveyData}
														getPreviousSurveyDataAdHocAction={getPreviousSurveyDataAdHocAction}
														deleteCompareListElement={deleteCompareListElement}
														uiLanguage={uiLanguage}
														style={style}
													/>
												}
											/>
										)}
										<Route
											index
											element={
												<ApplicationBody
													show_result
													values_not_for_categories={values_not_for_categories}
													language={language}
													footer={questionnaireData.footer}
													uiLanguage={uiLanguage}
													style={style}
												>
													<Result
														language={language}
														questionnaireData={questionnaireData}
														values_not_for_categories={values_not_for_categories}
														footer={questionnaireData.footer}
														getPdfLinkAction={getPdfLinkAction}
														pdfIsCreating={pdfIsCreating}
														uploadSurveyDataAction={uploadSurveyDataAction}
														backendInfos={backendInfos}
														questIsUploading={questIsUploading}
														compareGraphs={compareGraphs}
														pushResultToCompareList={pushResultToCompareList}
														getPreviousSurveyData={getPreviousSurveyData}
														uiLanguage={uiLanguage}
													/>
												</ApplicationBody>
											}
										/>
									</Routes>
								)}
							</Transition>
			</div>
		);
	}

	renderApplicationBodyQuestionnaire() {
		const {
			questionnaireData,
			categories_pages_quantity,
			count_cats,
			count_pages,
			language,
			catValuesCountAll,
			count_blocks,
			values_not_for_categories,
			changeDefaultLanguageAction,
			getPdfLinkAction,
			pdfIsCreating,
			getPreviousSurveyDataAction,
			getPreviousSurveyData,
			getPreviousSurveyDataAdHocAction,
			backendInfos,
			deleteCompareListElement,
			uiLanguage,
			location,
            goBackOnePage,
            saveFormValues
		} = this.props;
		const ApplicationClassNames = classnames('Application', {
			'Application--active': true,
		});
		const title = questionnaireData.head.title[language];
		const cat_now = questionnaireData.categories[count_cats]; // Which category do we have now?
		const page_now = cat_now.categoryPages[count_pages];
		const { number_of_blocks_overall } = questionnaireData;

		const { config: { mainColors } } = questionnaireData;
		const compareGraphs =
			typeof questionnaireData.config.graphs.compareGraphs !== 'undefined' &&
			questionnaireData.config.graphs.compareGraphs === '1'
				? '1'
				: '0';

		return (
			<div className={ApplicationClassNames}>
				<ApplicationHeader
					title={title}
					count_blocks={count_blocks}
					number_of_blocks_overall={number_of_blocks_overall}
					button_text={questionnaireData.head.button.text[language]}
					button_link={questionnaireData.head.button.link}
					showButton={questionnaireData.config.showHeaderButton}
					primaryColor={mainColors.primaryColor}
					secondaryColor={mainColors.secondaryColor}
					logoUrl={questionnaireData.head.logo.url}
					showLogo={questionnaireData.head.logo.showLogo}
					showBackgroundImage={questionnaireData.head.backgroundImage.showBackgroundImage}
					backgroundUrl={questionnaireData.head.backgroundImage.backgroundUrl}
					backendInfos={backendInfos}
					compareGraphs={compareGraphs}
					uiLanguage={uiLanguage}
				/>
							<Transition
								items={location}
								from={{ transform: 'translateY(100px)', opacity: 0 }}
								enter={{ transform: 'translateY(0px)', opacity: 1 }}
								leave={{ transform: 'translateY(100px)', opacity: 0 }}
							>
								{(style, item) => (
									<Routes location={item}>
										<Route
											path="settings"
											element={
												<SettingsPage
													language={language}
													questionnaireData={questionnaireData}
													changeDefaultLanguageAction={changeDefaultLanguageAction}
													uiLanguage={uiLanguage}
													style={style}
												/>
											}
										/>
										{backendInfos.is_compare === true && compareGraphs === '1' && (
											<Route
												path="compare"
												element={
													<ComparePage
														language={language}
														footer={questionnaireData.footer}
														getPdfLinkAction={getPdfLinkAction}
														pdfIsCreating={pdfIsCreating}
														questionnaireData={questionnaireData}
														getPreviousSurveyDataAction={getPreviousSurveyDataAction}
														getPreviousSurveyData={getPreviousSurveyData}
														getPreviousSurveyDataAdHocAction={getPreviousSurveyDataAdHocAction}
														deleteCompareListElement={deleteCompareListElement}
														uiLanguage={uiLanguage}
														style={style}
													/>
												}
											/>
										)}
										<Route
											index
											element={
												<ApplicationBody
													page_now={page_now}
													count_cats={count_cats}
													count_pages={count_pages}
													categories_pages_quantity={categories_pages_quantity}
													catValuesCountAll={catValuesCountAll}
													language={language}
													show_result={false}
													values_not_for_categories={values_not_for_categories}
													questionnaireData={questionnaireData}
													footer={questionnaireData.footer}
													uiLanguage={uiLanguage}
													style={style}
                                                    goBackOnePage={goBackOnePage}
                                                    saveFormValues={saveFormValues}
												/>
											}
										/>
									</Routes>
								)}
							</Transition>
			</div>
		);
	}

	renderNoQuestFound = () => (
		<div className="application_noquestfound-wrapper">
			<div className="application_noquestfound">
				<h3>
					Unfortunately no questionnnaire was found under this address! Please try another adress or questionnaire
					name!
				</h3>
			</div>
		</div>
	);

	render() {
		const { isLoading } = this.props;
		if (isLoading === false) {
			const { questionnaireData } = this.props;

			if (questionnaireData && typeof questionnaireData.questFound === 'undefined') {
				// when data fetch was successfull and data came in, otherwise it renders before they are here
				const { categories_pages_quantity, count_cats } = this.props;
				if (count_cats < categories_pages_quantity.cats_quantity) {
					return this.renderApplicationBodyQuestionnaire();
				}

				// Only the first view has to be counted. Otherwisr it counts after go back from settings page
				if (this.questIsCounted === false) {
					this.countQuestViewed();
				}
				this.questIsCounted = true;
				return this.renderApplicationBodyResult();
			}
			return this.renderNoQuestFound();
		}
		return null;
	}
}

Application.defaultProps = {
	questionnaireData: undefined,
	categories_pages_quantity: undefined,
	count_cats: undefined,
	count_pages: undefined,
	language: undefined,
	count_blocks: undefined,
	values_not_for_categories: undefined,
	getPreviousSurveyData: undefined,
	backendInfos: undefined,
	questIsUploading: undefined,
	uiLanguage: undefined,
};

Application.propTypes = {
	questionnaireData: PropTypes.object,
	categories_pages_quantity: PropTypes.object,
	count_cats: PropTypes.number,
	count_pages: PropTypes.number,
	language: PropTypes.string,
	count_blocks: PropTypes.number,
	values_not_for_categories: PropTypes.array,
	getPreviousSurveyData: PropTypes.object,
	backendInfos: PropTypes.object,
	questIsUploading: PropTypes.object,
	uiLanguage: PropTypes.string,
    location: PropTypes.object.isRequired,
};

function mapStateToProps(state, ownProps) {
	if (state.questionnaireData) {
		return {
			isLoading: false,
			questionnaireData: state.questionnaireData,
			categories_pages_quantity: state.categories_pages_quantity,
			count_cats: state.count_cats,
			count_pages: state.count_pages,
			language: state.language,
			count_blocks: state.count_blocks,
			values_not_for_categories: state.values_not_for_categories,
			pdfIsCreating: state.pdfIsCreating,
			getPreviousSurveyData: state.getPreviousSurveyData,
			backendInfos: state.backendInfos,
			questIsUploading: state.questIsUploading,
			uiLanguage: getUiLanguageSelector(state),
            currentLocation: ownProps.location
		};
	}

	return {
		isLoading: true,
        currentLocation: ownProps.location
	};
}

function mapDispatchToProps(dispatch) {
	return bindActionCreators(Actions, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Application);
