var TAB_HEADER_PREFIX = 'tabHeader';

// used in code related to location list boxes
var LOCATION_TYPE_DOM_DATASET = 'locationType'
var LOCATION_TYPE = {
	COUNTRY : 0,
	AGGREGATE : 1
}

/**
 * Gets the locations list boxes container.
 * 
 * @returns
 */
function getLocationsListBoxesContainer() {
	return document.getElementById('locationsListBoxesContainer');
}

/**
 * Adds a new locations list box to the DOM.<br/> The location names are extracted from the messages file (country, aggregate).
 * 
 * @param locationCodeToSelect
 *            optional, sets the location name to be selected on the list box
 * @param locationType
 *            one of the values from <code>LOCATION_TYPE</code>
 */

function addLocationsListBox(locationCodeToSelect, locationType) {

	var container = getLocationsListBoxesContainer();

	// create a select element
	var listBox = document.createElement('select');
	listBox.className += ' locationsListBox';

	// retrieve the list of locations from the messages file
	if (locationType === LOCATION_TYPE.COUNTRY) {
		var locations = JSON.parse(chrome.i18n.getMessage('countries'));
	} else {
		var locations = JSON.parse(chrome.i18n.getMessage('aggregates'));
	}

	listBox.dataset[LOCATION_TYPE_DOM_DATASET] = locationType;

	// loop through the location names and add option elements to the select element
	var selectedIndex = 0;
	for ( var i = 0; i < locations.length; i++) {
		var option = document.createElement('option');
		option.text = locations[i].name;
		option.setAttribute('value', locations[i].iso2Code);

		// check if this location should be selected
		if (locationCodeToSelect !== null && locations[i].iso2Code === locationCodeToSelect) {
			selectedIndex = i;
		}

		// add the option to the list box
		listBox.appendChild(option);
	}

	// set the selected index on the list box
	listBox.selectedIndex = selectedIndex;

	var locationsWidget = new HasRemoveButtonWidget(listBox, function() {
		container.removeChild(locationsWidget);
	});

	container.appendChild(locationsWidget);
}

/**
 * Sets the labels of the text nodes in the page.
 */
function setLabels() {
	document.getElementById('pageTitle').innerText = chrome.i18n.getMessage('options_page_title');
	document.getElementById('pageTitle2').innerText = chrome.i18n.getMessage('options_page_title');
	document.getElementById('tabHeader1').innerText = chrome.i18n.getMessage('options_page_general_tab_header');
	document.getElementById('tabHeader2').innerText = chrome.i18n.getMessage('options_page_world_bank_tab_header');
	document.getElementById('tabHeader3').innerText = chrome.i18n.getMessage('options_page_indicators_tab_header');
	document.getElementById('pageScanTitle').innerText = chrome.i18n.getMessage('options_page_scan_title');
	document.getElementById('scanAllLabel').innerText = chrome.i18n.getMessage('options_page_scan_all_websites');
	document.getElementById('scanManuallyLabel').innerText = chrome.i18n.getMessage('options_page_scan_manually');
	document.getElementById('keywordsTitle').innerText = chrome.i18n.getMessage('options_page_highlight_keywords_title');
	document.getElementById('highlightChekboxLabel').innerText = chrome.i18n.getMessage('options_page_highlight_keywords');
	document.getElementById('clickOnKeywordsChekboxLabel').innerText = chrome.i18n.getMessage('options_page_click_on_keywords');
	document.getElementById('locationsPreSelectionTitle').innerText = chrome.i18n.getMessage('options_page_location_names_title');
	document.getElementById('addCountryButton').innerText = chrome.i18n.getMessage('options_page_add_new_country');
	document.getElementById('addAggregateButton').innerText = chrome.i18n.getMessage('options_page_add_new_aggregate');
	document.getElementById('addIndicator').innerText = chrome.i18n.getMessage('options_page_add_indicator');
	document.getElementById('editIndicator').innerText = chrome.i18n.getMessage('options_page_edit_indicator');
	document.getElementById('deleteIndicator').innerText = chrome.i18n.getMessage('options_page_delete_indicator');
}

/**
 * Gets the list of locations codes as selected by the user.
 */
