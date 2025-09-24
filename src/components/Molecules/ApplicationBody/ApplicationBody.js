import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import $ from 'jquery';
import classnames from 'classnames';
import { cloneDeep, omit } from 'lodash';
import DatePicker from 'react-datepicker';
import Color from 'color';
import moment from 'moment';
import Slider from '@mui/material/Slider';
import { animated, Trail } from '@react-spring/web'
import 'react-datepicker/dist/react-datepicker.css';
import Checkbox from '../../Atoms/Checkbox/Checkbox';
import { translationObject } from '../../../constants/translation';
import './ApplicationBody.css';
import ApplicationFooter from '../ApplicationFooter/ApplicationFooter';
import CustomButton from '../../Atoms/CustomButtom/CustomButtom';
import { faChevronRight, faChevronLeft } from '@fortawesome/free-solid-svg-icons';

export default class ApplicationBody extends PureComponent {
	radioButtonRefs = [];
	saveButtonRef;
    backButtonRef;
    navigationMode = ''; // 'goback' or 'continue'
	animationConfig = { mass: 1, tension: 230, friction: 30, clamp: true };

	animationConfigResult = { mass: 1, tension: 130, friction: 60, clamp: true };

	constructor(props) {
		super(props);

		this.state = {
			startDate: moment(),
			values: {},
			form_is_valid: false,
			animationStart: false,
			animationEnd: false,
		};
		this.form_is_valid = false;
	}

	componentDidMount() {
		const { show_result } = this.props;
		const { values } = this.state;

		if (!show_result) {
			this.setState({
				animationStart: true,
				animationEnd: false,
			});
		}
	}

	UNSAFE_componentWillMount() {
		const { page_now, show_result } = this.props;
		if (!show_result) {
			this.setStateForInputs(page_now);
		} else {
			this.setState({
				animationStart: true,
				animationEnd: false,
			});
		}
	}

	UNSAFE_componentWillReceiveProps(nextProps) {
		const { count_cats, count_pages } = this.props;
		if (
			nextProps.page_now &&
			(nextProps.count_cats !== count_cats || nextProps.count_pages !== count_pages)
		) {
			// the result page has no page_now object
			const { page_now } = nextProps;
			this.setStateForInputs(page_now); // here set button to disabled, too
		}
	}

	componentDidUpdate(prevProps) {
		// console.log('ApplicationBody componentDidUpdate');
		const { page_now, count_cats, count_pages } = this.props;
		const { values } = this.state;
		if (prevProps.page_now && prevProps.page_now !== page_now) {
			const buttonElement = document.getElementById('applicationbody__page-button');
			if (buttonElement) {
				buttonElement.blur();
			}
			// the result page has no page_now object
			$('.applicationbody__scrolldiv-inner').animate({ scrollTop: '0px' }, 300);
			this.setState({ // We have to start the fly in animation for the content
				animationStart: true,
				animationEnd: false,
			});
		}

        if (
			page_now &&
			(count_cats !== prevProps.count_cats || count_pages !== prevProps.count_pages)
		) {
			const form_is_valid_new = this.formValidation(values);

            this.setState({
                form_is_valid: form_is_valid_new, // for the save button
            });
		}

	}

	onChange = (event) => {
		const { name: fieldName, value: fieldValue } = event.target;
		const { values } = this.state;

		const newValue = {
			...values,
			[fieldName]: fieldValue, // is this necessary with parseint
		};
		const form_is_valid_new = this.formValidation(newValue);
		this.setState(
			{
				values: newValue,
				form_is_valid: form_is_valid_new,
			}
		);

        this.saveCurrentFormValues(newValue);
	}

	// for checkboxes
	toggleCheckbox = (value, name, index) => {
		const { values } = this.state;
		let newValue = {};

		if (values[`${name}_${index}`] === value) {
			newValue = omit(values, `${name}_${index}`);
		} else {
			newValue = {
				...values,
				[`${name}_${index}`]: value,
			};
		}

		const form_is_valid_new = this.formValidation(newValue);
		this.setState(
			{
				values: newValue,
				form_is_valid: form_is_valid_new,
			}
		);

        this.saveCurrentFormValues(newValue);
	};

