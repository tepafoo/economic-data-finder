/**
 * Constructor.
 */
function DataLoader() {
}

var INVALID_ID = -1;

/**
 * Loads keywords for the specified language code.
 * 
 * @param languageCode
 * @param callback
 *            function used to process the array of keywords
 */
DataLoader.load = function(languageCode, callback) {
	function db_callback(r) {
		var keywords = [];
		for ( var i = 0; i < r.rows.length; i++) {
			keywords.push(r.rows.item(i).keyword);
		}
		callback({
			languageCode : languageCode,
			keywords : keywords
		});
	}

	DBLayer.executeBatch([ 'SELECT * from ' + languageCode + '_keyword_tbl' ], db_callback);
}

/**
 * Gets the indicator categories.
 * 
 * @param callback
 */
DataLoader.getIndicatorCategories = function(callback) {

	// check if the current locale is part of the languages supported in the database. If not, fall back to the default locale as defined in the
	// manifest file
	if (db_languages.indexOf(Util.currentLocale) === -1) {
		Util.currentLocale = chrome.manifest.default_locale;
	}

	DBLayer.executeBatch([ 'SELECT t1.category_id, t1.category_name FROM ' + Util.currentLocale
			+ '_category_name_tbl t1 ORDER BY t1.category_name ASC' ], function(r) {

		// loop through the query results
		var categories = [];
		for ( var i = 0; i < r.rows.length; i++) {

			var rowItem = r.rows.item(i);

			var category = new Object();
			category.name = rowItem.category_name;
			category.id = rowItem.category_id;

			categories.push(category);
		}

		if (Logger.canLog(Logger.LogLevel.INFO)) {
			Logger.log('Successfully fetched ' + r.rows.length + ' categories ', Logger.LogLevel.INFO);
		}

		callback(categories);
	});
}

/**
 * Gets links to indicators alongside with their names from the database for the given language code.
 * 
 * @param languageCode
 * @param indicatorIds
 * @param callback
 */
DataLoader.getIndicatorLinksPerCategory = function(languageCode, indicatorIds, callback) {

	// 1. construct a query to get the indicators
	// corresponding to the ids in the set
	var query = 'SELECT t1.indicator, t1.url, t2.indicator_name, t4.category_name ' + 'FROM indicator_tbl t1 INNER JOIN ' + languageCode
			+ '_indicator_name_tbl t2 ON t1.id = t2.indicator_id ' + 'INNER JOIN indicator_to_category_tbl t3 ON t1.id = t3.indicator_id '
			+ 'INNER JOIN ' + languageCode + '_category_name_tbl t4 ON t3.category_id = t4.id ' + 'WHERE t1.id IN ';
	var inCondition = '(';
	for (id in indicatorIds) {
		inCondition += ',' + id;
	}
	inCondition = inCondition.replace(',', '');
	inCondition += ') ';
	query += inCondition;
	query += 'ORDER BY t4.id ASC';

	// 2. execute the query
	DBLayer.executeBatch([ query ], function(r) {
		// some initialisation

		// get the list of pre-selected location codes in World Bank URL format.
		var formattedLocationCodesList = (function() {
			// parse the list of location codes from the local storage
			var locationCodesList = JSON.parse(localStorage[Constants.applicationSettings.listOfLocationCodes]);

			var result = '';
			for ( var i = 0; i < locationCodesList.length; i++) {
				if (i > 0) {
					result += Constants.listOfLocationCodesSettings.worldBankUrlLocationCodesSeparator;
				}
				result += locationCodesList[i].code;
			}

			return result;
		})();

		// loop through the query results and construct the actual links
		var indicatorLinksPerCategory = {};
		for ( var i = 0; i < r.rows.length; i++) {

			var rowItem = r.rows.item(i);

			// if the indicator's URL is the world bank, use the URL pattern defined in the messages file, with a list of locations if applicable.
			if (rowItem.url === Constants.sourceWorldBank) {
				var url = chrome.i18n.getMessage('world_bank_indicator_url', [ rowItem.indicator, formattedLocationCodesList ]);
				var source = Constants.sourceWorldBank;
			}
			// otherwise, use the URL field as the actual link
			else {
				var url = rowItem.url;
				var source = '';
			}

			// initialise the array of indicator links per category if needed
			if (!indicatorLinksPerCategory[rowItem.category_name]) {
				indicatorLinksPerCategory[rowItem.category_name] = [];
			}

			// update the array of indicator links per category
			indicatorLinksPerCategory[rowItem.category_name].push({
				source : source,
				url : url,
				text : rowItem.indicator_name,
				indicator : rowItem.indicator
			});
		}

		if (Logger.canLog(Logger.LogLevel.INFO)) {
			Logger.log('Successfully fetched ' + i + ' indicators ', Logger.LogLevel.INFO);
		}

		callback(indicatorLinksPerCategory);
	});
}

