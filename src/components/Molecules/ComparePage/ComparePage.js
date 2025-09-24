import React, { PureComponent } from 'react';
import Select from 'react-select';
import PropTypes from 'prop-types';
import produce from 'immer';
import { cloneDeep } from 'lodash';
import PulseLoader from 'react-spinners/PulseLoader';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import moment from 'moment';
import { animated } from '@react-spring/web';
import { translationObject } from '../../../constants/translation';
import './ComparePage.css';
import ApplicationFooter from '../ApplicationFooter/ApplicationFooter';
import * as helperFunctions from '../../../helpers/helperFunctions';
import CustomButton from '../../Atoms/CustomButtom/CustomButtom';
import DownloadPdf from '../DownloadPdf/DownloadPdf';
import NavButton from '../../Atoms/NavButton/NavButton';
import CustomCharts from '../CustomCharts/CustomCharts';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons';
import { faTrash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const Alert = React.forwardRef((props, ref) => <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />);

// const SomeComponent = withRouter(props => <SettingsPage {...props}/>);
class ComparePage extends PureComponent {
	listKey = 0;
	snackBarMessage = '';

	constructor(props) {
		super(props);

		this.state = {
			snackbarOpen: false,
			values: {
				comparePassword: '',
			},
			labels: [],
			selectedOption: 'radar',
		};
	}

	componentDidMount() {
		this.generateChartLabels();
	}

	componentDidUpdate(prevProps) {
		const { getPreviousSurveyData, getPreviousSurveyDataAdHocAction, uiLanguage } = this.props;
		if (prevProps.getPreviousSurveyData !== getPreviousSurveyData && getPreviousSurveyData.status === 'error') {
			this.snackBarMessage = translationObject[uiLanguage][getPreviousSurveyData.message];
			this.setState({ snackbarOpen: true }, () => {
				getPreviousSurveyDataAdHocAction({ isSurveyLoading: false, newData: { status: '', message: '' } });
			});
		}
	}

	onChange = event => {
		const { name: fieldName, value: fieldValue } = event.target;
		const { values } = this.state;

		const newValue = {
			...values,
			[fieldName]: fieldValue, // is this necessary with parseint
		};

		this.setState({
			values: newValue,
		});
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

	renderSurveyList = () => {
		const { getPreviousSurveyData, questionnaireData, deleteCompareListElement } = this.props;
		const newDataSets = cloneDeep(getPreviousSurveyData.data);
		const secondaryColorLight = questionnaireData.config.mainColors.secondaryColor.replace(')', ',0.3)');

		return newDataSets.map((dataSet, index) => {
			this.listKey += 1;
			return (
				<li
					style={{ backgroundColor: secondaryColorLight }}
					className="compare__li"
					key={helperFunctions.generateKey(dataSet.label + this.listKey)}
				>
					<span className="compare__listelement">{dataSet.label}</span>
					<button
						type="button"
						onClick={() => {
							deleteCompareListElement(index);
						}}
						title="delete"
						className="compare__delete-listelement"
					>
						<FontAwesomeIcon className="" color="rgb(150,56,56)" icon={faTrash} />
					</button>
				</li>
			);
		});
	};

	handleChange = selectedOption => {
		this.setState(
			produce(draft => {
				draft.selectedOption = selectedOption.value;
			})
		);
	};

	renderChartLegend = () => {
		const { questionnaireData } = this.props;
		const newData = this.generateNewChartsData();

		const primaryColor = questionnaireData.config.mainColors.primaryColor.replace(')', ',1)');
		const secondaryColor = questionnaireData.config.mainColors.secondaryColor.replace(')', ',1)');

		return (
			<ul className="compare__chart-legend">
				{newData.datasets &&
					newData.datasets.map((data, index) => (
						<li key={data.label + index}>
							<div
								className="compare__chart-legend-block"
								style={{
									backgroundColor:
										index === 0 ? primaryColor.replace(',1)', ',.2)') : secondaryColor.replace(',1)', ',.2)'),
									borderColor:
										index === 0 ? primaryColor.replace(',1)', ',.5)') : secondaryColor.replace(',1)', ',.5)'),
								}}
							/>
							<span className="compare__chart-legend-label">{data.label}</span>
						</li>
					))}
			</ul>
		);
	};

	generateNewChartsData = () => {
		const { labels } = this.state;
		const { getPreviousSurveyData } = this.props;
		const newDataSets = cloneDeep(getPreviousSurveyData.data);

		let newLabels = cloneDeep(labels);
		if (newLabels.length) {
			newLabels = newLabels.map(label => helperFunctions.formatLabel(label, 40));
		}

		const newData = {
			labels: newLabels,
			datasets: newDataSets,
		};

		return newData;
	};

	renderCharts = (
		isNotPdf,
		language,
		questionnaireData,
		selectedOption,
		selectBoxOptions,
		maxValueInAllCategories,
		createPdfOptions,
	) => {
		const newData = this.generateNewChartsData();
		const { uiLanguage } = this.props;

		// We only want radar and bar but prevent the dynamic graphs from editor for the future
		selectBoxOptions = [
			{
				value: 'radar',
				label: 'radar',
			},
			{
				value: 'bar',
				label: 'bar',
			},
		];

		if (typeof newData.datasets[0] !== 'undefined') {
			return (
				<div>
					{isNotPdf && (questionnaireData.config.graphs.showGraphSwitch === '1') && (
						<div className="graph-selectbox-wrapper">
							<div className="graph-selectbox">
								<Select
									value={selectedOption}
									onChange={this.handleChange}
									options={selectBoxOptions}
									placeholder={translationObject[uiLanguage].selectGraph}
								/>
							</div>
						</div>
					)}
					<div className="compare__chart-container-wrapper">
                    <CustomCharts
                        language={language}
                        isNotPdf={isNotPdf}
                        questionnaireData={questionnaireData}
                        selectedOption={selectedOption}
                        selectBoxOptions={selectBoxOptions}
                        maxValueInAllCategories={maxValueInAllCategories}
                        createPdfOptions={createPdfOptions}
                        chartId={createPdfOptions ? 'customchart-pdf' : 'customchart-view'}
                        containerId={createPdfOptions ? 'containerid-pdf' : 'containerid-view'}
                        chartRefPdf={createPdfOptions ? null : this.chartRefPdf}
                        generateChartDataForCompare={this.generateChartDataForCompare}
                        newData={newData}
                        ref={createPdfOptions ? this.chartRefPdf : this.chartRefView}
                    />
					</div>
				</div>
            )
		}
		return null;
	};

	generateChartLabels = () => {
		const { questionnaireData, language } = this.props;
		const labels = [];
		questionnaireData.categories.forEach(oneCat => {
			if (oneCat.evaluateCategory === '1') {
				oneCat.categoryPages.forEach(onePage => {
					if (onePage.pageEvaluate === '1') {
						onePage.blocks.forEach((oneBlock, y) => {
							labels.push(
								!oneBlock.blockShortQuestion ||
									typeof oneBlock.blockShortQuestion[language] === 'undefined' ||
									oneBlock.blockShortQuestion[language] === ''
									? oneBlock.blockQuestion[language]
									: oneBlock.blockShortQuestion[language]
							);
						});
					}
				});
			}
		});

		this.setState(
			produce(draft => {
				draft.labels = labels;
			})
		);
	};

	generateChartDataForCompare = (chartMode, data) => {
		const { questionnaireData } = this.props;
		let newDatasets = [];
		const newData = cloneDeep(data);

		const primaryColor = questionnaireData.config.mainColors.primaryColor.replace(')', ',1)');
		const secondaryColor = questionnaireData.config.mainColors.secondaryColor.replace(')', ',1)');

		newDatasets = data.datasets.map((dataSet, index) => {
			const datasetsObject = {};
			if (index < 1) {
				// First dataset has other colors as the second one!
				datasetsObject.backgroundColor = primaryColor;
				if (chartMode === 'radar') {
					datasetsObject.backgroundColor = primaryColor.replace(',1)', ',.2)');
					datasetsObject.borderColor = primaryColor;
				} else if (chartMode === 'bar') {
					datasetsObject.backgroundColor = primaryColor.replace(',1)', ',.5)');
					datasetsObject.borderColor = primaryColor;
				} else {
					datasetsObject.backgroundColor = primaryColor.replace(',1)', ',.5)');
					datasetsObject.borderColor = primaryColor;
				}

				datasetsObject.pointBackgroundColor = secondaryColor;
				datasetsObject.pointHoverBorderColor = secondaryColor;
			} else {
				datasetsObject.backgroundColor = secondaryColor;
				if (chartMode === 'radar') {
					datasetsObject.backgroundColor = secondaryColor.replace(',1)', ',.2)');
					datasetsObject.borderColor = secondaryColor;
				} else if (chartMode === 'bar') {
					datasetsObject.backgroundColor = secondaryColor.replace(',1)', ',.5)');
					datasetsObject.borderColor = secondaryColor;
				} else {
					datasetsObject.backgroundColor = secondaryColor.replace(',1)', ',.5)');
					datasetsObject.borderColor = primaryColor;
				}

				datasetsObject.pointBackgroundColor = secondaryColor;
				datasetsObject.pointHoverBorderColor = secondaryColor;
			}
			datasetsObject.data = dataSet.data;
			datasetsObject.label = dataSet.label;
			datasetsObject.pointBorderColor = '#fff';
			datasetsObject.pointHoverBackgroundColor = '#fff';

			return datasetsObject;
		});
		newData.datasets = newDatasets;

		return newData;
	};

	onFormSubmit = e => {
		e.preventDefault();
		const { questionnaireData, getPreviousSurveyDataAction, getPreviousSurveyData, uiLanguage } = this.props;
		const { values } = this.state;
		const tokenAlreadySubmitted = getPreviousSurveyData.data.find(data => data.token === values.comparePassword);

		if (tokenAlreadySubmitted) {
			this.snackBarMessage = translationObject[uiLanguage].errorLoadCompare;
			this.setState({ snackbarOpen: true });
		} else {
			getPreviousSurveyDataAction({
				password: values.comparePassword,
				fileName: questionnaireData.config.questionnaireFileName,
			});
		}
		this.setState(
			produce(draft => {
				draft.values.comparePassword = '';
			})
		);
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

	createbaseImageFromChart() {
		const url = this.toBase64Image();
		document.getElementById('chartBaseImage').src = url;
	}

	render() {
		const {
			language,
			questionnaireData,
			getPreviousSurveyData,
			footer,
			pdfIsCreating,
			uiLanguage,
			style,
			getPdfLinkAction
		} = this.props;
		const { selectedOption, values, labels, snackbarOpen } = this.state;
		const {
			maxValueInAllCategories,
			config: {
				mainColors: { primaryColor },
				questionnaireFileName,
				pdfGroup
			},
		} = questionnaireData;

		const selectBoxOptions = questionnaireData.config.graphs.showGraphSwitch === '1' ? this.generateGraphSelectOptions() : null;

		return (
			<animated.div className="router-animation-wrapper" style={{ ...style }}>
				<div className="compare">
					<NavButton wrapperClasses="padding--medium" type="custom" color={primaryColor} title={translationObject[uiLanguage].goBack} icon={faChevronLeft}/>
					<div className="compare__scrolldiv">
						<div className="compare__scrolldiv-inner">
							<div className="compare__body-wrapper">
								<div className="compare__body--header">
									<h2>{translationObject[uiLanguage].compareTitle}</h2>
									<p>{translationObject[uiLanguage].compareDesc}</p>
									<ol>
										<li>{translationObject[uiLanguage].compareDescUl1}</li>
										<li>{translationObject[uiLanguage].compareDescUl2}</li>
										<li>{translationObject[uiLanguage].compareDescUl3}</li>
									</ol>
								</div>
								<div className="grid-x-x compare--input">
									<div className="cell">
										<form onSubmit={this.onFormSubmit}>
											<input
												className="compare__input--password"
												name="comparePassword"
												type="text"
												value={values.comparePassword}
												onChange={this.onChange}
											/>
											{!getPreviousSurveyData.isSurveyLoading && (
												<div className="margin-bottom--medium">
													<CustomButton
														buttonString={translationObject[uiLanguage].Submit}
														backgroundColor={primaryColor}
                                                        isActionButton={true}
														type="submit"
													/>
												</div>
											)}
											{this.renderSpinner(getPreviousSurveyData.isSurveyLoading)}
										</form>
										<Snackbar
											autoHideDuration={5000}
											open={snackbarOpen}
											onClose={() => this.setState({ snackbarOpen: false })}
											anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
											<Alert severity="error" sx={{ width: '100%' }}>
												{this.snackBarMessage}
											</Alert>
										</Snackbar>
									</div>
								</div>
								<div className="compare__data-list">
									<ul>{this.renderSurveyList()}</ul>
								</div>
								<div className="compare__data-graph">
									{typeof labels[0] !== 'undefined' &&
										this.renderCharts(
											true,
											language,
											questionnaireData,
											selectedOption,
											selectBoxOptions,
											maxValueInAllCategories,
											false,
										)}
								</div>
								{getPreviousSurveyData.data.length !== 0 && (
									<div className="cell small-24 compare__downloadpdf">
										<DownloadPdf
											pdfIsCreating={pdfIsCreating}
											uiLanguage={uiLanguage}
											primaryColor={primaryColor}
											getPdfLinkAction={getPdfLinkAction}
											questionnaireFileName={questionnaireFileName}
											pdfGroup={pdfGroup}
										/>
									</div>
								)}
							</div>
							{/* For the base64 image of the graph we need a hidden generated graph with fixed size */}
							<div className="compare__chart-nirvana-wrapper">
								<div className="compare__chart-nirvana">
									{this.renderCharts(
										true,
										language,
										questionnaireData,
										selectedOption,
										selectBoxOptions,
										maxValueInAllCategories,
										true,
									)}
								</div>
							</div>
							<div className="compare__div-to-print--wrapper">
								<div className="compare__div-to-print" id="divToPrint">
									<h1>{questionnaireData.head.title[language]}</h1>
									<p>{translationObject[uiLanguage].comparePdfDescription}</p>
                                    {this.renderCharts(
                                        false,
										language,
										questionnaireData,
										selectedOption,
										selectBoxOptions,
										maxValueInAllCategories,
										false,)}
									<ApplicationFooter footer={footer} language={language} logoAsBackgroundImage="true" />
									<div style={{ fontStyle: 'italic', color: '#777' }}>
										{moment().format('dddd, MMMM Do YYYY, h:mm:ss a')}
									</div>
								</div>
							</div>
						</div>
					</div>
				</div>
			</animated.div>
		);
	}
}

ComparePage.propTypes = {
	language: PropTypes.string.isRequired,
	footer: PropTypes.object.isRequired,
	pdfIsCreating: PropTypes.object.isRequired,
	getPdfLinkAction: PropTypes.func.isRequired,
	questionnaireData: PropTypes.object.isRequired,
	getPreviousSurveyDataAction: PropTypes.func.isRequired,
	getPreviousSurveyData: PropTypes.object.isRequired,
	getPreviousSurveyDataAdHocAction: PropTypes.func.isRequired,
	deleteCompareListElement: PropTypes.func.isRequired,
	uiLanguage: PropTypes.string.isRequired,
	style: PropTypes.object.isRequired
};

export default ComparePage;