    toggleRadio = (value, name, index) => {
		const { values } = this.state;
		let newValue = cloneDeep(values);
        
        for (const key in newValue) {
            if (key.startsWith(name + '_')) delete newValue[key];
        }

        newValue[`${name}_${index}`] = value;

        const form_is_valid_new = this.formValidation(newValue);
		
        this.setState(
			{
				values: newValue,
				form_is_valid: form_is_valid_new,
			}
		);

        this.saveCurrentFormValues(newValue);
	};

	toggleInputRange = (value, field) => {
		const { values } = this.state;
		const newValue = {
			...values,
			[field]: value,
		};

		this.setState({
			values: newValue,
		});

        this.saveCurrentFormValues(newValue);
	};

	hasClass(target, className) {
		return new RegExp(`(\\s|^)${className}(\\s|$)`).test(target.className);
	}

	handleFormSubmit = formSubmitEvent => {
		formSubmitEvent.preventDefault();
	};

	save = (mode) => {
        this.navigationMode = mode;
		this.setState({
			animationEnd: true,
		});
	};

	// input Range and Input needs values to start correct. For Input Range they has to be integer, no float. Here the value is set with setState
	// argument: page_now
	// return: nothing
	setStateForInputs = page_now => {
		let newValues = page_now.savedFormValues ?? {};

		let minValue;

		let maxValue;

		let value;

        if (!page_now.hasOwnProperty('savedFormValues')) { // Create the empty input fields and the middle value of input ranges.

            page_now.blocks.forEach((oneblock, index) => {

                if (oneblock['@attributes'].type === 'inputrange') {
                    minValue = parseInt(oneblock.blockAnswers[0].answerValue, 10);
                    maxValue = parseInt(oneblock.blockAnswers[1].answerValue, 10);
                    newValues = {
                        ...newValues,
                        [index]: Math.round((minValue + maxValue) / 2),
                    };
                }

                if (oneblock['@attributes'].type === 'input') {
                    value = '';
                    newValues = {
                        ...newValues,
                        [index]: value,
                    };
                }
            });
        }

        const form_is_valid_new = this.formValidation(newValues);

		this.setState({
			values: newValues,
			form_is_valid: form_is_valid_new, // for the save button
		});
	};

	// returns true when form is valid and false when not
	formValidation = (values) => {
		const {
			page_now,
			page_now: { blocks },
		} = this.props;

		let i = 0;

		let x;

		let minOneCheckboxSelected;

		for (i; i < blocks.length; i++) {
			if ((blocks[i]['@attributes'].type === 'input' && values[i] === '')) {
				return false;
			}
			if (blocks[i]['@attributes'].type === 'check' || blocks[i]['@attributes'].type === 'radio') {
				minOneCheckboxSelected = false;
				x = 0;
				const number_of_checkboxes = blocks[i].blockAnswers.length;
				for (x; x < number_of_checkboxes; x++) {
					if (values[`${i}_${x}`] === 0 || values[`${i}_${x}`] > 0) {
						minOneCheckboxSelected = true;
						break;
					}
				}
				if (minOneCheckboxSelected === false) {
					return false;
				}
			}
		}

		return true;
	};