function getListOfLocationCodes() {
	var locations = [];

	var container = getLocationsListBoxesContainer();
	var locationListBoxes = container.getElementsByTagName('select');

	for ( var i = 0; i < locationListBoxes.length; i++) {
		var locationListBox = locationListBoxes[i];
		var location = {
			locationType : locationListBox.dataset[LOCATION_TYPE_DOM_DATASET],
			code : locationListBox[locationListBox.selectedIndex].value
		};

		locations.push(location);
	}

	return JSON.stringify(locations);
}

/**
 * Saves the settings in the general tab.
 */
function saveGeneralTabSettings() {

	// save the scan settings
	if (document.pageScanSettings.scanRadioButtons[0].checked) {
		localStorage[Constants.applicationSettings.pageScan] = Constants.pageScanSettings.scanAll;
	} else {
		localStorage[Constants.applicationSettings.pageScan] = Constants.pageScanSettings.scanManual;
	}

	// save the keyword settings
	localStorage[Constants.applicationSettings.highlightKeywords] = document.keywordSettings.highlightChekbox.checked;
	localStorage[Constants.applicationSettings.clickOnKeywords] = document.keywordSettings.clickOnKeywordsChekbox.checked;
}

/**
 * Saves the settings in the World Bank tab.
 */
function saveWorldBankTabSettings() {
	// save the list of selected locations
	localStorage[Constants.applicationSettings.listOfLocationCodes] = getListOfLocationCodes();
}

/**
 * Gets the header of the given tab.
 * 
 * @param tab
 * @returns
 */
function getTabHeader(tab) {
	var tabHeaderId = TAB_HEADER_PREFIX + tab.id.match(/\d+/);
	return document.getElementById(tabHeaderId);
}

/**
 * Shows the given tab and hides all the others.
 * 
 * @param tabHeader
 * @param tab
 */
function showTab(tab) {
	if (!$(tab).is(':visible')) {

		$(tab).show();
		$(getTabHeader(tab)).addClass('tabHeader-selected');

		var tabs = document.getElementsByClassName('tab');
		for ( var i = 0; i < tabs.length; i++) {
			if (tabs[i].id !== tab.id) {
				$(tabs[i]).hide();
				$(getTabHeader(tabs[i])).removeClass('tabHeader-selected');
			}
		}
	}
}

/**
 * Toggles the state of the given checkbox.
 */
function toggleCheckboxValue(checkbox) {
	var newValue = !checkbox.checked;
	checkbox.checked = newValue;
}

/**
 * Toggles the value of the "highlight" checkbox.
 */
function toggleHighlightCheckboxValue() {
	toggleCheckboxValue(document.keywordSettings.highlightChekbox);
	if (!document.keywordSettings.highlightChekbox.checked && document.keywordSettings.clickOnKeywordsChekbox.checked) {
		toggleCheckboxValue(document.keywordSettings.clickOnKeywordsChekbox);
	}
}

/**
 * Toggles the value of the "click on keywords" checkbox.
 */
function toggleClickOnKeywordsCheckboxValue() {
	toggleCheckboxValue(document.keywordSettings.clickOnKeywordsChekbox);
	if (!document.keywordSettings.highlightChekbox.checked && document.keywordSettings.clickOnKeywordsChekbox.checked) {
		toggleCheckboxValue(document.keywordSettings.highlightChekbox);
	}
}

/**
 * Sets the click handlers on the input elements in the page.
 */
