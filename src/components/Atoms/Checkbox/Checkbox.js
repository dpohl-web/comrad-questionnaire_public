import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Checkbox extends Component {
	checkButtonRefs = [];

	constructor(props) {
		super(props);

		this.state = {
			isChecked: this.props.isChecked,
		};
	}

	toggleCheckboxChange = () => {
		const { handleCheckboxChange, value, name, index } = this.props;

		this.setState(({ isChecked }) => ({
			isChecked: !isChecked,
		}));

		handleCheckboxChange(value, name, index);
	};

	render() {
		const { label, value, name, index, primaryColor } = this.props;
		const { isChecked } = this.state;

		return (
			<div className="checkbox">
				<div className="applicationbody__labels-answers">
					<label className="applicationbody__label" htmlFor={`${name}${index}`}>
						{label}
					</label>
					<div className="applicationbody__answer switch small">
						<input
							ref={element => {
								this.checkButtonRefs[index] = element;
							}}
							type="checkbox"
							value={value}
							checked={isChecked}
							onChange={this.toggleCheckboxChange}
							name={name}
							id={`${name}${index}`}
							className="switch-input"
						/>
						<>{ /* eslint-disable-next-line jsx-a11y/label-has-associated-control */ }</>
						<label
							className="switch-paddle"
							htmlFor={`${name}${index}`}
							style={
								this.checkButtonRefs[index] && this.checkButtonRefs[index].checked
									? { backgroundColor: primaryColor }
									: { backgroundColor: '#bbb' }
							}
						/>
					</div>
				</div>
			</div>
		);
	}
}

Checkbox.propTypes = {
	label: PropTypes.string.isRequired,
	handleCheckboxChange: PropTypes.func.isRequired,
	value: PropTypes.number.isRequired,
	name: PropTypes.number.isRequired,
	index: PropTypes.number.isRequired,
	primaryColor: PropTypes.string.isRequired,
    isChecked: PropTypes.bool.isRequired
};

export default Checkbox;