	renderRadioGroup(blockQuestion, blockAnswers, field) {
        const {values} = this.state;
		const { language, questionnaireData } = this.props;
		const { config: { mainColors: { primaryColor } } } = questionnaireData;
		return (
			<div className="grid-x grid-padding-x applicationbody__block">
				<div className="cell small-24 applicationbody__block-question">
					<h3 className="applicationbody__question-title">{blockQuestion[language]}</h3>
				</div>
				<div className="cell small-24">
					{blockAnswers.map((blockAnswer, i) => (
						<div key={`${field}_${i}`} className="applicationbody__labels-answers switch small">
							<label className="applicationbody__label" htmlFor={`${field}radio${i}`}>
								{blockAnswer[language]}
							</label>
								<div className="applicationbody__answer">
									<input
										ref={element => {
											this.radioButtonRefs[`${field}radio${i}`] = element;
										}}
										type="radio"
										id={`${field}radio${i}`}
										value={blockAnswer.answerValue}
										key={`${field}radio${i}`}
										onChange={() => {this.toggleRadio(blockAnswer.answerValue, field, i)}}
										name={field}
										className="switch-input"
                                        checked={values.hasOwnProperty([field + '_' + i]) ? true : false}
									/>
									<>{ /* eslint-disable-next-line jsx-a11y/label-has-associated-control */ }</>
									<label
										className="switch-paddle"
										htmlFor={`${field}radio${i}`}
										style={
											this.radioButtonRefs[`${field}radio${i}`] &&
											this.radioButtonRefs[`${field}radio${i}`].checked
												? {
														backgroundColor: primaryColor,
												  }
												: { backgroundColor: '#bbb' }
										}
									/>
								</div>
						</div>
					))}
				</div>
			</div>
		);
	}

	renderDatePicker = (blockQuestion) => {
		const { language } = this.props;
		const { startDate } = this.state;
		return (
			<div className="grid-x grid-padding-x applicationbody__block">
				<div className="cell small-24 applicationbody__block-question">
					<h3 className="applicationbody__question-title">{blockQuestion[language]}</h3>
				</div>
				<div className="cell auto">
					<DatePicker
						dateFormat="DD.MM.YYYY"
						scrollableYearDropdown
						showYearDropdown
						selected={startDate}
						onChange={date => {
							this.setState({ startDate: date });
						}}
					/>
				</div>
			</div>
		);
	}

	renderInput(blockQuestion, field) {
		const { language } = this.props;
		const { values } = this.state;

		return (
			<div className="grid-x grid-padding-x applicationbody__block">
				<div className="cell small-24 applicationbody__block-question">
					<h3 className="applicationbody__question-title">{blockQuestion[language]}</h3>
				</div>
				<div className="cell auto">
					<input
						className="applicationbody__question"
						name={field}
						type="text"
						value={values[field]} //
						onChange={this.onChange}
					/>
				</div>
			</div>
		);
	}

	renderCheckbox(blockQuestion, blockAnswers, field) {
        const {values} = this.state;
		const { language, questionnaireData, count_cats, count_pages, uiLanguage } = this.props;
		const { config: { mainColors: { primaryColor } } } = questionnaireData;
		const { config: { mainColors: { secondaryColor } } } = questionnaireData;

		return (
			<div className="grid-x grid-padding-x applicationbody__block">
				<div className="cell small-24 applicationbody__block-question">
					<h3 className="applicationbody__question-title">{blockQuestion[language]}</h3>
					<span style={{ color: secondaryColor }} className="applicationbody__multiselection">
						{translationObject[uiLanguage].multi_selection_possible}
					</span>
				</div>
				<div className="cell small-24">
					{blockAnswers.map((one_answer, i) => (
						<Checkbox
							label={one_answer[language]}
							handleCheckboxChange={this.toggleCheckbox}
							key={`${count_cats}#${count_pages}#${i}`}
							value={one_answer.answerValue}
							name={field}
							index={i}
							primaryColor={primaryColor}
                            isChecked={values.hasOwnProperty([field + '_' + i]) ? true : false}
						/>
					))}
				</div>
			</div>
		);
	}

    saveCurrentFormValues = (values) => {
        const {
            count_cats, // Which category in the catetgory array do we have now?
            count_pages, // Which page in the page array do we have now?
            saveFormValues
        } = this.props;

        saveFormValues(count_cats, count_pages, values);
    }

