/**
 * Shows the popup.
 * 
 * @param tabId
 */
function showPopup(tabId) {
	// get indicator links related to the currently selected tab
	backgroundPage.getIndicatorLinks(tabId, function(indicatorLinksPerCategory) {

		var LINK_SELECTOR_WIDGET_FILE = 'link_selector_widget.js';
		var SHARED_JS_FILEPATH_RELATIVE_TO_POPUP_HTML = '../js/shared/';

		// import the link selector widget
		Util.importJavaScriptFile(SHARED_JS_FILEPATH_RELATIVE_TO_POPUP_HTML, LINK_SELECTOR_WIDGET_FILE, function() {

			document.getElementById('linksH2Title').innerText = chrome.i18n.getMessage("popup_indicators_title");
			document.getElementById('optionsLink').innerText = chrome.i18n.getMessage("popup_options_page_link");

			new LinkSelectorWidget(indicatorLinksPerCategory, document.getElementById('links'));

			// check if there is a vertical scrollbar
			checkIfVerticalScrollBar();
		});
	});
}