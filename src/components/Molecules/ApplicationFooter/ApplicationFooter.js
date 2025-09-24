import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import './ApplicationFooter.css';

export default class ApplicationFooter extends PureComponent {

	render() {
		const { footer, language, logoAsBackgroundImage } = this.props;
        const { footerLogo, footerText, footerRight, fontColor, backgroundColor } = footer;
        const flexBoxClasses = classnames('applicationfooter applicationfooter--wrapper', {
            'applicationfooter__flex-start': (footerText[language] !== '') && (footerRight[language] === '') });

		return (
			<div className={flexBoxClasses} style={{ backgroundColor, color: fontColor }}>
				{footerLogo.showFooterLogo === '1' && footerLogo.footerLogoUrl && logoAsBackgroundImage === 'true' && (
					<div
						className="applicationfooter-flex-item applicationfooter__logo"
						style={{ backgroundImage: `url('${footerLogo.footerLogoUrl}')` }}
					/>
				)}
				{footerLogo.showFooterLogo === '1' && footerLogo.footerLogoUrl && logoAsBackgroundImage === 'false' && (
					<div className="applicationfooter-flex-item applicationfooter__logo">
						<img className="applicationfooter__logo-image" src={footerLogo.footerLogoUrl} alt="footer logo" />
					</div>
				)}
				{footerText[language] !== '' && (
					<div className="applicationfooter__text applicationfooter-flex-item">{footerText[language]}</div>
				)}
				{footerRight[language] !== '' && (
					<div className="applicationfooter__right applicationfooter-flex-item">{footerRight[language]}</div>
				)}
			</div>
		);
	}
}

ApplicationFooter.propTypes = {
	footer: PropTypes.object.isRequired,
	language: PropTypes.string.isRequired,
	logoAsBackgroundImage: PropTypes.string.isRequired,
};