	renderInputRange = (blockQuestion, blockAnswer, field) => {
		const {
			language,
			questionnaireData: {
				config: {
					mainColors: { primaryColor, secondaryColor },
				},
			},
			uiLanguage,
		} = this.props;
		const { values } = this.state;
		const minValue = parseInt(blockAnswer[0].answerValue, 10);
		const maxValue = parseInt(blockAnswer[1].answerValue, 10);
		const marks = [
			{
			  value: minValue,
			  label: minValue,
			},
			{
			  value: maxValue,
			  label: maxValue,
			},
		  ];

		return (
			<div className="grid-x grid-padding-x applicationbody__block">
				<div className="cell small-24 applicationbody__block-question">
					<h3 className="applicationbody__question-title">{blockQuestion[language]}</h3>
					<span style={{ color: secondaryColor }} className="applicationbody__multiselection">
						{translationObject[uiLanguage].dragSlider}
					</span>
				</div>
				<div className="cell small-24">
						<Slider
							value={values[field]}
							aria-label="Default"
							valueLabelDisplay="on"
							min={minValue}
  							max={maxValue}
						 	marks={marks}
							sx={{
								color: primaryColor,
							}}
							onChange={event => {
								const newValue = {
									...values,
									[field]: event.target.value,
								};
								this.setState({
									values: newValue,
								});
							}}
                            onChangeCommitted={(event, newSliderValue) => {
                                const newValue = {
									...values,
									[field]: newSliderValue,
								};
                                this.saveCurrentFormValues(newValue);
                            }}
						/>
				</div>
			</div>
		);
	};

	// TODO: not ready
	renderReturnInput = (blockdata, field) => {
		const { type } = blockdata['@attributes'];
		const { blockQuestion } = blockdata;
		let blockAnswers;
		if (blockdata.blockAnswers && blockdata.blockAnswers[0]) {
			blockAnswers = blockdata.blockAnswers.map(blockAnswer => ({
				...blockAnswer.blockAnswer,
				answerValue: blockAnswer.answerValue,
			}));
		}

		switch (type) {
			case 'radio':
				return this.renderRadioGroup(blockQuestion, blockAnswers, field);
			case 'datepicker':
				return this.renderDatePicker(blockQuestion, field);
			case 'check':
				return this.renderCheckbox(blockQuestion, blockAnswers, field);
			case 'inputrange':
				return this.renderInputRange(blockQuestion, blockAnswers, field);
			case 'input':
				return this.renderInput(blockQuestion, field);
			default:
				return <span>Wrong Input type!</span>;
		}
	}

	renderHeader = () => {
		const {
			page_now,
			language,
			questionnaireData,
			questionnaireData: {
				config: {
					mainColors: { primaryColor },
				},
			},
			count_cats,
		} = this.props;
		const catTitleColor = questionnaireData.categories[count_cats].catcolor
			? questionnaireData.categories[count_cats].catcolor
			: primaryColor;
		if (
			page_now.pageInformations.showPageInformations === '1' &&
			page_now.pageInformations['@attributes'].position_to_catname === 'before'
		) {
			return (
				<header className="applicationbody__catheader">
					<h2 style={{ color: primaryColor }}>{page_now.pageInformations.pageInformationsSubtitle[language]}</h2>
					<p
						dangerouslySetInnerHTML={{
							__html: page_now.pageInformations.pageInformationsDescription[language],
						}}
						className="clearfix"
					/>
					<h3 style={{ color: catTitleColor }} className="applicationbody__catname">
						{questionnaireData.categories[count_cats].categoryName[language]}
					</h3>
				</header>
			);
		}
		if (
			page_now.pageInformations.showPageInformations === '1' &&
			page_now.pageInformations['@attributes'].position_to_catname === 'after'
		) {
			return (
				<header className="applicationbody__catheader">
					<h2 style={{ color: catTitleColor }} className="applicationbody__catname">
						{questionnaireData.categories[count_cats].categoryName[language]}
					</h2>
					<h3>{page_now.pageInformations.pageInformationsSubtitle[language]}</h3>
					<p
						dangerouslySetInnerHTML={{
							__html: page_now.pageInformations.pageInformationsDescription[language],
						}}
						className="clearfix"
					/>
				</header>
			);
		}
		return null;
	};

