/**
 * Constructor.
 * 
 * @param onChange
 */
function CustomIndicatorWidget(onChange) {
	var LANGUAGES_LIST_BOX_ALL = 'all';

	// make sure this was called using the 'new' keyword
	if (!(this instanceof arguments.callee)) {
		throw new Error("Constructor called as a function");
	}

	// contains the current state of this widget
	var currentState = {
		indicatorValid : false,
		urlValid : false,
		allKeywordsValid : false
	};

	// initial and current edit data
	var initialEditData = {};
	var currentEditData = {};

	// other initialisation
	var addKeywordButtonClickCounter = 0;

	// private methods

	/**
	 * Creates a new row.
	 * 
	 * @param keyText
	 * @param valueWidget
	 * @param keyCssClassName
	 */
	function createRow(keyText, valueWidget, keyCssClassName) {
		var container = document.createElement('div');
		$(container).addClass('customIndicatorWidget-row');

		var keyWidget = DomUtil.createLabel(keyText);

		$(keyWidget).addClass('customIndicatorWidget-row-key');
		if (keyCssClassName !== undefined) {
			$(keyWidget).addClass(keyCssClassName);
		}

		$(valueWidget).addClass('floatLeft');

		container.appendChild(keyWidget);
		container.appendChild(valueWidget);

		return container;
	}

	/**
	 * Fires a change to the listener.
	 */
	function fireChange() {
		if (typeof (onChange) === 'function') {
			var allValid = currentState.indicatorValid && currentState.urlValid && currentState.allKeywordsValid;
			var editStateChanged = JSON.stringify(currentEditData) !== JSON.stringify(initialEditData);

			onChange(allValid, editStateChanged);
		}
	}

	/**
	 * Creates a category list box.
	 * 
	 * @returns
	 */
	function createCategoryListBox() {
		var listBox = document.createElement('select');
		DataLoader.getIndicatorCategories(function(categories) {
			for ( var i in categories) {
				var option = DomUtil.createOptionElement(categories[i].name, categories[i].id);
				listBox.appendChild(option);
			}

			// update current data using initial category
			currentEditData.categoryId = parseInt(listBox[listBox.selectedIndex].value, 10);
		});

		return listBox;
	}

	/**
	 * Creates a languages list box.
	 * 
	 * @param initialSelections
	 */
	function createLanguagesListBox(initialSelections) {

		var listBox = document.createElement('select');
		listBox.setAttribute('multiple', true);

		// 1. append the 'All' option
		var option = DomUtil.createOptionElement(chrome.i18n.getMessage('options_page_indicators_tab_all_languages'), LANGUAGES_LIST_BOX_ALL);
		listBox.appendChild(option);

		// 2. add the supported languages
		for ( var i = 0; i < db_languages.length; i++) {
			var languageCode = db_languages[i];

			var option = DomUtil.createOptionElement(chrome.i18n.getMessage('language_' + languageCode), languageCode);

			// select this option only if there is not initial selection OR the language code is part of the initial selection
			if (initialSelections === undefined || Util.isInArray(languageCode, initialSelections)) {
				option.selected = true;
			}

			listBox.appendChild(option);
		}

		return listBox;
	}

	/**
	 * Creates a text box.
	 * 
	 * @param type
	 * @param placeholder
	 * @param pattern
	 */
	function createTextBox(type, placeholder, pattern) {

		var textBox = document.createElement('input');
		textBox.type = type;
		textBox.setAttribute('required', 'required');

		if (placeholder != null) {
			textBox.placeholder = placeholder;
		}

		if (pattern != null) {
			textBox.pattern = pattern;
		}

		return textBox;
	}

	/**
	 * Loops through the keywords list and updates the number of valid keywords as set in the currentState object.
	 * 
	 * @param keywordInputs
	 */
	function updateNumberOfValidKeywords(keywordInputs) {

		if (keywordInputs.length === 0) {
			currentState.allKeywordsValid = false;
		} else {
			var numberOfValidKeywords = 0;
			for ( var i = 0; i < keywordInputs.length; i++) {
				if (jQuery.trim(keywordInputs[i].value) !== '') {
					numberOfValidKeywords++;
				}
			}

			currentState.allKeywordsValid = (numberOfValidKeywords === keywordInputs.length);
		}
	}

	/**
	 * Checks if the given indicator already exists.
	 * 
	 * @param indicator
	 * @param callback
	 */
	function checkIfIndicatorAlreadyExists(indicator, callback) {
		DataLoader.checkIfIndicatorAlreadyExists(jQuery.trim(indicator), function(alreadyExists) {
			if (alreadyExists) {
				indicatorNameNotification.innerText = chrome.i18n.getMessage('options_page_indicators_tab_indicator_already_in_use');
			} else {
				indicatorNameNotification.innerText = '';
			}

			currentState.indicatorValid = !alreadyExists;

			callback();
		});
	}

	/**
	 * Adds an indicator widget pre-populated with the given keyword data.
	 * 
	 * @param data
	 */
	function addKeywordWidget(data) {
		var container = document.getElementById(getKeywordsListContainerId());
		var keywordInputs = container.getElementsByTagName('input');

		// clear the placeholder message if necessary
		if (keywordInputs.length === 0) {
			container.innerText = '';
		}

		// create the text box
		var textBox = createTextBox('text', chrome.i18n.getMessage('options_page_indicators_tab_keyword_input_placeholder'), '.*[^\\s]+.*');
		if (data.hasOwnProperty('keyword')) {
			textBox.value = data.keyword;
		}
		textBox.onkeyup = function() {
			// keyup can happen even if the content of the textbox hasn't changed. For example when keys such as Shift, Ctrl or Alt are use alone
			if (this.value !== data.keyword) {
				// check validity of the keyword
				currentState.allKeywordsValid = (jQuery.trim(this.value) !== '');

				// store previous keyword
				var previousKeyword = null;
				if (data.hasOwnProperty('keyword')) {
					previousKeyword = data.keyword;
				} else {
					previousKeyword = data.temporaryIdentifier;
				}

				// update current data
				data.keyword = this.value;
				currentEditData.keywords[data.keyword] = data;

				// delete reference of previous keyword (useful for the method getStateDeltaInternal() that compares properties in the keywords array
				// between initial and current data)
				delete currentEditData.keywords[previousKeyword];

				fireChange();
			}
		};
		$(textBox).addClass('customIndicatorWidget-keywordInput');

		// create the language selection list box
		if (data.languages === undefined) {
			data.languages = Util.copyArray(db_languages, true);
		}

		var languagesListBox = createLanguagesListBox(data.languages);
		languagesListBox.id = 'customIndicatorWidget-languagesListBox-' + addKeywordButtonClickCounter++;

		var textBoxListBoxContainer = document.createElement('div');
		$(textBoxListBoxContainer).addClass('floatLeft');

		textBoxListBoxContainer.appendChild(textBox);
		textBoxListBoxContainer.appendChild(languagesListBox);

		var keywordWidget = new HasRemoveButtonWidget(textBoxListBoxContainer, function() {
			container.removeChild(keywordWidget);

			updateNumberOfValidKeywords(keywordInputs);

			if (keywordInputs.length === 0) {
				showAddKeywordsMessage(keywordsListContainer);
			}

			// update current data
			delete currentEditData.keywords[data.keyword];

			fireChange();
		});

		container.insertBefore(keywordWidget, container.firstChild);

		$('#' + languagesListBox.id).dropdownchecklist({
			firstItemChecksAll : true,
			onComplete : function(selector) {
				var languages = [];
				for ( var i = 0; i < selector.options.length; i++) {
					if (selector.options[i].selected && selector.options[i].value !== LANGUAGES_LIST_BOX_ALL) {
						languages.push(selector.options[i].value);
					}
				}

				data.languages = languages;

				fireChange();
			}
		});
	}

	/**
	 * Shows a message for users to add keywords.
	 * 
	 * @param element
	 */
	function showAddKeywordsMessage(element) {
		element.innerText = chrome.i18n.getMessage('options_page_indicators_tab_add_one_keyword');
	}

	function getKeywordsListContainerId() {
		return 'customIndicatorWidget-indicatorKeywords';
	}

	// end of private methods

	// privileged methods

	/**
	 * INTERNAL : Gets the data associated with this widget.
	 * 
	 * @returns
	 */
	this.getDataInternal = function() {
		return currentEditData;
	}

	/**
	 * INTERNAL : Gets the delta between the initial and current states.
	 */
	this.getStateDeltaInternal = function() {
		var stateDelta = {};
		stateDelta.indicatorId = initialEditData.indicatorId;

		if (currentEditData.categoryId !== initialEditData.categoryId) {
			stateDelta.categoryId = currentEditData.categoryId;
		}

		if (currentEditData.indicatorName !== initialEditData.indicatorName) {
			stateDelta.indicatorName = currentEditData.indicatorName;
		}

		if (currentEditData.url !== initialEditData.url) {
			stateDelta.url = currentEditData.url;
		}

		// loop through keywords in currentEditData and compare to keywords in initialEditData to decide whether to put in stateDelta

		stateDelta.keywords = {};
		stateDelta.keywords.updated = {};
		stateDelta.keywords.added = {};
		stateDelta.keywords.deleted = {};

		var copyOfInitialEditDataKeywords = Util.copyObject(initialEditData.keywords, true);

		for ( var keyword in currentEditData.keywords) {

			/**
			 * Initialises the keyword object's given state property if necessary.
			 * 
			 * @param state
			 *            any of 'updated', 'added', 'deleted'
			 */
			var initialiseKeywordObjectIfNecessary = function(state) {
				Util.initialiseIfNotOwnProperty(stateDelta.keywords[state], keyword, {});
			};

			// 1. if copyOfInitialEditDataKeywords has the keyword, we are in the "updated" state...
			if (copyOfInitialEditDataKeywords.hasOwnProperty(keyword)) {

				// 1.1. check if the languages selection is the same
				var currentEditDataLanguages = currentEditData.keywords[keyword].languages;
				var copyOfInitialEditDataLanguages = copyOfInitialEditDataKeywords[keyword].languages;

				// 1.2. first pass: loop through languages in currentEditDataLanguages and try to find them in copyOfInitialEditDataLanguages
				for ( var i = 0; i < currentEditDataLanguages.length; i++) {
					var language = currentEditDataLanguages[i];

					var initialEditDataLanguageIndex = $.inArray(language, copyOfInitialEditDataLanguages);

					// 1.2.1 if the language is not in the copyOfInitialEditDataLanguages, add it to "added"...
					if (initialEditDataLanguageIndex === -1) {
						initialiseKeywordObjectIfNecessary('updated');
						Util.initialiseIfNotOwnProperty(stateDelta.keywords.updated[keyword], 'added', []);

						stateDelta.keywords.updated[keyword].added.push(language);
					}
					// 1.2.1 ...otherwise, remove it from the copyOfInitialEditDataLanguages array
					else {
						copyOfInitialEditDataLanguages.splice(initialEditDataLanguageIndex, 1);
					}
				}

				// 1.3. second pass: check the size of the copyOfInitialEditDataLanguages array. If not zero, add languages to "deleted".
				if (copyOfInitialEditDataLanguages.length > 0) {
					initialiseKeywordObjectIfNecessary('updated');
					stateDelta.keywords.updated[keyword].deleted = [];
					for ( var i = 0; i < copyOfInitialEditDataLanguages.length; i++) {
						stateDelta.keywords.updated[keyword].deleted.push(copyOfInitialEditDataLanguages[i]);
					}
				}

				// 1.4. remove the keyword from the copyOfInitialEditDataKeywords object
				delete copyOfInitialEditDataKeywords[keyword];
			}

			// 2. ...otherwise, we are in the "added" state
			else {
				initialiseKeywordObjectIfNecessary('added');
				stateDelta.keywords.added[keyword].languages = currentEditData.keywords[keyword].languages;
			}
		}

		// 3. check if there are any keywords in the "deleted" state
		if (!jQuery.isEmptyObject(copyOfInitialEditDataKeywords)) {
			for ( var keyword in copyOfInitialEditDataKeywords) {
				initialiseKeywordObjectIfNecessary('deleted');
				stateDelta.keywords.deleted[keyword].languages = copyOfInitialEditDataKeywords[keyword].languages;
			}
		}

		return stateDelta;
	}

	/**
	 * INTERNAL : Gets the widget associated with this object.
	 */
	this.getContainerInternal = function() {
		return container;
	}

	/**
	 * INTERNAL: Populates this widget with the given data.
	 * 
	 * @param data
	 */
	this.popuplateInternal = function(data) {
		// some initialisation
		initialEditData = data;
		currentEditData = Util.copyObject(data, true);

		// populate this view using currentEditData so that no references are held on initialEditData
		indicatorNameTextbox.value = currentEditData.indicatorName;
		urlTextbox.value = currentEditData.url;

		for ( var i = 0; i < categoryListBox.length; i++) {
			if (category[i].value === currentEditData.categoryId) {
				categoryListBox.selectedIndex = i;
				break;
			}
		}

		for ( var keyword in currentEditData.keywords) {
			addKeywordWidget(currentEditData.keywords[keyword]);
		}

		currentState.allKeywordsValid = true;
		currentState.indicatorValid = true;
		currentState.urlValid = true;

		fireChange();
	}

	// end of privileged methods

	// create the category name key-value widget
	var categoryListBox = createCategoryListBox();

	categoryListBox.onchange = function() {
		// update current data
		currentEditData.categoryId = this[this.selectedIndex].value;

		fireChange();
	};
	var categoryKeyValue = createRow(chrome.i18n.getMessage('options_page_indicators_tab_category_key'), categoryListBox,
			'customIndicatorWidget-row-key-category');

	// create the indicator name key-value widget
	var indicatorNameNotification = document.createElement('div');
	$(indicatorNameNotification).addClass('customIndicatorWidget-indicatorNameNotification');
	var indicatorNameTextbox = createTextBox('text', chrome.i18n.getMessage('options_page_indicators_tab_indicator_input_placeholder'), '.*[^\\s]+.*');
	indicatorNameTextbox.onblur = function() {
		// update current data
		currentEditData.indicatorName = this.value;

		// if necessary, check if the indicator already exists
		if (initialEditData.indicatorName !== currentEditData.indicatorName) {
			checkIfIndicatorAlreadyExists(this.value, function() {
				fireChange();
			});
		} else {
			fireChange();
		}

	};
	var indicatorKeyValue = createRow(chrome.i18n.getMessage('options_page_indicators_tab_indicator_key'), indicatorNameTextbox);

	// create the url key-value widget
	var urlTextbox = createTextBox('url', 'http://');
	urlTextbox.onblur = function() {
		currentState.urlValid = urlTextbox.validity.valid;

		// update current data
		currentEditData.url = this.value;

		fireChange();
	}
	var urlKeyValue = createRow(chrome.i18n.getMessage('options_page_indicators_tab_url_key'), urlTextbox);

	var addKeywordButton = document.createElement('input');
	addKeywordButton.type = 'button';
	addKeywordButton.value = chrome.i18n.getMessage('options_page_indicators_tab_add_keyword');
	addKeywordButton.onclick = function() {

		// 1. add a keyword widget to the view with an empty data object
		if (currentEditData.keywords === undefined) {
			currentEditData.keywords = {};
		}

		// note: addKeywordButtonClickCounter is incremented within addKeywordWidget(), so no need to do it here
		var identifier = 'new_' + addKeywordButtonClickCounter;

		var keywordData = {
			isNew : true,
			temporaryIdentifier : identifier
		};

		currentEditData.keywords[identifier] = keywordData;

		addKeywordWidget(keywordData);

		// 3. set the keywords validity state to false as the keyword hasn't been defined by the user yet
		currentState.allKeywordsValid = false;
		fireChange();
	}
	var keywordsKeyValue = createRow(chrome.i18n.getMessage('options_page_indicators_tab_keywords'), addKeywordButton);
	$(keywordsKeyValue).addClass('customIndicatorWidget-row-key-keywords-container');
	var keywordsListContainer = document.createElement('div');
	keywordsListContainer.id = getKeywordsListContainerId();
	showAddKeywordsMessage(keywordsListContainer);

	// create and populate the container
	var container = document.createElement('div');
	$(container).addClass('customIndicatorWidget');
	container.appendChild(categoryKeyValue);
	container.appendChild(indicatorKeyValue);
	container.appendChild(indicatorNameNotification);
	container.appendChild(urlKeyValue);
	container.appendChild(keywordsKeyValue);
	container.appendChild(keywordsListContainer);

	fireChange();

	return this;
}

/**
 * Gets the widget associated with this object.
 * 
 * @returns
 */
CustomIndicatorWidget.prototype.asWidget = function() {
	return this.getContainerInternal();
};

/**
 * Gets the data associated with this widget.
 * 
 * @returns
 */
CustomIndicatorWidget.prototype.getData = function() {
	return this.getDataInternal();
};

/**
 * Gets the delta between the initial and current states.
 * 
 * @returns
 */
CustomIndicatorWidget.prototype.getStateDelta = function() {
	return this.getStateDeltaInternal();
}

/**
 * Populates this widget with the given data.
 * 
 * @param data
 */
CustomIndicatorWidget.prototype.populate = function(data) {
	this.popuplateInternal(data);
};