/**
 * Gets indicator ids from the database for the given list of keywords in the given language.
 * 
 * @param languageCode
 * @param keywordIds
 * @param callback
 */
DataLoader.getIndicatorIds = function(languageCode, keywordIds, callback) {
	// 1. construct a query to get the indicator ids from the keywords ids
	var query = 'SELECT DISTINCT indicator_id FROM ' + languageCode + '_keyword_to_indicator_tbl WHERE keyword_id IN ';
	var inCondition = '(';
	for ( var i = 0; i < keywordIds.length; i++) {
		// 'parseInt(keywordIds[i], 10) + 1' : the database table starts at index 1 while the JS array starts at 0
		inCondition += ',' + (parseInt(keywordIds[i], 10) + 1);
	}
	// remove the first comma
	inCondition = inCondition.replace(',', '');
	inCondition += ')';
	query += inCondition;

	// 2. execute the query
	DBLayer.executeBatch([ query ], function(r) {
		var indicatorIds = {};
		if (Logger.canLog(Logger.LogLevel.INFO)) {
			Logger.log('Successfully fetched indicators linked to given keywords.', Logger.LogLevel.INFO);
		}

		// 1. construct the query to get indicator ids linked to the ones found previously
		var query = 'SELECT DISTINCT to_indicator_id FROM indicator_to_indicator_tbl WHERE from_indicator_id IN ';
		var inCondition = '(';
		for ( var i = 0; i < r.rows.length; i++) {
			indicatorIds[r.rows.item(i).indicator_id] = true;
			inCondition += ',' + r.rows.item(i).indicator_id;
		}
		inCondition = inCondition.replace(',', '');
		inCondition += ')';
		query += inCondition;

		// 2. execute the query
		DBLayer.executeBatch([ query ], function(r) {
			if (Logger.canLog(Logger.LogLevel.INFO)) {
				Logger.log('Successfully fetched indicators linked to given indicators.', Logger.LogLevel.INFO);
			}
			// 1. add the indicator ids fetched from previous query to the given set
			for ( var i = 0; i < r.rows.length; i++) {
				if (!indicatorIds[r.rows.item(i).to_indicator_id]) {
					indicatorIds[r.rows.item(i).to_indicator_id] = true;
				}
			}

			// 2. run the callback
			callback(indicatorIds);
		});
	});
}

/**
 * Saves an indicator.
 * 
 * @param indicator
 */
DataLoader.saveIndicator = function(indicator) {

	// insert the indicator into the database
	var query = 'INSERT INTO indicator_tbl (indicator, url, custom) VALUES ("custom_' + indicator.indicatorName + '","' + indicator.url + '",1)';

	DBLayer.executeBatch([ query ], function(r) {
		// get the id of the newly inserted indicator
		var indicatorId = r.insertId;

		// 1. insert indicator names
		var queries = [];
		for ( var i = 0; i < db_languages.length; i++) {
			queries.push('INSERT INTO ' + db_languages[i] + '_indicator_name_tbl (indicator_id, indicator_name) VALUES (' + indicatorId + ', "'
					+ indicator.indicatorName + '")');

		}

		// 2. insert an 'indicator to category' url
		queries.push('INSERT INTO indicator_to_category_tbl (indicator_id, category_id) VALUES (' + indicatorId + ', ' + indicator.categoryId + ')');

		DBLayer.executeBatch(queries);

		// 3. insert keywords and keyword to indicator URLs
		var saveIndicatorKeywords = function(indicatorId, keywords) {
			for ( var keyword in keywords) {
				DataLoader.saveKeywordToIndicatorIdLinkForLanguages(keywords[keyword].languages, indicatorId, keyword, function() {
					if (Logger.canLog(Logger.LogLevel.INFO)) {
						Logger.log('Successfully saved indicator ' + indicator, Logger.LogLevel.INFO);
					}
				});
			}
		};
		saveIndicatorKeywords(indicatorId, indicator.keywords);
	});
}

/**
 * Gets the keyword id for the given keyword in the given languageCode keyword table.
 * 
 * @param keyword
 * @param languageCode
 * @param callback
 *            calls the callback with ether the keyword id or INVALID_ID
 */