	generateTo = mode => {
		const { animationStart, animationEnd } = this.state;
		if (mode === 'o') {
			if (animationStart) {
				if (animationEnd) {
					return 0;
				}
				return 1;
			}
			if (!animationEnd) {
				return 0;
			}
		}
		if (mode === 'x') {
			if (animationStart) {
				if (animationEnd) {
					return 100;
				}
				return 0;
			}
			if (!animationEnd) {
				return -100;
			}
		}
		return null;
	};

	handleAfterAnimation = () => {
        
		const { animationStart, animationEnd, values, form_is_valid } = this.state;
		if ((this.navigationMode === 'continue' && !form_is_valid) || !(animationEnd && animationStart)) {
            // console.log('handleAfterAnimation not');
			return;
		}

        const {
            page_now, // Object with the whole blocks with questions and blockAnswers
            count_cats, // Which category in the catetgory array do we have now?
            count_pages, // Which page in the page array do we have now?
            categories_pages_quantity, // How many pages has a category, how many cats do exist?
            catValuesCountAll, // action
            values_not_for_categories,
            goBackOnePage, // Action to go back one page in the form
            questionnaireData
        } = this.props;

        

        if (this.navigationMode === 'continue') {
            const cat_new = count_pages + 1 === categories_pages_quantity.cats[count_cats].pages ? count_cats + 1 : count_cats;
            const page_new = count_pages + 1 === categories_pages_quantity.cats[count_cats].pages ? 0 : count_pages + 1;
            const blocks_of_current_page = page_now.blocks.length;
    
            if (count_cats === 0) {
                values_not_for_categories.push(values);
            }
    
            this.radioButtonRefs = [];
            catValuesCountAll(
                cat_new,
                page_new,
                count_cats,
                blocks_of_current_page,
                values_not_for_categories,
                count_pages,
                cloneDeep(values)
            );
        }
		
        if (this.navigationMode === 'goback') {
            const cat_new = count_pages === 0 ?  count_cats - 1 : count_cats;
            const page_new = count_pages === 0 ? categories_pages_quantity.cats[cat_new].pages -1 : count_pages - 1;
            const blocksOfPreviousPage = questionnaireData.categories[cat_new].categoryPages[page_new].blocks.length;
            this.radioButtonRefs = [];
            goBackOnePage(cat_new, page_new, blocksOfPreviousPage);

        }
	};

