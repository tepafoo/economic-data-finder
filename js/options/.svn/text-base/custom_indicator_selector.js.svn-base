/**
 * Lists the different types supported by this widget.
 */
CustomIndicatorSelector.Type = {
	ADD : 0,
	EDIT : 1,
	DELETE : 2
}

/**
 * Constructor.
 * 
 * @param type
 */
function CustomIndicatorSelector(type) {

	// make sure this was called using the 'new' keyword
	if (!(this instanceof arguments.callee)) {
		throw new Error('Constructor called as a function');
	}

	// private members
	var that = this;
	var customIndicatorWidget;
	var saveIndicator;
	var container;

	// private methods

	/**
	 * Creates a custom indicator widget.
	 * 
	 * @param saveIndicatorButton
	 * @returns {CustomIndicatorWidget}
	 */
	function createCustomIndicatorWidget(saveIndicatorButton) {
		return new CustomIndicatorWidget(function(isValid, editStateChanged) {

			var saveButtonDisabled = saveIndicatorButton.getAttribute('disabled') === 'disabled';

			if (isValid && editStateChanged && saveButtonDisabled) {
				saveIndicatorButton.removeAttribute('disabled');
			} else if (!saveButtonDisabled && (editStateChanged && !isValid || !editStateChanged && isValid)) {
				saveIndicatorButton.setAttribute('disabled', 'disabled');
			}
		});
	}

	/**
	 * Resets the view.
	 */
	function resetView() {
		// reset the view
		$(container).empty();
		populateView();
	}

	/**
	 * Creates a custom indicator widget and adds it to the container.
	 */
	function addCustomIndicatorWidgetToContainer() {
		saveIndicator = new ButtonWithFeedbackMessage(true, 'saveCustomIndicator', chrome.i18n
				.getMessage('options_page_save_button'), chrome.i18n.getMessage('options_page_indicators_tab_indicator_saved'));

		customIndicatorWidget = createCustomIndicatorWidget(saveIndicator.getButton());
		container.appendChild(customIndicatorWidget.asWidget());

		container.appendChild(saveIndicator.asWidget());
	}

	/**
	 * Populates the view.
	 */
	function populateView() {
		var populateEditOrDeleteView = function(onSelectionChange) {
			DataLoader.getListOfCustomIndicators(Util.currentLocale, function(customIndicators) {
				if (customIndicators.length > 0) {
					var editOrDeleteView = document.createElement('select');
					$(editOrDeleteView).addClass('customIndicatorSelector-listBox');

					// 'Please select...'
					var option = DomUtil.createOptionElement(chrome.i18n.getMessage('options_page_indicators_tab_please_select_custom_indicator'),
							'pleaseSelect');
					editOrDeleteView.appendChild(option);

					for ( var i = 0; i < customIndicators.length; i++) {
						var customIndicator = customIndicators[i];
						var option = DomUtil.createOptionElement(customIndicator.name, customIndicator.id);
						editOrDeleteView.appendChild(option);
					}

					editOrDeleteView.onchange = function() {
						onSelectionChange(editOrDeleteView);
					}
				} else {
					var editOrDeleteView = DomUtil.createLabel(chrome.i18n.getMessage('options_page_indicators_tab_no_custom_indicator'));
				}
				container.appendChild(editOrDeleteView);

			});
		}

		// populate this widget depending on the type
		switch (type) {
		case CustomIndicatorSelector.Type.ADD:
			addCustomIndicatorWidgetToContainer();
			break;
		case CustomIndicatorSelector.Type.EDIT:
			var removeCustomIndicatorWidget = function() {
				if (customIndicatorWidget !== undefined) {
					if (container.contains(customIndicatorWidget.asWidget())) {
						container.removeChild(customIndicatorWidget.asWidget());
					}
					if (container.contains(saveIndicator.asWidget())) {
						container.removeChild(saveIndicator.asWidget());
					}
				}
			}

			populateEditOrDeleteView(function(listBox) {
				var selectedIndex = listBox.selectedIndex;
				removeCustomIndicatorWidget();
				if (selectedIndex !== 0) {
					DataLoader.getIndicatorData(listBox[selectedIndex].value, Util.currentLocale, function(data) {
						addCustomIndicatorWidgetToContainer();
						customIndicatorWidget.populate(data);
					});
				}
			});

			break;
		case CustomIndicatorSelector.Type.DELETE:
			populateEditOrDeleteView(function(listBox) {
				var deleteIndicator = confirm('Please confirm the deletion of ' + listBox[listBox.selectedIndex].text);
				if (deleteIndicator) {
					DataLoader.deleteIndicator(listBox[listBox.selectedIndex].value);
				}

				resetView();
			});
			break;
		}
	}

	// end of private methods

	container = document.createElement('form');
	container.addEventListener('submit', function(e) {
		// prevent the submit event from propagating
		e.preventDefault();

		switch (type) {
		case CustomIndicatorSelector.Type.ADD:
			DataLoader.saveIndicator(customIndicatorWidget.getData());
			break;
		case CustomIndicatorSelector.Type.EDIT:
			DataLoader.updateIndicator(customIndicatorWidget.getStateDelta());
			break;
		default:
			break;
		}

		saveIndicator.showFeedbackMessage();

		resetView();

		// update the list of keywords cached in the background page
		chrome.extension.getBackgroundPage().getKeywords();
	});

	populateView();

	return container;
}