import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Transition from 'react-transition-group/Transition';
import classnames from 'classnames';
import { translationObject } from '../../../constants/translation';
import NavButton from '../../Atoms/NavButton/NavButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faGear, faChartSimple, faUpRightAndDownLeftFromCenter, faDownLeftAndUpRightToCenter} from '@fortawesome/free-solid-svg-icons'
import './ApplicationHeader.css';

export default class ApplicationHeader extends PureComponent {

	constructor(props) {
		super(props);
		this.state = {
			mobileNavOpen: false,
		};
	}
	
	handleNavOpen = () => {
		this.setState(previousState => ({
			...previousState,
			mobileNavOpen: !previousState.mobileNavOpen,
		}));
	}

	render() {
		const {
			title,
			count_blocks,
			number_of_blocks_overall,
			button_text,
			button_link,
			showButton,
			primaryColor,
			secondaryColor,
			logoUrl,
			showLogo,
			showBackgroundImage,
			backgroundUrl,
			backendInfos,
			compareGraphs,
			uiLanguage
		} = this.props;
		const progress_precent = Math.floor((count_blocks / number_of_blocks_overall) * 100);
		const { mobileNavOpen } = this.state;

		// configuration for transition
		const duration = 500;
		const defaultWidth = {
			transition: `width ${duration}ms ease-out`,
			width: 0,
		};
		const transitionWidth = {
			entering: { width: 0 },
			entered: { width: `${progress_precent}%` },
		};

		const mobileNavClass = classnames('applicationheader__mobile-nav-wrapper', {
			'applicationheader__mobile-nav-down': mobileNavOpen,
		});

		return (
			<div
				className="applicationheader grid-x grid-padding-x"
				style={{
					backgroundColor: primaryColor,
					backgroundImage: showBackgroundImage === '1' ? `url(${backgroundUrl})` : null,
				}}
			>
				<div className="cell">
					<div className="applicationheader__wrapper">
						{showLogo === '1' && <img className="applicationheader__logo" src={logoUrl} alt="go back" />}

						<h1 className="applicationheader__title">{title}</h1>

						<nav className="applicationheader__nav">
							{showButton === '1' && (
								<li className="applicationheader__li">
									<a 
										href={button_link}
										className="applicationheader__button"
										title={translationObject[uiLanguage].goTo}
									>
										<span style={{ color: primaryColor }}>{button_text}</span>
									</a>
								</li>
							)}
							{(backendInfos.is_compare === true) && (compareGraphs === '1') && (
								<li className="applicationheader__li">
									<NavButton title={translationObject[uiLanguage].resultCompare} type="simple" endpoint="compare" icon={faChartSimple}/>
								</li>
							)}

							<li className="applicationheader__li">
								<NavButton title={translationObject[uiLanguage].settings} type="simple" endpoint="settings" icon={faGear}/>
							</li>
						</nav>
					</div>
					<div className="applicationheader__progress-wrapper">
						<Transition in timeout={0} appear>
							{state => (
								<div
									className="applicationheader__progress-inner"
									style={{
										backgroundColor: secondaryColor,
										...defaultWidth,
										...transitionWidth[state],
									}}
								/>
							)}
						</Transition>
					</div>
				</div>
				<div
					onClick={() => {
						this.handleNavOpen();
					}}
					onKeyPress={() => {
						this.handleNavOpen();
					}}
					className="applicationheader__navtoggle"
					role="button"
					tabIndex={0}
				>
					{mobileNavOpen ? (
						<span className="applicationheader__navtoggle-icon"><FontAwesomeIcon color="#fff" icon={faDownLeftAndUpRightToCenter} /></span>
					) : (
						<span className="applicationheader__navtoggle-icon"><FontAwesomeIcon color="#fff" icon={faUpRightAndDownLeftFromCenter} /></span>
					)}
				</div>
				<div
					className={mobileNavClass}
					style={{
						backgroundColor: primaryColor,
					}}
				>
					<nav className="applicationheader__mobile-nav">
						<ul>
							<li className="applicationheader__mobile-li">
								<div
										onClick={() => {
												this.setState({
													mobileNavOpen: false,
												});
										}}
										onKeyDown={() => {
											this.setState({
												mobileNavOpen: false,
											});
									}}
									role="button"
									tabIndex="0"
									>
										<NavButton
											title={translationObject[uiLanguage].settings}
											endpoint="settings"
											icon={faGear}
											type="simple"
										/>
									</div>
							</li>
							{(backendInfos.is_compare === true) && (compareGraphs === '1') && (
								<li className="applicationheader__mobile-li">
									<div
										onClick={() => {
												this.setState({
													mobileNavOpen: false,
												});
										}}
										onKeyDown={() => {
											this.setState({
												mobileNavOpen: false,
											});
									}}
									role="button"
									tabIndex="0"
									>
										<NavButton
											title={translationObject[uiLanguage].resultCompare}
											endpoint="compare"
											icon={faChartSimple}
											type="simple"
										/>
									</div>
									
								</li>
							)}
							{showButton === '1' && (
								<li className="applicationheader__li">
									<a
										onClick={() => {
											this.setState(previousState => ({
												...previousState,
												mobileNavOpen: !previousState.mobileNavOpen,
											}));
										}}
										href={button_link}
										className="applicationheader__button"
										title={translationObject[uiLanguage].goTo}
									>
										<span style={{ color: primaryColor }}>{button_text}</span>
									</a>
								</li>
							)}
						</ul>
					</nav>
				</div>
			</div>
		);
	}
}

ApplicationHeader.propTypes = {
	title: PropTypes.string.isRequired,
	count_blocks: PropTypes.number.isRequired,
	number_of_blocks_overall: PropTypes.number.isRequired,
	button_text: PropTypes.string.isRequired,
	button_link: PropTypes.string.isRequired,
	showButton: PropTypes.string.isRequired,
	primaryColor: PropTypes.string.isRequired,
	secondaryColor: PropTypes.string.isRequired,
	logoUrl: PropTypes.string.isRequired,
	showLogo: PropTypes.string.isRequired,
	showBackgroundImage: PropTypes.string.isRequired,
	backgroundUrl: PropTypes.string.isRequired,
	backendInfos: PropTypes.object.isRequired,
	compareGraphs: PropTypes.string.isRequired,
	uiLanguage: PropTypes.string.isRequired
};
