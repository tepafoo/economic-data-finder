var TEXT_NODE_TYPE = 3;
var POPUP_VIEWPORT_SCALE = 0.76;
var indicatorSelectorUrl = chrome.extension.getURL('html/indicator_selector.html');

/**
 * Notifies the given message.
 * 
 * @param message
 */
function notifyMessage(message) {
	var notificationDiv = document.createElement('div');
	notificationDiv.id = 'economicdata-notification';
	notificationDiv.className += ' economicdata-notification';
	notificationDiv.className += ' economicdata-notification-animationDefinition';
	notificationDiv.innerText = message;

	document.body.appendChild(notificationDiv);
	setTimeout('document.body.removeChild(document.getElementById(\'economicdata-notification\'));', 15000);
}

/**
 * Notifies the message contained in the given response that comes from the background page.
 * 
 * @param response
 */
function notifyMessageFromResponse(response) {
	if (response.notificationMessage) {
		notifyMessage(response.notificationMessage);
	}
}

/**
 * Sends a request to the background page to save the indicators linked to the given array of keywords.
 * 
 * @param keywords
 * @param languageCode
 *            code of the language those keywords are from
 */
function saveIndicatorsForKeywords(keywords, languageCode) {
	if (Logger.canLog(Logger.LogLevel.INFO)) {
		Logger.log('Sending list of found keywords to background page', Logger.LogLevel.INFO);
	}

	chrome.extension.sendRequest({
		action : Constants.messaging.actions.saveIndicatorsForKeywords,
		keywordsFound : keywords,
		languageCode : languageCode
	}, notifyMessageFromResponse);
}

/**
 * Sends a message to the background page to notify that no keywords were found.
 * 
 * @param languageCode
 */
function sendNoKeywordsFound(languageCode) {
	if (Logger.canLog(Logger.LogLevel.INFO)) {
		Logger.log('No keywords found on this page: notifying the background page', Logger.LogLevel.INFO);
	}

	chrome.extension.sendRequest({
		action : Constants.messaging.actions.notifyNoKeywordsFound,
		languageCode : languageCode
	}, notifyMessageFromResponse);
}

/**
 * Given URL parameters, creates a clickable keyword that links to the indicator selector widget.
 * 
 * @param keywordId
 * @param languageCode
 * @returns
 */
function clickableKeywordReplacement(keyword, keywordId, languageCode) {
	var clickableKeyword = [];
	clickableKeyword.push('<a href="');
	clickableKeyword.push(indicatorSelectorUrl);
	clickableKeyword.push('?');
	clickableKeyword.push(Constants.indicatorSelectorQueryParams.keywordId);
	clickableKeyword.push('=');
	clickableKeyword.push(keywordId);
	clickableKeyword.push('&');
	clickableKeyword.push(Constants.indicatorSelectorQueryParams.languageCode);
	clickableKeyword.push('=');
	clickableKeyword.push(languageCode);
	clickableKeyword.push('" class="economicdata-highlight economicdata-clickable">');
	clickableKeyword.push(keyword);
	clickableKeyword.push('</a>');

	return clickableKeyword.join('');
}

/**
 * Called when the list of keywords is received from the background page.<br/> Looks for those keywords in the current
 * page.
 * 
 * @param response
 */
function onKeywordsReceived(response) {
	if (Logger.canLog(Logger.LogLevel.INFO)) {
		Logger.log('Received keywords from background page', Logger.LogLevel.INFO);
	}

	var highlightKeywords = response.highlightKeywords === 'true';
	var clickOnKeywords = response.clickOnKeywords === 'true';

	// initialise array of keywords found in this page
	var foundInKeywords = [];

	var start = new Date().getTime();
	// loop through the keywords received from the background page and scan this page
	for ( var j = 0; j < response.keywordsForLanguage.length; j++) {
		var keyword = response.keywordsForLanguage[j];

		if (Logger.canLog(Logger.LogLevel.INFO)) {
			Logger.log('Looking for keyword: ' + keyword, Logger.LogLevel.INFO);
		}

		var result = null;
		if (clickOnKeywords) {
			result = Trouveur.replace(keyword, clickableKeywordReplacement(keyword, j, response.languageCode),
					document.body);
			result = result.length;
		} else {
			var trouveurOptions = {
				h : highlightKeywords
			};

			result = Trouveur.count(keyword, document.body, trouveurOptions);
		}

		// if found
		if (result > 0) {
			if (Logger.canLog(Logger.LogLevel.INFO)) {
				Logger.log('Found: ' + keyword, Logger.LogLevel.INFO);
			}
			// add to the list of found keywords
			foundInKeywords.push(j);
		}
	}
	var end = new Date().getTime();
	console.log('scan duration: ' + (end - start));

	// if there are keywords found
	if (foundInKeywords.length > 0) {
		// send the list to the background page
		saveIndicatorsForKeywords(foundInKeywords, response.languageCode);

		// get the relative path of fancybox images and add the related CSS classes dynamically
		includeFancyboxImagesWithRelativePaths();

		// if the click-on-keywords option is enabled, apply fancybox on the links inserted just now
		if (clickOnKeywords) {
			setTimeout(function() {

				// define the function that applies fancybox
				var applyFancybox = function() {
					$('a.economicdata-clickable').fancybox({
						'type' : 'iframe',
						'width' : getScaledPixelSize($(window).width(), POPUP_VIEWPORT_SCALE),
						'height' : getScaledPixelSize($(window).height(), POPUP_VIEWPORT_SCALE),
						'speedIn' : 150,
						'speedOut' : 150,
						'autoScale' : true,
						'padding' : 0,
						'margin' : 0,
						'centerOnScroll' : true,
						'showCloseButton' : true
					});
				};

				// apply fancybox on window resize so that the popup has correct relative dimensions
				$(window).resize(function() {
					applyFancybox();
				});

				// apply fancybox now
				applyFancybox();
			}, 300);
		}
	} else {
		sendNoKeywordsFound(response.languageCode);
	}
}

