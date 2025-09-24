import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Color from 'color';
import './CustomButtom.css';

export default class CustomButton extends PureComponent {

    constructor(props) {
		super(props);

		this.state = {
			isHovered: false
		};
	}

	/* eslint-disable react/button-has-type */
	renderIconButton = (buttonString, buttonIcon, backgroundColor, color, onClick, title, type, iconIsOnTheLeft, isActionButton, isDisabled, backgroundColorDarken) => {
        const buttonClass = classnames('custombutton custombuttom--icon', {
			'custombuttom--icon--disabled': isDisabled,
		});

        return  <button
                    style={{backgroundColor: this.state.isHovered ? backgroundColorDarken : backgroundColor }}
                    type={type}
                    className={buttonClass}
                    onClick={() => {if (!isDisabled) { onClick() }}}
                    title={title}
                    ref={element => {this.buttonRef = element}}
                    onMouseOver={() => {
                        if (isActionButton && !isDisabled) {
                            this.setState({isHovered: true});
                        }
                        // console.log('renderIconButton ');
                    }}
                    onMouseOut={() => {
                        if (isActionButton && !isDisabled) {
                            this.setState({isHovered: false});
                        }
                    }}
                >
                    {iconIsOnTheLeft
                        ?
                            <>
                                <FontAwesomeIcon className="custombutton__icon custombutton__icon--left" color="#fff" icon={buttonIcon} fade={this.state.isHovered}/>
                                <span style={{ color }}>{buttonString}</span>
                            </>
                        :
                            <>
                                <span style={{ color }}>{buttonString}</span>
                                <FontAwesomeIcon className="custombutton__icon custombutton__icon--right" color="#fff" icon={buttonIcon} fade={this.state.isHovered}/>
                                
                            </>
                    }
                    
                </button>
    };

	renderButton = (buttonString, backgroundColor, color, onClick, title, type, isActionButton, isDisabled, backgroundColorDarken) => (
			<button
                style={{backgroundColor: this.state.isHovered ? backgroundColorDarken : backgroundColor }}
				type={type}
				className="custombutton custombuttom--noicon"
				onClick={onClick}
				title={title}
                onMouseOver={() => {
                    if (isActionButton && !isDisabled) {
                        this.setState({isHovered: true});
                    }
                    console.log('renderButton ');
                }}
                onMouseOut={() => {
                    if (isActionButton && !isDisabled) {
                        this.setState({isHovered: false});
                    }
                }}
			>
				<span style={{ color }}>{buttonString}</span>
			</button>
	);
	/* eslint-enable react/button-has-type */

	render() {
		const { buttonString, buttonIcon, backgroundColor, color, onClick, title, type, wrapperClasses, iconIsOnTheLeft, isActionButton, isDisabled} = this.props;
        const colorBackgroundColor = Color(backgroundColor);
        const backgroundColorDarken = Color(backgroundColor).darken(0.3);

		return (
			<div className={wrapperClasses}>
				{buttonIcon
					? this.renderIconButton(buttonString, buttonIcon, colorBackgroundColor, color, onClick, title, type, iconIsOnTheLeft, isActionButton, isDisabled, backgroundColorDarken)
					: this.renderButton(buttonString, colorBackgroundColor, color, onClick, title, type, isActionButton, isDisabled, backgroundColorDarken)}
			</div>
		);
	}
}

CustomButton.defaultProps = {
	buttonIcon: null,
	onClick: null,
	title: null,
	backgroundColor: '#666666',
	color: '#ffffff',
	type: 'button',
	wrapperClasses: '',
    iconIsOnTheLeft: true,
    isActionButton: false,
    isDisabled: false
};

CustomButton.propTypes = {
	buttonString: PropTypes.string.isRequired,
	buttonIcon: PropTypes.object,
	backgroundColor: PropTypes.string,
	color: PropTypes.string,
	onClick: PropTypes.func,
	title: PropTypes.string,
	type: PropTypes.string,
	wrapperClasses: PropTypes.string,
    iconIsOnTheLeft: PropTypes.bool,
    isActionButton: PropTypes.bool,
    isDisabled: PropTypes.bool
};
