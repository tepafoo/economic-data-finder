/**
 * Widget that lists the given links in the given container.
 * 
 * @param links
 *            object of links per group
 * @param linksContainer
 *            HTML element that contains the links
 */
function LinkSelectorWidget(links, linksContainer) {

	// make sure this was called using the 'new' keyword
	if (!(this instanceof arguments.callee)) {
		throw new Error("Constructor called as a function");
	}

	// private methods

	/**
	 * Adds an H3 to the given links container.
	 * 
	 * @param linksContainer
	 * @param h3Text
	 */
	function addH3ToLinksContainer(linksContainer, h3Text) {
		// create h3 tag
		var h3Tag = document.createElement('h3');
		h3Tag.innerText = h3Text;
		linksContainer.appendChild(h3Tag);
	}

	/**
	 * Adds the given link along with its text to the UL.
	 * 
	 * @param ul
	 * @param linkObject
	 */
	function addLinkToUl(ul, linkObject) {
		if (Logger.canLog(Logger.LogLevel.INFO)) {
			Logger.log('Displaying link: ' + linkObject.url + ' with name '
					+ linkObject.text, Logger.LogLevel.INFO);
		}
		var aTag = document.createElement('a');
		aTag.setAttribute('href', 'javascript:void 0;');
		aTag.setAttribute('title', linkObject.text);
		aTag.setAttribute('onclick', 'javascript:openUrl("'
				+ encodeURIComponent(JSON.stringify(linkObject)) + '");');
		aTag.innerText = linkObject.text;

		var li = document.createElement('li');
		li.className += ' linkContainer';
		li.appendChild(aTag);
		ul.appendChild(li);
	}

	/**
	 * Creates the view.
	 * 
	 * @param links
	 */
	function createView(links) {
		// for each category
		for ( var linkGroupName in links) {
			// create a UL element that will contain the links and the category
			// names
			var ul = document.createElement('ul');

			// add the category name to the links container
			addH3ToLinksContainer(linksContainer, linkGroupName);

			// for each link in a given category
			for ( var i = 0; i < links[linkGroupName].length; i++) {
				// add link to the UL
				addLinkToUl(ul, links[linkGroupName][i]);
			}

			// add the UL to the links container
			linksContainer.appendChild(ul);
		}
	}

	// end of private methods

	createView(links);
}