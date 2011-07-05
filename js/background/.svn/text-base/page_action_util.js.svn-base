var tabIdToUrl = {};
var LAST_VISIT_TIME_EPSILON_MS = 500;

/**
 * Sets the page action popup for the tab with the given tabId and path.<br/>Called by either setPageActionPopup() or removePageActionPopup().
 * 
 * @param tabId
 * @param path
 */
function setPageActionPopupInternal(tabId, path) {
	var details = new Object();
	details.tabId = tabId;
	details.popup = path;
	chrome.pageAction.setPopup(details);
}

/**
 * Sets the page action popup for the tab with the given tabId.
 * 
 * @param tabId
 */
function setPageActionPopup(tabId) {
	setPageActionPopupInternal(tabId, 'html/popup.html');
}

/**
 * Removes the page action popup for the tab with the given tabId.
 * 
 * @param tabId
 */
function removePageActionPopup(tabId) {
	setPageActionPopupInternal(tabId, '');
}

/**
 * Sets the page action icon and title.
 * 
 * @param tabId
 * @param iconPath
 * @param iconTitle
 */
function setPageActionIconAndTitle(tabId, iconPath, iconTitle) {
	var iconDetails = new Object();
	iconDetails.tabId = tabId;
	iconDetails.path = iconPath;
	chrome.pageAction.setIcon(iconDetails);
	var titleDetails = new Object();
	titleDetails.tabId = tabId;
	titleDetails.title = iconTitle;
	chrome.pageAction.setTitle(titleDetails);
}

/**
 * Sets the page action icon when the language on page is not supported.
 * 
 * @param tabId
 */
function setPageActionIconWhenLanguageNotSupported(tabId) {
	setPageActionIconAndTitle(tabId, chrome.extension.getURL('images/page_action_icon_language_not_supported_19.png'), chrome.i18n
			.getMessage('page_action_language_not_supported_title'));

	chrome.pageAction.show(tabId);
}

/**
 * Sets the page action icon when keywords have been found on page.
 * 
 * @param tabId
 */
function setPageActionIconWhenNoKeywordsFound(tabId) {
	setPageActionIconAndTitle(tabId, chrome.extension.getURL('images/page_action_icon_not_found_19.png'), chrome.i18n
			.getMessage('page_action_no_indicators_found_title'));

	chrome.pageAction.show(tabId);
}

/**
 * Sets the page action icon when keywords have been found on page.
 * 
 * @param tabId
 */
function setPageActionIconWhenKeywordsFound(tabId) {
	setPageActionIconAndTitle(tabId, chrome.extension.getURL('images/page_action_icon_found_19.png'), chrome.i18n
			.getMessage('page_action_indicators_found_title'));
}

/**
 * Sets the page action icon for the 'page scan' action.
 * 
 * @param tabId
 */
function setPageActionIconScan(tabId) {
	// set page action icon and title
	setPageActionIconAndTitle(tabId, chrome.extension.getURL('images/page_action_icon_scan_19.png'), chrome.i18n
			.getMessage('page_action_manual_scan_title'));

	chrome.pageAction.show(tabId);
}

/**
 * Initialises the page action the detected language is not supported.
 * 
 * @param tabId
 */
function initialisePageActionWhenLanguageNotSupported(tabId) {
	// set the popup type for this tab to 'list of languages'
	tabIdPopupType[tabId] = Constants.popups.languagesList;

	// notify the user that this language is not supported via the page action
	// icon
	setPageActionIconWhenLanguageNotSupported(tabId);

	// set the page action popup
	setPageActionPopup(tabId);
}

/**
 * Initialises the page action the detected language is supported.
 * 
 * @param tabId
 */
function initialisePageActionWhenLanguageSupported(tabId) {
	// if automated scan send scan
	// request to the content script
	if (localStorage[Constants.applicationSettings.pageScan] === Constants.pageScanSettings.scanAll) {
		sendPageScanRequest(tabId, Constants.messaging.actions.detectedLanguage);
	}
	// if manual scan, set the correct icon path
	else {
		setPageActionIconScan(tabId);
	}
}

/**
 * Encapsulates logic to be run on tab update.
 * 
 * @param tab
 * @param manualReload
 */
function onTabUpdate(tab, manualReload) {
	if (manualReload || !tabIdToUrl.hasOwnProperty(tab.id) || tabIdToUrl[tab.id] !== tab.url) {
		// 1. update the URL saves for this tab
		tabIdToUrl[tab.id] = tab.url;

		// 2. remove the previous page action popup, as we might be on a tab that was already being used
		removePageActionPopup(tab.id);

		chrome.tabs.detectLanguage(tab.id, function(languageCode) {
			// if language supported...
			if (keywords[languageCode]) {
				initialisePageActionWhenLanguageSupported(tab.id);

				if (Logger.canLog(Logger.LogLevel.INFO)) {
					Logger.log('Language supported: ' + languageCode, Logger.LogLevel.INFO);
				}
			}
			// ...otherwise
			else {
				initialisePageActionWhenLanguageNotSupported(tab.id);

				if (Logger.canLog(Logger.LogLevel.WARNING)) {
					Logger.log('Language not supported: ' + languageCode, Logger.LogLevel.WARNING);
				}
			}
		});
	}
}

/**
 * Initialises the page actions.
 */
function initialisePageAction() {
	// add listener on tab update
	chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, tab) {
		if (changeInfo.status === 'complete') {
			chrome.history.getVisits({
				url : tab.url
			}, function(visits) {
				var manualReload = false;

				if (visits.length === 0) {
					manualReload = true;
				} else {
					var lastVisit = visits[visits.length - 1];
					if (lastVisit.transition === 'reload') {
						// set the manual reload flag to true if the last visit to the current page is now (more or less epsilon)
						var timeOffset = new Date().getTime() - Math.floor(lastVisit.visitTime);
						if (timeOffset < LAST_VISIT_TIME_EPSILON_MS) {
							manualReload = true;
						}
					}
				}

				onTabUpdate(tab, manualReload);
			});
		}
	});

	// add listener on tab remove
	chrome.tabs.onRemoved.addListener(function(tabId) {
		if (tabIdToUrl[tabId]) {
			delete tabIdToUrl[tabId];

			if (Logger.canLog(Logger.LogLevel.INFO)) {
				Logger.log('Removed URL for the tab: ' + tabId, Logger.LogLevel.INFO);
			}
		}
	});

	// add listener on page action icon click
	chrome.pageAction.onClicked.addListener(function(tab) {
		// if manual scan: send message to content script to start scan
		if (localStorage[Constants.applicationSettings.pageScan] === Constants.pageScanSettings.scanManual) {
			sendPageScanRequest(tab.id, Constants.messaging.actions.detectedLanguage);
		}
	});
}