DataLoader.getKeywordId = function(keyword, languageCode, callback) {
	DBLayer.executeBatch([ 'SELECT id FROM ' + languageCode + '_keyword_tbl WHERE keyword = "' + keyword + '" LIMIT 1' ], function(r) {
		var messagePrefix = '';
		var messageSuffix = ' for keyword ' + keyword + ' and language ' + languageCode;
		if (r.rows.length > 0) {
			var id = r.rows.item(0).id;
			callback(id);
			messagePrefix = 'Found id ' + id;
		} else {
			messagePrefix = 'No id found';
			callback(INVALID_ID);
		}

		if (Logger.canLog(Logger.LogLevel.INFO)) {
			Logger.log(messagePrefix + messageSuffix, Logger.LogLevel.INFO);
		}
	});
}

/**
 * Saves a keyword-to-indicator link for the given language. First inserts the keyword in the given language's keyword table is needed.
 * 
 * @param languageCode
 * @param indicatorId
 * @param keyword
 * @param callback
 *            optional callback function
 */
DataLoader.saveKeywordToIndicatorIdLink = function(languageCode, indicatorId, keyword, callback) {

	var onInsertion = function() {
		if (typeof callback === 'function') {
			if (Logger.canLog(Logger.LogLevel.INFO)) {
				Logger.log('Successfully saved keyword-to-indicator link for keyword ' + keyword + ' and indicator id' + indicatorId,
						Logger.LogLevel.INFO);
			}
			callback();
		}
	};

	// check if the keyword is already in the database
	DataLoader.getKeywordId(keyword, languageCode, function(id) {
		// if not already in the database
		if (id === INVALID_ID) {
			DBLayer.executeBatch([ 'INSERT INTO ' + languageCode + '_keyword_tbl (keyword, custom) VALUES ("' + keyword + '", 1)' ], function(r) {

				if (Logger.canLog(Logger.LogLevel.INFO)) {
					Logger.log('Successfully inserted new entry in keyword table for keyword ' + keyword + ' and language ' + languageCode,
							Logger.LogLevel.INFO);
				}

				DBLayer.executeBatch([ 'INSERT INTO ' + languageCode + '_keyword_to_indicator_tbl (keyword_id, indicator_id) VALUES (' + r.insertId
						+ ',' + indicatorId + ')' ], function(r) {
					onInsertion();
				});
			});
		}
		// if already in the database
		else {
			DBLayer.executeBatch([ 'INSERT INTO ' + languageCode + '_keyword_to_indicator_tbl (keyword_id, indicator_id) VALUES (' + id + ','
					+ indicatorId + ')' ], function(r) {
				onInsertion();
			});
		}
	});
}

/**
 * Saves a keyword-to-indicator link for the given array of languages. First inserts the keyword in the given language's keyword table is needed.
 * 
 * @param languageCodes
 * @param indicatorId
 * @param keyword
 * @param callback
 *            optional callback function
 */
DataLoader.saveKeywordToIndicatorIdLinkForLanguages = function(languageCodes, indicatorId, keyword, callback) {
	for ( var i = 0; i < languageCodes.length; i++) {
		DataLoader.saveKeywordToIndicatorIdLink(languageCodes[i], indicatorId, keyword, function() {
			if (typeof callback === 'function' && (i === languageCodes.length - 1)) {
				callback();
			}
		});
	}
}

/**
 * Checks if the given indicator already exists in all the language specific indicator name tables.
 * 
 * @param indicatorName
 * @param callback
 */
DataLoader.checkIfIndicatorAlreadyExists = function(indicatorName, callback) {
	var query = '';
	for ( var i = 0; i < db_languages.length; i++) {
		query += 'SELECT indicator_id FROM ' + db_languages[i] + '_indicator_name_tbl WHERE indicator_name = "' + indicatorName + '"';
		if (i !== db_languages.length - 1) {
			query += ' UNION ';
		}
	}

	DBLayer.executeBatch([ query ], function(r) {

		var alreadyExists = r.rows.length > 0;

		if (Logger.canLog(Logger.LogLevel.INFO)) {
			Logger.log('Indicator ' + indicatorName + ' already exists in database? ' + alreadyExists, Logger.LogLevel.INFO);
		}

		callback(alreadyExists);
	});
}

/**
 * Gets the list of custom indicators for a given language code.
 * 
 * @param languageCode
 * @param callback
 */
