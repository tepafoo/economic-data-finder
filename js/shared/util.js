/**
 * Constructor.
 */
function Util() {
}

/**
 * Returns the size of the given map.
 * 
 * @param map
 * @returns {Number}
 */
Util.sizeOfMap = function(map) {
	var size = 0;
	for ( var key in map) {
		if (map.hasOwnProperty(key)) {
			size++;
		}
	}
	return size;
}

/**
 * Imports the given JavaScript file.
 * 
 * @param filepath
 * @param filename
 * @param callback
 */
Util.importJavaScriptFile = function(filepath, filename, callback) {
	var script = document.createElement('script');
	script.type = 'text/javascript';
	script.src = filepath + filename;
	if (typeof callback === 'function') {
		script.onload = script.onreadystatechange = callback;
	}
	var s = document.getElementsByTagName('script')[0];
	s.parentNode.insertBefore(script, s);
}

/**
 * Gets a trimmed version of the given locale, if applicable.<br/>For example, returns 'en' if the entered locale is 'en_GB'.
 * 
 * @param locale
 * @returns
 */
Util.getTrimmedLocale = function(locale) {
	// trim the current locale string if necessary
	var underscoreIndex = locale.indexOf('_');
	if (underscoreIndex !== -1) {
		locale = locale.substring(0, underscoreIndex);
	}

	return locale;
}

Util.currentLocale = Util.getTrimmedLocale(chrome.i18n.getMessage('@@ui_locale'));

/**
 * Copies the given object.
 * 
 * @param objectToCopy
 * @param deep
 *            if <code>true</code>, performs a deep copy
 * @returns
 */
Util.copyObject = function(objectToCopy, deep) {
	if (deep) {
		// deep copy
		return jQuery.extend(true, {}, objectToCopy);
	} else {
		// shallow copy
		return jQuery.extend({}, objectToCopy);
	}
}

/**
 * Copies the given array.
 * 
 * @param arrayToCopy
 * @param deep
 *            if <code>true</code>, performs a deep copy
 * @returns
 */
Util.copyArray = function(arrayToCopy, deep) {
	if (deep) {
		// deep copy
		return jQuery.extend(true, [], arrayToCopy);
	} else {
		// shallow copy
		return jQuery.extend([], arrayToCopy);
	}
}

/**
 * Returns <code>true</code> if the given object is in the given array.
 * 
 * @param object
 * @param array
 * @returns {Boolean}
 */
Util.isInArray = function(object, array) {
	return $.inArray(object, array) !== -1;
}

/**
 * If the given property is not an "own property" of the given object, this initialises the object with the property given its initial value.
 * 
 * @param object
 * @param property
 * @param initialPropertyValue
 */
Util.initialiseIfNotOwnProperty = function(object, property, initialPropertyValue) {
	if (!object.hasOwnProperty(property)) {
		object[property] = initialPropertyValue;
	}
}

/**
 * Gets a scaled pixel size given an original size and a scale to be applied onto it. The scaled size is rounded to the nearest lower integer.
 * 
 * @param orignalSizePixel
 *            for example 100
 * @param scale
 *            for example 0.9 to have a scaled size that is 90% of the original size.
 * @returns
 */
Util.getScaledPixelSize = function(orignalSizePixel, scale) {
	return Math.floor(orignalSizePixel * scale);
}