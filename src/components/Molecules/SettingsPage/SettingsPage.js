import React, { PureComponent } from 'react';
import Select from 'react-select';
import PropTypes from 'prop-types';
import { animated } from '@react-spring/web'
import { translationObject } from '../../../constants/translation';
import { faChevronLeft } from '@fortawesome/free-solid-svg-icons'
import './SettingsPage.css';
import NavButton from '../../Atoms/NavButton/NavButton';
import { VERSION } from '../../../constants/config';


class SettingsPage extends PureComponent {
	generateLanguageSelectOptions = () => {
		const { questionnaireData } = this.props;
		const selectOptions = questionnaireData.config.language.languages;

		const newOptions = selectOptions.map(option => ({
			value: option.short,
			label: option.long,
		}));

		return newOptions;
	};

	handleChange = selectedOption => {
		const { changeDefaultLanguageAction } = this.props;
		changeDefaultLanguageAction(selectedOption.value);
	};

	render() {
		const { language, questionnaireData, uiLanguage, style } = this.props;
		const selectOptions = this.generateLanguageSelectOptions();
		const selectedOptionLabel = selectOptions.find(value => value.value === language).label;
		const {
			config: {
				mainColors: { primaryColor },
			},
		} = questionnaireData;

		return (
			<animated.div className="router-animation-wrapper" style={{ ...style }}>
				<div className="settings">
					<NavButton wrapperClasses="padding--medium" type="custom" color={primaryColor} title={translationObject[uiLanguage].goBack} icon={faChevronLeft}/>
					<div className="settings__scrolldiv">
						<div className="settings__scrolldiv-inner">
							<div className="settings__options-wrapper">
								<div className="settings__section settings__section--language">
									<div className="settings__section--select">
										<Select
											value={language}
											onChange={this.handleChange}
											options={this.generateLanguageSelectOptions()}
											placeholder={translationObject[uiLanguage].selectLanguage}
										/>
									</div>
									<p>{selectedOptionLabel}</p>
								</div>
							</div>
                            <div className="settings__options-wrapper settings__options-wrapper--version">
								<span>{translationObject[uiLanguage].version}: {VERSION}</span>
							</div>

						</div>
					</div>
				</div>
			</animated.div>
		);
	}
}

SettingsPage.propTypes = {
	language: PropTypes.string.isRequired,
	questionnaireData: PropTypes.object.isRequired,
	changeDefaultLanguageAction: PropTypes.func.isRequired,
    uiLanguage: PropTypes.string.isRequired,
    style: PropTypes.object.isRequired
};

export default SettingsPage;