DataLoader.getListOfCustomIndicators = function(languageCode, callback) {
	DBLayer.executeBatch([ 'SELECT t1.id, t2.indicator_name from indicator_tbl t1, ' + languageCode
			+ '_indicator_name_tbl t2 WHERE t1.custom = 1 AND t1.id = t2.indicator_id' ], function(r) {

		// convert the resultset in an easier to use array
		var customIndicators = [];

		for ( var i = 0; i < r.rows.length; i++) {
			customIndicators.push({
				name : r.rows.item(i).indicator_name,
				id : r.rows.item(i).id
			});
		}

		// return the array
		callback(customIndicators);

		if (Logger.canLog(Logger.LogLevel.INFO)) {
			Logger.log('Successfully fetched custom indicators for language ' + languageCode, Logger.LogLevel.INFO);
		}
	});
}

/**
 * Gets the keywords across all languages for the given indicator id. The callback gets called with an object containing all the keywords.
 * 
 * @param indicatorId
 * @param callback
 */
DataLoader.getIndicatorKeywords = function(indicatorId, callback) {
	var keywords = {};
	var recursive = function(dbLanguagesArrayIndex) {
		if (dbLanguagesArrayIndex < db_languages.length) {
			var dbLanguage = db_languages[dbLanguagesArrayIndex];

			DBLayer.executeBatch([ 'SELECT t2.keyword FROM ' + dbLanguage + '_keyword_to_indicator_tbl t1 INNER JOIN ' + dbLanguage
					+ '_keyword_tbl t2 ON t2.id = t1.keyword_id WHERE t1.indicator_id = ' + indicatorId ], function(r) {

				for ( var i = 0; i < r.rows.length; i++) {
					var keywordObject = r.rows.item(i);
					if (keywords.hasOwnProperty(keywordObject.keyword)) {
						keywords[keywordObject.keyword].languages.push(dbLanguage);
					} else {
						keywords[keywordObject.keyword] = {
							isNew : false,
							keyword : keywordObject.keyword,
							languages : [ dbLanguage ]
						}
					}
				}

				recursive(dbLanguagesArrayIndex + 1);
			});
		} else {
			callback(keywords);

			if (Logger.canLog(Logger.LogLevel.INFO)) {
				Logger.log('Successfully fetched all keywords across language tables for indicator id ' + indicatorId, Logger.LogLevel.INFO);
			}
		}
	};

	recursive(0);
}

/**
 * Gets data related to the given indicator ID.
 * 
 * @param indicatorId$
 * @param languageCode
 * @param callback
 */
DataLoader.getIndicatorData = function(indicatorId, languageCode, callback) {
	var data = {};

	var query = 'SELECT t2.indicator_name, t1.url, t3.category_id ' + 'FROM indicator_tbl t1 ' + 'INNER JOIN ' + languageCode
			+ '_indicator_name_tbl t2 ON t2.indicator_id = t1.id '
			+ 'INNER JOIN indicator_to_category_tbl t3 ON t3.indicator_id = t1.id WHERE t1.id = ' + indicatorId;

	DBLayer.executeBatch([ query ], function(r) {

		if (r.rows.length > 0) {
			var firstRow = r.rows.item(0);

			data.indicatorId = indicatorId;
			data.indicatorName = firstRow.indicator_name;
			data.url = firstRow.url;
			data.categoryId = firstRow.category_id;

			DataLoader.getIndicatorKeywords(indicatorId, function(keywords) {
				data.keywords = keywords;
				callback(data);

				if (Logger.canLog(Logger.LogLevel.INFO)) {
					Logger.log('Successfully all indicator data for indicator id ' + indicatorId, Logger.LogLevel.INFO);
				}
			});
		}
	});
}

/**
 * Deletes the keyword for the given languages.
 * 
 * @param indicatorId
 * @param keyword
 * @param languageCodes
 */
