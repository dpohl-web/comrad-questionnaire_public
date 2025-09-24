import React from 'react';
import { useNavigate } from 'react-router-dom';
import CustomButton from '../CustomButtom/CustomButtom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

import './NavButton.css';

const NavButton = (props) => {
	const { endpoint, icon, title, color, type, wrapperClasses } = props;
	const navigate = useNavigate();

	function handleClick() {
		if (typeof endpoint !== 'undefined') {
			navigate(`/${endpoint}`);
		} else {
			navigate(`/`);
		}
		
	}

	return (type === 'simple'
			?
				<button title={title} className="navbutton" type="button" onClick={handleClick}>
                    <FontAwesomeIcon className="navbutton__icon" color="#fff" icon={icon} />
				</button>
			:
				<CustomButton
					buttonString={title}
					buttonIcon={icon}
					backgroundColor={color}
					onClick={handleClick}
					wrapperClasses={wrapperClasses}
                    isActionButton={true}
				/>
	);
}

export default NavButton;
