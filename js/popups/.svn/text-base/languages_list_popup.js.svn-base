/**
 * Called on language click.
 * 
 * @param tabId
 * @param languageCode
 * @returns
 */
function onLanguageClick(tabId, languageCode) {
	backgroundPage.sendPageScanRequest(tabId, languageCode);
	// backgroundPage.setPageActionPopup(tabId);
	window.close();
}

/**
 * Shows the content of this popup.
 * 
 * @param tabId
 */
function showContent(tabId) {
	var MESSAGES_FILE_LANGUAGE_PREFIX = 'language_';
	
	// get indicator links related to the currently selected tab
	var linksContainer = document.getElementById('links');

	var ul = document.createElement('ul');

	for ( var i = 0; i < db_languages.length; i++) {
		var languageInFullText = chrome.i18n.getMessage(MESSAGES_FILE_LANGUAGE_PREFIX + db_languages[i]);

		// chrome.i18n.getMessage() returns an empty string if language not
		// found
		if (languageInFullText !== '') {
			if (Logger.canLog(Logger.LogLevel.INFO)) {
				Logger.log('Displaying language option: ' + db_languages[i], Logger.LogLevel.INFO);
			}
			var aTag = document.createElement('a');
			aTag.setAttribute('href', 'javascript:void 0;');
			aTag.setAttribute('title', languageInFullText);
			aTag.setAttribute('onclick', 'javascript:onLanguageClick(' + tabId + ',"' + db_languages[i] + '");');

			aTag.innerText = languageInFullText;

			var li = document.createElement('li');
			li.className += ' linkContainer';
			li.appendChild(aTag);
			ul.appendChild(li);
		} else {
			if (Logger.canLog(Logger.LogLevel.ERROR)) {
				Logger.log('Could not find full text in messages file for language code ' + db_languages[i], Logger.LogLevel.ERROR);
			}
		}
	}

	// add the UL to the links container
	linksContainer.appendChild(ul);
}

/**
 * Shows the popup.
 * 
 * @param tabId
 */
function showPopup(tabId) {
	var linksH3Title = document.getElementById('linksH3Title');
	linksH3Title.innerText = chrome.i18n.getMessage("popup_languages_list_title");
	linksH3Title.className += 'linksH3Title';
	document.getElementById('optionsLink').innerText = chrome.i18n.getMessage("popup_options_page_link");

	var LANGUAGE_CODES_JAVASCRIPT_FILE = 'db_languages.js';
	var LANGUAGE_CODES_JAVASCRIPT_FILEPATH_RELATIVE_TO_POPUP_HTML = '../js/db/';
	
	// import the array of language codes
	Util.importJavaScriptFile(LANGUAGE_CODES_JAVASCRIPT_FILEPATH_RELATIVE_TO_POPUP_HTML, LANGUAGE_CODES_JAVASCRIPT_FILE, function() {
		showContent(tabId);
	});
}