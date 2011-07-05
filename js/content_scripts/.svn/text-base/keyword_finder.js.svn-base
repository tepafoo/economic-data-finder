var TEXT_NODE_TYPE = 3;
var POPUP_VIEWPORT_SCALE = 0.76;

/**
 * Returns a formatted version of the given text prior to XPath querying.
 * 
 * @param text
 * @returns
 */
function formatForXpath(text) {
	return text.replace('\'', '&apos;');
}

/**
 * Returns the given text with all words capitalized.
 * 
 * @param text
 * @returns
 */
function capitalizeAllWords(text) {
	return text.replace(/\b./g, function(a) {
		return a.toUpperCase();
	});
}

/**
 * Returns the given text with the first word capitalized.
 * 
 * @param text
 * @returns
 */
function capitalizeFirstWord(text) {
	return text.substr(0, 1).toUpperCase() + text.slice(1);
}

/**
 * Returns an XPath query given a keyword.
 * 
 * @param keyword
 * @returns {String}
 */
function constructXpathQuery(keyword) {
	var formattedKeyword = formatForXpath(keyword);

	return '//*[(not(self::script or self::style or self::head or self::meta or self::title or self::link or self::select or self::option or self::optgroup or self::object or self::param or self::noscript or self::noframes or self::map or self::area or self::input or self::img or self::button or self::comment)) and text()[contains(.,"' + formattedKeyword + '") or contains(.,"'
			+ capitalizeFirstWord(formattedKeyword) + '") or contains(.,"'
			+ capitalizeAllWords(formattedKeyword) + '")]]';
}

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
 * Pre-processes the given String for XRegExp matching.<br/> Needed when \\{P} is used as a Unicode replacement for \\b.<br/> This is because \\{P}
 * does not match beginning and end of line while \\b does.
 * 
 * @param text
 * @returns {String}
 */
function preProcessForXRegExp(text) {
	return ' ' + text + ' ';
}

/**
 * Checks if the given keyword exists as a whole word in the given node-set.
 * 
 * @param keyword
 * @param nodesSnapshot
 * @param regularExpression
 *            regular expression to use for whole-word check
 * @returns {Boolean} <code>true</code> if the given keyword exists in the given node-set.<code>false</code> otherwise
 */
function isWholeWord(keyword, nodesSnapshot, regularExpression) {
	// check if the keyword has a space. If so, it means that it contains
	// multiple words so no need to carry on
	if (keyword.indexOf(' ') > 0) {
		return true;
	}

	for ( var i = 0; i < nodesSnapshot.snapshotLength; i++) {
		var node = nodesSnapshot.snapshotItem(i);

		for ( var j = 0; j < node.childNodes.length; j++) {
			var childNode = node.childNodes[j];

			if (childNode.nodeType === TEXT_NODE_TYPE && regularExpression.test(preProcessForXRegExp(childNode.data))) {
				return true;
			}
		}
	}

	return false;
}

/**
 * Given URL parameters, creates a clickable keyword that links to the indicator selector widget.
 * 
 * @param keywordId
 * @param languageCode
 * @returns
 */
function createClickableKeyword(keywordId, languageCode) {
	var clickableKeyword = [];
	clickableKeyword.push('$1<a href="');
	clickableKeyword.push(chrome.extension.getURL('html/indicator_selector.html'));
	clickableKeyword.push('?');
	clickableKeyword.push(Constants.indicatorSelectorQueryParams.keywordId);
	clickableKeyword.push('=');
	clickableKeyword.push(keywordId);
	clickableKeyword.push('&');
	clickableKeyword.push(Constants.indicatorSelectorQueryParams.languageCode);
	clickableKeyword.push('=');
	clickableKeyword.push(languageCode);
	clickableKeyword.push('" class="economicdata-highlight economicdata-clickable">$2</a>$3');
	
	return clickableKeyword.join('');
}