	renderActiveForm = () => {
		const { page_now, count_cats, count_pages, language, questionnaireData, uiLanguage } = this.props;
		const { animationStart, animationEnd, form_is_valid } = this.state;
		const primaryBaseColor = questionnaireData.config.mainColors.primaryColor;
		const primaryColor = Color(questionnaireData.config.mainColors.primaryColor);
		const transitionWrapper = classnames('applicationbody__transition-wrapper', {
			'applicationbody__transition--show': animationStart && !animationEnd,
		});
		const catTitleColor = questionnaireData.categories[count_cats].catcolor
			? questionnaireData.categories[count_cats].catcolor
			: primaryColor;

		return (
			<div className="applicationbody__form grid-container">
				<div className={transitionWrapper}>
					{page_now.pageInformations.showPageInformations === '1' ? (
						this.renderHeader()
					) : (
						<header className="applicationbody__catheader" style={{ color: primaryColor }}>
							<h2 style={{ color: catTitleColor }} className="applicationbody__catname">
								{questionnaireData.categories[count_cats].categoryName[language]}
							</h2>
						</header>
					)}
				</div>
				<Trail
					native
					reverse={false}
					initial={null}
					items={page_now.blocks}
					immediate={!animationStart && !animationEnd}
					from={{ opacity: 0, x: -100 }}
					to={{ opacity: this.generateTo('o'), x: this.generateTo('x') }}
					keys={item => item.key}
					onRest={this.handleAfterAnimation}
					config={this.animationConfig}
				>
					{(item, i) => ({ x, opacity }) => (
						<animated.div
							className=""
							style={{
								opacity,
								transform: x.interpolate(y => `translate3d(${y}%,0,0)`),
							}}
                            key={item.key}
						>   
							<div className="applicationbody__block-wrapper">
								{this.renderReturnInput(item, i)}
								<div className="applicationbody__block-border applicationbody__block-border--bottom-left" />
								<div className="applicationbody__block-border applicationbody__block-border--bottom-right" />
							</div>
						</animated.div>
					)}
				</Trail>
				<div className={`${transitionWrapper} applicationbody__navigation-buttons`}>
					<div className="applicationbody__page-button-wrapper">
                        <div className="applicationbody__page-button--inner applicationbody__page-button--left">
                            {!(count_cats === 0 && count_pages === 0) &&
                            <CustomButton
                                type="button"
                                onClick={() => this.save('goback')}
                                buttonString={translationObject[uiLanguage].goBack}
                                buttonIcon={faChevronLeft}
                                iconIsOnTheLeft={true}
                                backgroundColor={primaryBaseColor}
                                isActionButton={true}
                                isDisabled={false}
                            />
                            }
                        </div>
                        <div className="applicationbody__page-button--inner applicationbody__page-button--right">
                            <CustomButton
                                type="button"
                                onClick={form_is_valid ? () => this.save('continue') : null}
                                buttonString={translationObject[uiLanguage].continue}
                                buttonIcon={faChevronRight}
                                iconIsOnTheLeft={false}
                                backgroundColor={primaryBaseColor}
                                isActionButton={true}
                                isDisabled={form_is_valid ? false : true}
                            />
                        </div>
					</div>
				</div>
			</div>
		);
	};

	render() {
		const { show_result, footer, language, style, children } = this.props;
		
        return (
			<animated.div className="router-animation-wrapper" style={{ ...style }}>
				{!show_result ? (
					<div className="applicationbody">
						<div className="applicationbody__scrolldiv">
							<div className="applicationbody__scrolldiv-inner">
								<div className="application__scroll-flex-wrapper">
									{this.renderActiveForm()}
									<ApplicationFooter footer={footer} language={language} logoAsBackgroundImage="false" />
								</div>
							</div>
						</div>
					</div>
				) : (
					<div className="applicationbody">
						<div className="applicationbody__scrolldiv">
							<div className="applicationbody__scrolldiv-inner">
								<div className="application__scroll-flex-wrapper">
                                    {children}
									<ApplicationFooter footer={footer} language={language} logoAsBackgroundImage="false" />
								</div>
							</div>
						</div>
					</div>
				)}
			</animated.div>
		);
	}
}

ApplicationBody.defaultProps = {
	page_now: undefined,
	count_cats: undefined,
	count_pages: undefined,
	categories_pages_quantity: undefined,
	language: undefined,
	catValuesCountAll: undefined,
	questionnaireData: undefined,
    goBackOnePage: undefined
};

ApplicationBody.propTypes = {
	page_now: PropTypes.object,
	count_cats: PropTypes.number,
	count_pages: PropTypes.number,
	categories_pages_quantity: PropTypes.object,
	language: PropTypes.string,
	catValuesCountAll: PropTypes.func,
	show_result: PropTypes.bool.isRequired,
	values_not_for_categories: PropTypes.array.isRequired,
	questionnaireData: PropTypes.object,
	footer: PropTypes.object.isRequired,
	uiLanguage: PropTypes.string.isRequired,
	style: PropTypes.object.isRequired,
    goBackOnePage: PropTypes.func
};