/**
 * Includes the images used by Fancybox with their paths relative to the extension URL.
 */
function includeFancyboxImagesWithRelativePaths() {
	var fanycboxPngUrl = chrome.extension.getURL('js/lib/fancybox/fancybox.png');
	var blankGifUrl = chrome.extension.getURL('js/lib/fancybox/blank.gif');
	var fanycboxXPngUrl = chrome.extension.getURL('js/lib/fancybox/fancybox-x.png');
	var fanycboxYPngUrl = chrome.extension.getURL('js/lib/fancybox/fancybox-y.png');
	var fanycTitleOverPngUrl = chrome.extension.getURL('js/lib/fancybox/fancy_title_over.png');

	var cssToAdd = [ '<style type="text/css">' ];

	cssToAdd
			.push('#fancybox-loading div, #fancybox-close, #fancybox-left-ico, #fancybox-right-ico, #fancybox-bg-ne, #fancybox-bg-se, #fancybox-bg-sw, #fancybox-bg-nw, #fancybox-title-float-left, #fancybox-title-float-right {background-image: url("');
	cssToAdd.push(fanycboxPngUrl);
	cssToAdd.push('");}');

	cssToAdd.push('#fancybox-left, #fancybox-right {background-image: url("');
	cssToAdd.push(blankGifUrl);
	cssToAdd.push('");}');

	cssToAdd.push('#fancybox-bg-n, #fancybox-bg-s, #fancybox-title-float-main {background-image: url("');
	cssToAdd.push(fanycboxXPngUrl);
	cssToAdd.push('");}');

	cssToAdd.push('#fancybox-bg-e, #fancybox-bg-w {background-image: url("');
	cssToAdd.push(fanycboxYPngUrl);
	cssToAdd.push('");}');

	cssToAdd.push('#fancybox-title-over {background-image: url("');
	cssToAdd.push(fanycTitleOverPngUrl);
	cssToAdd.push('");}');

	cssToAdd.push('</style>');

	$('head').append(cssToAdd.join(''));
}

/**
 * Entry point function.
 * 
 * @param languageCode
 *            language code to use to scan this page, as passed by the background process
 */
function run(languageCode) {
	if (document.readyState === 'complete') {
		// get the arrays of keywords and find them on the page
		chrome.extension.sendRequest({
			action : Constants.messaging.actions.getKeywords,
			languageCode : languageCode
		}, onKeywordsReceived);
	} else {
		setTimeout('run("' + languageCode + '");', 200);
	}
}

/**
 * NOTE: SAME AS IN util.js<br/> Gets a scaled pixel size given an original size and a scale to be applied onto it. The
 * scaled size is rounded to the nearest lower integer.
 * 
 * @param orignalSizePixel
 *            for example 100
 * @param scale
 *            for example 0.9 to have a scaled size that is 90% of the original size.
 * @returns
 */
function getScaledPixelSize(orignalSizePixel, scale) {
	return Math.floor(orignalSizePixel * scale);
}

// The code below will be run on page load
chrome.extension.onRequest.addListener(function(request, sender, response) {
	if (request.action === Constants.messaging.actions.scanPage) {
		run(request.languageCode);
	} else if (request.action === Constants.messaging.actions.showIndicator) {
		// create a hidden link with its href set to the indicator selection page
		var popupUrl = [];
		popupUrl.push(chrome.extension.getURL('html/indicator_selector.html'));
		popupUrl.push('?');
		popupUrl.push(Constants.indicatorSelectorQueryParams.indicatorLinkObject);
		popupUrl.push('=');
		popupUrl.push(request.linkObject);

		var hiddenLink = document.createElement('a');

		$(hiddenLink).hide().attr('href', popupUrl.join('')).fancybox({
			'type' : 'iframe',
			'width' : getScaledPixelSize($(window).width(), POPUP_VIEWPORT_SCALE),
			'height' : getScaledPixelSize($(window).height(), POPUP_VIEWPORT_SCALE),
			'speedIn' : 150,
			'speedOut' : 150,
			'autoScale' : true,
			'padding' : 0,
			'margin' : 0,
			'centerOnScroll' : true,
			'showCloseButton' : true
		}).click();
	}
});