import React, { Component } from 'react';
import PropTypes from 'prop-types';
import produce from 'immer';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';
import PulseLoader from 'react-spinners/PulseLoader';
import { translationObject, tryToTranslate } from '../../../constants/translation';
import './DownloadPdf.css';
import CustomButton from '../../Atoms/CustomButtom/CustomButtom';
import {faFileArrowDown, faEnvelope} from '@fortawesome/free-solid-svg-icons'


/* eslint-disable-next-line no-useless-escape */
const emailRegEx = /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;

class DownloadPdf extends Component {

	snackBarMessage = '';
	
	snackBarMessageStatus = 'success';

	constructor(props) {
		super(props);
		this.state = {
			snackbarOpen: false,
			showPdfAsEmailInput: false,
			pdfEmail: '',
			pdfEmailPassword: '',
			prevProps: undefined
		};
	}

	componentDidUpdate(prevProps, prevState, snapshot) {
		const { pdfIsCreating, uiLanguage } = this.props;
		if (prevProps.pdfIsCreating.status !== pdfIsCreating.status && pdfIsCreating.responseString) {
			this.snackBarMessage = tryToTranslate(translationObject, uiLanguage, pdfIsCreating.responseString);
			this.snackBarMessageStatus = pdfIsCreating.status === 'fail' ? 'error' : 'success';

			this.setState({ snackbarOpen: true });
		}
	}

	/**
	 * We need the prevprops so we put it in the state to have access
	 * We want to clear the inputs for the pdf by e-mail when it was successfull.
	 *
	 * @param {object} props // current props
	 * @param {object} state // current state
	 * @returns {object} // The changes for the new state
	 */
	static getDerivedStateFromProps(props, state) {
		if (state.prevProps && (state.prevProps.pdfIsCreating.status !== props.pdfIsCreating.status) && (props.pdfIsCreating.status === 'success')) {
		  return {
			showPdfAsEmailInput: false,
			prevProps: props,
			pdfEmail: '',
			pdfEmailPassword: ''
		  };
		}
		return {
			prevProps: props,
		  };
	}

	handlePdfAsEmail = () => {
		this.setState(
			produce((draft) => {
				draft.showPdfAsEmailInput = !draft.showPdfAsEmailInput;
			})
		);
	};

    handleCloseSnackbar = (event, reason) => {
        if (reason !== 'clickaway') {
            this.setState({ snackbarOpen: false });
        }
    }

	handleChangePdfEmail = (event) => {
		const { name: fieldName, value: fieldValue } = event.target;
		this.setState(
			produce((draft) => {
				draft[fieldName] = fieldValue;
			})
		);
	};

	createPdf = () => {
		const { getPdfLinkAction } = this.props;
		const html = document.getElementById('divToPrint').innerHTML;
		getPdfLinkAction(html, '', '', '');
	};

	createPdfAsEmail = () => {
		const { getPdfLinkAction, uiLanguage, questionnaireFileName } = this.props;
		const { pdfEmail, pdfEmailPassword } = this.state;

		const preparedEmailString = String(pdfEmail).toLowerCase().trim();

		const isEmail = emailRegEx.test(preparedEmailString);
		const isPassword = pdfEmailPassword.length;

		if (!isEmail) {
			this.snackBarMessage = translationObject[uiLanguage].insertEmailAlert;
			this.snackBarMessageStatus = 'error';
			this.setState({ snackbarOpen: true });
			return;
		}

		if (!isPassword) {
			this.snackBarMessage = translationObject[uiLanguage].insertPassword;
			this.snackBarMessageStatus = 'error';
			this.setState({ snackbarOpen: true });
			return;
		}

		const html = document.getElementById('divToPrint').innerHTML;
		getPdfLinkAction(html, preparedEmailString, pdfEmailPassword, questionnaireFileName);

	};

	renderSpinner = (isactive) => {
		const { primaryColor } = this.props;

		return (
			<div className="sweet-loading">
				<PulseLoader size={20} color={primaryColor} loading={isactive} />
			</div>
		);
	};

	render() {
		const { pdfIsCreating, uiLanguage, primaryColor, pdfGroup } = this.props;
		const { showPdfAsEmailInput, pdfEmail, pdfEmailPassword, snackbarOpen } = this.state;

		return (
			<div>
				{!pdfIsCreating.isLoading && ((typeof pdfGroup === 'undefined') || (pdfGroup.pdfDirectly === '1')) && (
					<div className="margin-bottom--medium">
						<CustomButton
                            buttonIcon={faFileArrowDown}
							buttonString={translationObject[uiLanguage].DownloadPDF}
							backgroundColor={primaryColor}
                            isActionButton={true}
							onClick={this.createPdf}
						/>
					</div>
				)}

				{this.renderSpinner(pdfIsCreating.isLoading)}

				{!pdfIsCreating.isLoading && pdfGroup && pdfGroup.pdfAsEmail === '1' && (
					<div>
						<CustomButton
                            buttonIcon={faEnvelope}
							buttonString={translationObject[uiLanguage].sendPdfAsEmail}
							backgroundColor={primaryColor}
                            isActionButton={true}
							onClick={this.handlePdfAsEmail}
						/>
						{showPdfAsEmailInput && (
							<>
								<div className="input-group margin-top--medium">
									<input
										maxLength="300"
										className="input-group-field"
										aria-describedby="pdfAsEmailHelpText"
										type="text"
										name="pdfEmail"
										value={pdfEmail}
										onChange={this.handleChangePdfEmail}
									/>
								</div>
								<p className="help-text" id="pdfAsEmailHelpText">
									{translationObject[uiLanguage].insertEmail}
								</p>
							</>
						)}
						{showPdfAsEmailInput && (
							<>
								<div className="input-group margin-top--medium">
									<input
										maxLength="300"
										className="input-group-field"
										aria-describedby="pdfAsEmailPasswordHelpText"
										type="text"
										name="pdfEmailPassword"
										value={pdfEmailPassword}
										onChange={this.handleChangePdfEmail}
									/>
									<div className="input-group-button">
										<input style={{ backgroundColor: primaryColor }} type="button" className="button downloadpdf__submit" value="Submit" onClick={this.createPdfAsEmail} />
									</div>
								</div>
								<p className="help-text" id="pdfAsEmailPasswordHelpText">
									{translationObject[uiLanguage].insertPassword}
								</p>
							</>
						)}
						
					</div>
				)}
				<Snackbar
					autoHideDuration={5000}
					open={snackbarOpen}
					onClose={this.handleCloseSnackbar}
					anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}>
					<MuiAlert
                        onClose={this.handleCloseSnackbar}
                        severity={this.snackBarMessageStatus}
                        sx={{ width: '100%' }}
                        elevation={6}
                        variant="filled"
                    >
						{this.snackBarMessage}
					</MuiAlert>
				</Snackbar>
			</div>
		);
	}
}

DownloadPdf.defaultProps = {
	pdfGroup: undefined,
};

DownloadPdf.propTypes = {
	pdfIsCreating: PropTypes.object.isRequired,
	uiLanguage: PropTypes.string.isRequired,
	primaryColor: PropTypes.string.isRequired,
	getPdfLinkAction: PropTypes.func.isRequired,
	questionnaireFileName: PropTypes.string.isRequired,
	pdfGroup: PropTypes.object, // In old xml files pdfGroup is undefined. We have to use fallback in this component
};

export default DownloadPdf;
