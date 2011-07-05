// reference to the background page
var POPUP_MAX_HEIGHT_PX = 600;
var backgroundPage = chrome.extension.getBackgroundPage();
var POPUPS_JAVASCRIPT_FILEPATH_RELATIVE_TO_POPUP_HTML_FILE = '../js/popups/';

/**
 * Opens the given URL in a new tab.
 * 
 * @param stringifiedLinkObject
 *            {url, source, text}
 */
function openUrl(stringifiedLinkObject) {
	chrome.tabs.getSelected(null, function(tab) {
		chrome.tabs.sendRequest(tab.id, {
			action : Constants.messaging.actions.showIndicator,
			linkObject : stringifiedLinkObject
		});

		self.close();
	});
}

/**
 * Checks if there is a vertical scrollbar and updates the body element accordingly.
 */
function checkIfVerticalScrollBar() {
	if (document.body.scrollHeight > POPUP_MAX_HEIGHT_PX) {
		document.body.className += ' withVerticalScrollbar';
	}
}

/**
 * Shows the options page.
 */
function showOptionsPage() {
	chrome.tabs.create({
		url : chrome.extension.getURL("html/options.html")
	});
}

/**
 * Called on page load.
 */
function onLoad() {
	// get the currently selected tab and populate the popup accordingly
	chrome.tabs.getSelected(null, function(tab) {

		var fileToImport;
		switch (backgroundPage.tabIdPopupType[tab.id]) {
		case Constants.popups.indicators:
			fileToImport = 'indicators_popup.js';
			break;
		case Constants.popups.languagesList:
			fileToImport = 'languages_list_popup.js';
			break;
		default:
			if (Logger.canLog(Logger.LogLevel.ERROR)) {
				Logger.log('Unknow popup type: ' + backgroundPage.tabIdPopupType[tab.id], Logger.LogLevel.ERROR);
			}
			break;
		}

		if (fileToImport !== undefined) {
			// the imported javascript file is expected to
			// implement showPopup()
			Util.importJavaScriptFile(POPUPS_JAVASCRIPT_FILEPATH_RELATIVE_TO_POPUP_HTML_FILE, fileToImport, function() {
				showPopup(tab.id)
			});
		}
	});

	// add click handler to the link to the options page
	document.getElementById('optionsLink').onclick = function() {
		showOptionsPage();
	};
}