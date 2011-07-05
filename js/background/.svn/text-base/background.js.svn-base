var keywords = {};
var tabIdToIndicatorIds = {};
var tabIdPopupType = {};

/**
 * Sends the array of keywords in the given language code to the content script using the given callback function.
 * 
 * @param languageCode
 * @param callback
 */
function sendKeywordsForLanguageCode(languageCode, callback) {
	// send keywords, if applicable
	if (keywords[languageCode]) {
		if (Logger.canLog(Logger.LogLevel.INFO)) {
			Logger.log('Sending keywords to content script for language: ' + languageCode, Logger.LogLevel.INFO);
		}

		callback({
			keywordsForLanguage : keywords[languageCode],
			languageCode : languageCode,
			highlightKeywords : localStorage[Constants.applicationSettings.highlightKeywords],
			clickOnKeywords : localStorage[Constants.applicationSettings.clickOnKeywords]
		});
	}
}

/**
 * Sends the array of keywords in the given language code to the content script using the given callback function.<br/>If the language code is of
 * type Constants.messaging.actions.detectedLanguage, calls Goolge's language detection API first.
 * 
 * @param callback
 * @param languageCode
 * @param callback
 */
function sendKeywords(tabId, languageCode, callback) {

	// if detected language...
	if (languageCode === Constants.messaging.actions.detectedLanguage) {
		chrome.tabs.detectLanguage(tabId, function(languageCode) {
			// 'und' is returned for unknown languages, see http://code.google.com/chrome/extensions/tabs.html
			if (languageCode !== 'und') {
				sendKeywordsForLanguageCode(languageCode, callback);
			}
		});
	}
	// ...otherwise
	else {
		sendKeywordsForLanguageCode(languageCode, callback);
	}
}

/**
 * Saves the indicators ids linked to the given list of keywords.
 * 
 * @param languageCode
 * @param keywordIds
 * @param callback
 */
function saveIndicatorIds(languageCode, keywordIds, callback) {
	if (Logger.canLog(Logger.LogLevel.INFO)) {
		Logger.log('Retrieving indicator ids for keywords in language: ' + languageCode, Logger.LogLevel.INFO);
	}

	DataLoader.getIndicatorIds(languageCode, keywordIds, function(indicatorIds) {
		callback(indicatorIds);
	});
}

/**
 * Gets the keywords from the database.
 */
function getKeywords() {
	if (Logger.canLog(Logger.LogLevel.INFO)) {
		Logger.log('Getting language keywords from database.', Logger.LogLevel.INFO);
	}
	for ( var i = 0; i < db_languages.length; i++) {
		DataLoader.load(db_languages[i], function(result) {
			keywords[result.languageCode] = result.keywords;
		});
	}
}

/**
 * Gets the indicator links for the currently opened tab having the given id.
 * 
 * @param tabId
 * @param callback
 */
function getIndicatorLinks(tabId, callback) {
	if (tabIdToIndicatorIds[tabId]) {
		DataLoader.getIndicatorLinksPerCategory(tabIdToIndicatorIds[tabId][0], tabIdToIndicatorIds[tabId][1], callback);
	}
}

/**
 * Sets the default settings for this extension if applicable.
 */
function setDefaultSettings() {
	if (localStorage[Constants.applicationSettings.pageScan] === undefined) {
		localStorage.setItem(Constants.applicationSettings.pageScan, Constants.pageScanSettings.defaultSetting);
	}
	if (localStorage[Constants.applicationSettings.highlightKeywords] === undefined) {
		localStorage.setItem(Constants.applicationSettings.highlightKeywords, Constants.highlightSettings.defaultSetting);
	}
	if (localStorage[Constants.applicationSettings.clickOnKeywords] === undefined) {
		localStorage.setItem(Constants.applicationSettings.clickOnKeywords, Constants.clickOnKeywordsSettings.defaultSetting);
	}
	if (localStorage[Constants.applicationSettings.listOfLocationCodes] === undefined) {
		localStorage.setItem(Constants.applicationSettings.listOfLocationCodes, Constants.listOfLocationCodesSettings.defaultList);
	}
}

/**
 * Sends a page scan request to the tab with the given tabId.
 * 
 * @param tabId
 * @param languageCode
 */