/**
 * Highlights all the occurrences of <code>keyword</code> found in the <code>nodesSnapshot</code>.<br/>Called by onKeywordsReceived().
 * 
 * @param keywordId
 * @param languageCode
 * @param highlightKeywords
 * @param clickOnKeywords
 * @param nodesSnapshot
 * @param regularExpression
 */
function processKeywords(keywordId, languageCode, highlightKeywords, clickOnKeywords, nodesSnapshot, regularExpression) {
	var highlightReplacement = '$1<span class="economicdata-highlight">$2</span>$3';

	for ( var i = 0; i < nodesSnapshot.snapshotLength; i++) {
		var node = nodesSnapshot.snapshotItem(i);

		if (clickOnKeywords) {			
			node.innerHTML = preProcessForXRegExp(node.innerHTML).replace(regularExpression, createClickableKeyword(keywordId, languageCode));
		} else if (highlightKeywords) {
			node.innerHTML = preProcessForXRegExp(node.innerHTML).replace(regularExpression, highlightReplacement);
		}
	}
}

/**
 * Called when the list of keywords is received from the background page.<br/> Looks for those keywords in the current page.
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

	// loop through the keywords received from the background page and scan this page
	for ( var j = 0; j < response.keywordsForLanguage.length; j++) {
		var keyword = response.keywordsForLanguage[j];

		if (Logger.canLog(Logger.LogLevel.INFO)) {
			Logger.log('Looking for keyword: ' + keyword, Logger.LogLevel.INFO);
		}
		// uses XPath to find keywords in the page: fast and reliable
		var xpathQuery = constructXpathQuery(keyword);
		var nodesSnapshot = document.evaluate(xpathQuery, document, null,
				XPathResult.UNORDERED_NODE_SNAPSHOT_TYPE, null);
		
		// if found
		if (nodesSnapshot.snapshotLength > 0) {
			// regular expression to make sure we're matching the whole keyword
			// this is initialised here so that it can be used in both whole-word detection and keyword highlighting
			// \\P{L} means any character that is not a Unicode letter, see http://www.regular-expressions.info/unicode.html
			var regularExpression = new XRegExp('(\\P{L})(' + keyword + ')(\\P{L})','gi');

			 if (isWholeWord(keyword, nodesSnapshot, regularExpression)) {
				 if (Logger.canLog(Logger.LogLevel.INFO)) {
					 Logger.log('Found: ' + keyword, Logger.LogLevel.INFO);
				 }
				 // add to the list of found keywords
				 foundInKeywords.push(j);

				 // if applicable, highlight or make clickable
				 if (highlightKeywords || clickOnKeywords) {
					 processKeywords(j, response.languageCode, highlightKeywords, clickOnKeywords, nodesSnapshot, regularExpression);
				 }
			 }
		}
	}

	// if there are keywords found
	if (foundInKeywords.length > 0) {
		// send the list to the background page
		saveIndicatorsForKeywords(foundInKeywords, response.languageCode);

		// get the relative path of fancybox images and add the related CSS classes dynamically
		includeFancyboxImagesWithRelativePaths();

		// if the click-on-keywords option is enabled, apply fancybox on the links inserted just now
		if (clickOnKeywords){
			setTimeout(function(){
				
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
	
	var cssToAdd = ['<style type="text/css">'];
	
	cssToAdd.push('#fancybox-loading div, #fancybox-close, #fancybox-left-ico, #fancybox-right-ico, #fancybox-bg-ne, #fancybox-bg-se, #fancybox-bg-sw, #fancybox-bg-nw, #fancybox-title-float-left, #fancybox-title-float-right {background-image: url("');
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
			languageCode: languageCode
		}, onKeywordsReceived);
	} else {
		setTimeout('run("'+ languageCode +'");', 200);
	}
}

/**
 * NOTE: SAME AS IN util.js<br/> Gets a scaled pixel size given an original size and a scale to be applied onto it. The scaled size is rounded to the
 * nearest lower integer.
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