function setClickHandlers() {
	document.getElementById('scanAll').onclick = function() {
		document.pageScanSettings.scanRadioButtons[0].checked = true;
	};
	document.getElementById('scanManually').onclick = function() {
		document.pageScanSettings.scanRadioButtons[1].checked = true;
	};
	document.getElementById('highlightChekboxContainer').onclick = function() {
		toggleHighlightCheckboxValue();
	};
	document.keywordSettings.highlightChekbox.onclick = function() {
		toggleHighlightCheckboxValue();
	};
	document.getElementById('clickOnKeywordsChekboxContainer').onclick = function() {
		toggleClickOnKeywordsCheckboxValue();
	};
	document.keywordSettings.clickOnKeywordsChekbox.onclick = function() {
		toggleClickOnKeywordsCheckboxValue();
	};
	document.getElementById('addCountryButton').onclick = function() {
		addLocationsListBox(null, LOCATION_TYPE.COUNTRY);
	};
	document.getElementById('addAggregateButton').onclick = function() {
		addLocationsListBox(null, LOCATION_TYPE.AGGREGATE);
	};
	document.getElementById('tabHeader1').onclick = function() {
		showTab(document.getElementById('tab1'));
	};
	document.getElementById('tabHeader2').onclick = function() {
		showTab(document.getElementById('tab2'));
	};
	document.getElementById('tabHeader3').onclick = function() {
		showTab(document.getElementById('tab3'));
	};

	var populateIndicatorTab = function(type) {
		var tabContent = document.getElementById('tab3-content');
		$(tabContent).empty();

		tabContent.appendChild(new CustomIndicatorSelector(type));
	}

	var currentIndicatorActionElement = null;
	var onIndicatorSelectionClick = function(selectedActionElement, type) {
		if (currentIndicatorActionElement === null || currentIndicatorActionElement !== selectedActionElement) {

			if (currentIndicatorActionElement !== null) {
				$(currentIndicatorActionElement).removeClass('customIndicatorSelector-actionSelectionButton-clicked');
			}
			$(selectedActionElement).addClass('customIndicatorSelector-actionSelectionButton-clicked');

			populateIndicatorTab(type);

			currentIndicatorActionElement = selectedActionElement;
		}
	}

	document.getElementById('addIndicator').onclick = function() {
		onIndicatorSelectionClick(this, CustomIndicatorSelector.Type.ADD);
	};
	document.getElementById('editIndicator').onclick = function() {
		onIndicatorSelectionClick(this, CustomIndicatorSelector.Type.EDIT);
	};
	document.getElementById('deleteIndicator').onclick = function() {
		onIndicatorSelectionClick(this, CustomIndicatorSelector.Type.DELETE);
	};
}

/**
 * Initialises the page scan settings.
 */
function initialisePageScanSettings() {
	var pageScanSettings = localStorage[Constants.applicationSettings.pageScan];
	if (pageScanSettings === undefined) {
		pageScanSettings = Constants.pageScanSettings.defaultSetting;
	}

	switch (pageScanSettings) {
	case Constants.pageScanSettings.scanAll:
		document.pageScanSettings.scanRadioButtons[0].checked = true;
		break;
	case Constants.pageScanSettings.scanManual:
		document.pageScanSettings.scanRadioButtons[1].checked = true;
		break;
	}
}

/**
 * Initialises the keywords highlight settings.
 */
function initialiseKeywordSettings() {
	document.keywordSettings.highlightChekbox.checked = (localStorage[Constants.applicationSettings.highlightKeywords] === 'true');
	document.keywordSettings.clickOnKeywordsChekbox.checked = (localStorage[Constants.applicationSettings.clickOnKeywords] === 'true');
}

/**
 * Initialises the list of pre-selected locations.
 */
function initialiseLocationsList() {
	if (localStorage[Constants.applicationSettings.listOfLocationCodes] !== undefined
			&& localStorage[Constants.applicationSettings.listOfLocationCodes].length !== 0) {
		var locationCodes = JSON.parse(localStorage[Constants.applicationSettings.listOfLocationCodes]);
		for ( var i = 0; i < locationCodes.length; i++) {
			addLocationsListBox(locationCodes[i].code, locationCodes[i].locationType);
		}
	}
}

/**
 * Called when the page is loaded.
 */
function onLoad() {
	var generalTabSaveButton = new ButtonWithFeedbackMessage(false, 'generalTabSaveButton', chrome.i18n.getMessage('options_page_save_button'),
			chrome.i18n.getMessage('options_page_saved_successfully'), function(button) {
				saveGeneralTabSettings();
				generalTabSaveButton.showFeedbackMessage();
			});

	document.getElementById('tab1').appendChild(generalTabSaveButton.asWidget());

	var worldBankTabSaveButton = new ButtonWithFeedbackMessage(false, 'worldBankTabSaveButton', chrome.i18n.getMessage('options_page_save_button'),
			chrome.i18n.getMessage('options_page_saved_successfully'), function(button) {
				saveWorldBankTabSettings();
				worldBankTabSaveButton.showFeedbackMessage();
			});

	document.getElementById('tab2').appendChild(worldBankTabSaveButton.asWidget());

	setLabels();
	setClickHandlers();
	initialisePageScanSettings();
	initialiseKeywordSettings();
	initialiseLocationsList();
}