function sendPageScanRequest(tabId, languageCode) {
	if (Logger.canLog(Logger.LogLevel.INFO)) {
		Logger.log('Sending scan request to tab: ' + tabId, Logger.LogLevel.INFO);
	}

	chrome.tabs.sendRequest(tabId, {
		action : Constants.messaging.actions.scanPage,
		languageCode : languageCode
	});
}

/**
 * Loads the extension
 */
function loadExtension() {
	// 1. add a message passing listener
	chrome.extension.onRequest.addListener(function(request, sender, response) {
		// if requested action is to get keywords
		if (request.action === Constants.messaging.actions.getKeywords) {
			sendKeywords(sender.tab.id, request.languageCode, response);
		}
		// if requested action is to save indicators
		else if (request.action === Constants.messaging.actions.saveIndicatorsForKeywords) {
			saveIndicatorIds(request.languageCode, request.keywordsFound, function(indicatorIds) {
				// if there are indicators linked to the keywords, save them
				var size = Util.sizeOfMap(indicatorIds);
				if (size > 0) {
					// save the indicators
					tabIdToIndicatorIds[sender.tab.id] = [ request.languageCode, indicatorIds ];

					// log
					if (Logger.canLog(Logger.LogLevel.INFO)) {
						Logger.log('Saved list of indicator ids for the tab: ' + sender.tab.id, Logger.LogLevel.INFO);
					}

					// update the page action icon and title
					setPageActionIconWhenKeywordsFound(sender.tab.id);

					// show the page action icon
					chrome.pageAction.show(sender.tab.id);

					// set the popup type for this tab to 'indicators'
					tabIdPopupType[sender.tab.id] = Constants.popups.indicators;

					// set the page action popup
					setPageActionPopup(sender.tab.id);

					// send back a response to the content script
					var notificationMessage;
					if (size === 1) {
						notificationMessage = chrome.i18n.getMessage('keywords_found_notification_singular');
					} else {
						notificationMessage = chrome.i18n.getMessage('keywords_found_notification_plural', [ size + '' ]);
					}
					response({
						notificationMessage : notificationMessage
					});
				}
			});
		} else if (request.action === Constants.messaging.actions.getIindicatorsForKeyword) {
			DataLoader.getIndicatorIds(request.languageCode, [ request.keywordId ], function(indicatorIds) {
				DataLoader.getIndicatorLinksPerCategory(request.languageCode, indicatorIds, function(indicatorLinksPerCategory) {
					// send back a response to the content script which contains a list of the indicators linked to the given keywords, per category
					response({
						indicatorLinksPerCategory : indicatorLinksPerCategory
					});
				});
			});

		} else if (request.action === Constants.messaging.actions.notifyNoKeywordsFound) {
			// update the page action icon and title
			setPageActionIconWhenNoKeywordsFound(sender.tab.id);

			// send back a response to the content script which contains a 'not found' message
			response({
				notificationMessage : chrome.i18n.getMessage('no_keywords_found_notification')
			});

			if (Logger.canLog(Logger.LogLevel.INFO)) {
				Logger.log('No keywords found on tab ' + sender.tab.id + ' using language ' + request.languageCode, Logger.LogLevel.INFO);
			}
		} else if (Logger.canLog(Logger.LogLevel.ERROR)) {
			Logger.log('Request action not recognised: ' + request.action, Logger.LogLevel.ERROR);
		}
	});

	// 2. add a tab removal listener
	chrome.tabs.onRemoved.addListener(function(tabId) {
		if (tabIdToIndicatorIds[tabId]) {
			delete tabIdToIndicatorIds[tabId];

			if (Logger.canLog(Logger.LogLevel.INFO)) {
				Logger.log('Removed list of indicator ids for the tab: ' + tabId);
			}
		}

		if (tabIdPopupType[tabId]) {
			delete tabIdPopupType[tabId];

			if (Logger.canLog(Logger.LogLevel.INFO)) {
				Logger.log('Removed popup type for the tab: ' + tabId, Logger.LogLevel.INFO);
			}
		}
	});

	// 3. prepare the database
	DBLayer.prepareDatabase(getKeywords);

	// 4. set default extension settings
	setDefaultSettings();

	// 5. initialise the page action icon
	initialisePageAction();
}