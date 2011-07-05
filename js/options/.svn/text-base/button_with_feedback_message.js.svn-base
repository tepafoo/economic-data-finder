/**
 * Buttons that displays a feedback message on click.
 * 
 * @param isSubmit
 * @param id
 * @param buttonText
 * @param feedbackMessage
 * @param onclick
 * @returns {ButtonWithFeedbackMessage}
 */
function ButtonWithFeedbackMessage(isSubmit, id, buttonText, feedbackMessage, onclick) {

	// make sure this was called using the 'new' keyword
	if (!(this instanceof arguments.callee)) {
		throw new Error("Constructor called as a function");
	}

	this.container = document.createElement('div');

	$(this.container).addClass('buttonWithFeedbackMessage-container');
	this.container.id = id;

	this.feedback = document.createElement('div');
	$(this.feedback).addClass('buttonWithFeedbackMessage-feedback');
	this.feedback.innerText = feedbackMessage;
	$(this.feedback).hide();

	this.button = document.createElement('input');
	if (isSubmit) {
		this.button.type = 'submit';
	} else {
		this.button.type = 'button';
	}
	this.button.value = buttonText;

	$(this.button).addClass('buttonWithFeedbackMessage-button');

	if (typeof onclick === 'function') {
		this.button.onclick = function() {
			onclick();
		}
	}

	this.container.appendChild(this.button);
	this.container.appendChild(this.feedback);
};

/**
 * Returns the widget associated with this Object.
 */
ButtonWithFeedbackMessage.prototype.asWidget = function() {
	return this.container;
};

/**
 * Shows the success message.
 */
ButtonWithFeedbackMessage.prototype.showFeedbackMessage = function() {
	$(this.feedback).show();
	setTimeout('$("#' + this.container.id + ' .buttonWithFeedbackMessage-feedback").hide()', 2500);
};

/**
 * Gets the button associated with this Object.
 */
ButtonWithFeedbackMessage.prototype.getButton = function() {
	return this.button;
};