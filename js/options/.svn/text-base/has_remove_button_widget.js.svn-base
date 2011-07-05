/**
 * Widget that wraps the given element with a remove button.
 * 
 * @param element
 * @param onRemove
 */
function HasRemoveButtonWidget(element, onRemove) {

	// make sure this was called using the 'new' keyword
	if (!(this instanceof arguments.callee)) {
		throw new Error("Constructor called as a function");
	}

	// add the list box and the remove button to a container
	var container = document.createElement("div");
	container.className += ' hasRemoveButton-container';

	var deleteButton = document.createElement("div");
	deleteButton.className += ' clickable hasRemoveButton-deleteButton';
	deleteButton.title = chrome.i18n.getMessage("options_page_delete");
	deleteButton.onclick = function() {
		if (typeof onRemove === 'function') {
			onRemove();
		}
	};

	container.appendChild(element);
	container.appendChild(deleteButton);

	return container;
}