DataLoader.deleteKeywordForLanguages = function(indicatorId, keyword, languageCodes) {
	for ( var i = 0; i < languageCodes.length; i++) {
		var languageCode = languageCodes[i];

		// anonymous method, to make sure the languageCode is not changed in the database callbacks
		(function(languageCode) {
			DataLoader.getKeywordId(keyword, languageCode, function(id) {
				if (id === INVALID_ID) {
					if (Logger.canLog(Logger.LogLevel.INFO)) {
						Logger.log('Database returned no value for keyword ' + keyword + ' and language ' + languageCode, Logger.LogLevel.INFO);
					}
				} else {
					// check if the keyword in the current language code is used by other indicators
					DBLayer.executeBatch([ 'SELECT COUNT(*) as count FROM ' + languageCode + '_keyword_to_indicator_tbl WHERE indicator_id != '
							+ indicatorId + ' AND keyword_id = ' + id ], function(r) {
						// no other indicator pointing to this keyword
						if (r.rows.item(0).count === 0) {
							DBLayer.executeBatch([ 'DELETE FROM ' + languageCode + '_keyword_tbl WHERE keyword = "' + keyword + '"' ], function(r) {
								if (Logger.canLog(Logger.LogLevel.INFO)) {
									Logger.log('Successfully deleted keyword ' + keyword + ' from language table ' + languageCode,
											Logger.LogLevel.INFO);
								}
							});
						} else if (Logger.canLog(Logger.LogLevel.INFO)) {
							Logger.log('Could not delete keyword ' + keyword + ' from language table ' + languageCode
									+ ' as it is used by other indicators', Logger.LogLevel.INFO);
						}
					});

					DBLayer.executeBatch([ 'DELETE FROM ' + languageCode + '_keyword_to_indicator_tbl WHERE indicator_id = ' + indicatorId
							+ ' AND keyword_id = ' + id ], function(r) {
						if (Logger.canLog(Logger.LogLevel.INFO)) {
							Logger.log('Successfully deleted keyword-to-indicator link for ' + keyword + ' and indicator id' + indicatorId,
									Logger.LogLevel.INFO);
						}
					});
				}
			});
		})(languageCode);
	}
}

/**
 * Updates an indicator given its state delta object.
 * 
 * @param indicatorStateDelta
 */
DataLoader.updateIndicator = function(indicatorStateDelta) {

	var queries = [];

	// category id
	if (indicatorStateDelta.hasOwnProperty('categoryId')) {
		queries.push('UPDATE indicator_to_category_tbl SET category_id = ' + indicatorStateDelta.categoryId + ' WHERE indicator_id = '
				+ indicatorStateDelta.indicatorId);
	}

	// indicator name
	if (indicatorStateDelta.hasOwnProperty('indicatorName')) {
		for ( var i = 0; i < db_languages.length; i++) {
			queries.push('UPDATE ' + db_languages[i] + '_indicator_name_tbl SET indicator_name = "' + indicatorStateDelta.indicatorName
					+ '" WHERE indicator_id = ' + indicatorStateDelta.indicatorId);
		}
	}

	// url
	if (indicatorStateDelta.hasOwnProperty('url')) {
		queries.push('UPDATE indicator_tbl SET url = "' + indicatorStateDelta.url + '" WHERE id = ' + indicatorStateDelta.indicatorId);
	}

	DBLayer.executeBatch(queries);

	// updated keywords
	for ( var keyword in indicatorStateDelta.keywords.updated) {
		// added languages
		if (indicatorStateDelta.keywords.updated[keyword].hasOwnProperty('added')) {
			DataLoader.saveKeywordToIndicatorIdLinkForLanguages(indicatorStateDelta.keywords.updated[keyword].added, indicatorStateDelta.indicatorId,
					keyword);
		}

		// deleted languages
		if (indicatorStateDelta.keywords.updated[keyword].hasOwnProperty('deleted')) {
			DataLoader.deleteKeywordForLanguages(indicatorStateDelta.indicatorId, keyword, indicatorStateDelta.keywords.updated[keyword].deleted);
		}
	}

	// added keywords
	for ( var keyword in indicatorStateDelta.keywords.added) {
		var keywordObject = indicatorStateDelta.keywords.added[keyword];
		DataLoader.saveKeywordToIndicatorIdLinkForLanguages(keywordObject.languages, indicatorStateDelta.indicatorId, keyword);
	}

	// deleted keywords
	for ( var keyword in indicatorStateDelta.keywords.deleted) {
		DataLoader.deleteKeywordForLanguages(indicatorStateDelta.indicatorId, keyword, indicatorStateDelta.keywords.deleted[keyword].languages);
	}
}

/**
 * Deletes an indicator from the database given its id.
 */
DataLoader.deleteIndicator = function(indicatorId) {

	var queries = [];
	queries.push('DELETE FROM indicator_tbl WHERE id = ' + indicatorId);
	queries.push('DELETE FROM indicator_to_category_tbl WHERE indicator_id = ' + indicatorId);

	for ( var i = 0; i < db_languages.length; i++) {
		queries.push('DELETE FROM ' + db_languages[i] + '_indicator_name_tbl WHERE indicator_id = ' + indicatorId);
	}

	DBLayer.executeBatch(queries);

	DataLoader.getIndicatorKeywords(indicatorId, function(keywords) {
		for (keyword in keywords) {
			DataLoader.deleteKeywordForLanguages(indicatorId, keyword, keywords[keyword].languages);
		}
	});
}