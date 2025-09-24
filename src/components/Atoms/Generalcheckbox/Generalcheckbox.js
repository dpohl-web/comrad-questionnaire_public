import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import './Generalcheckbox.css';

class GeneralCheckbox extends Component {

	checkButtonRef;

	constructor(props) {
		super(props);

		this.state = {
			isChecked: props.value,
		};
	}

	toggleCheckboxChange = () => {
		const { handleCheckboxChange, name } = this.props;

		this.setState(({ isChecked }) => ({
			isChecked: !isChecked,
		}), () => {
			const { isChecked } = this.state;
			handleCheckboxChange(isChecked, name);
		});

		
	};

	render() {
		const { label, name, primaryColor, labelPosition } = this.props;
		const { isChecked } = this.state;
		const switchClasses = classnames('applicationbody__answer switch small', {
            'checkbox-general__mrm': (labelPosition === 'right'),
			'checkbox-general__mlm': (labelPosition === 'left'),
		});

		return (
			<div className="checkbox checkbox--general">
				<div className="applicationbody__labels-answers">
					{labelPosition === 'left' && (
						<label className="checkbox--general__label" htmlFor={name}>
						{label}
					</label>
					)}
					<div className={switchClasses}>
						<input
							ref={element => {
								this.checkButtonRef = element;
							}}
							type="checkbox"
							checked={isChecked}
							onChange={this.toggleCheckboxChange}
							name={name}
							id={name}
							className="switch-input"
						/>
						<>{ /* eslint-disable-next-line jsx-a11y/label-has-associated-control */ }</>
						<label
							className="switch-paddle"
							htmlFor={name}
							style={
								isChecked
									? { backgroundColor: primaryColor }
									: { backgroundColor: '#bbb' }
							}
						/>
					</div>
					{labelPosition === 'right' && (
						<label className="checkbox--general__label checkbox--general__label--right" htmlFor={name}>
						{label}
					</label>
					)}
				</div>
			</div>
		);
	}
}

GeneralCheckbox.propTypes = {
	label: PropTypes.string.isRequired,
	handleCheckboxChange: PropTypes.func.isRequired,
	name: PropTypes.string.isRequired,
	primaryColor: PropTypes.string.isRequired,
	value: PropTypes.bool.isRequired,
	labelPosition: PropTypes.string.isRequired
};

export default GeneralCheckbox;
