// open the database connection
var db = openDatabase("ecofacts", "", "Ecofacts database", 200000);

/**
 * Constructor.
 */
function DBLayer() {
}

/**
 * Handles SQL statement errors.
 * 
 * @param tx
 *            transaction object
 * @param e
 *            error object
 */
function handleSqlStatementError(tx, e) {
	console.error('Economic Data Finder - database transaction error: ' + e.message);
}

/**
 * Handles SQL transaction errors.
 * 
 * @param e
 *            error object
 */
function handleSqlTransactionError(e) {
	console.error('Economic Data Finder - database transaction error: ' + e.message);
}

/**
 * Executes a batch of queries.
 * 
 * @param queries
 *            array of queries to be executed
 * @param callback
 *            function to be called once array of queries executed
 */
DBLayer.executeBatch = function(queries, callback) {

	if (Logger.canLog(Logger.LogLevel.INFO)) {
		Logger.log('executing batch query', Logger.LogLevel.INFO);
	}

	// run all the queries in one transaction
	db.transaction(function(tx) {
		// define the success callback
		function successCallback(tx, r) {
			if (typeof (callback) === "function") {
				callback(r);
			}
		}

		// function that will run through the queries
		function multiSql(tx, queries) {
			// next() will be run recursively until reaching the end of the
			// array of queries
			function next(tx) {
				nextQuery = queries.shift();
				if (Logger.canLog(Logger.LogLevel.INFO)) {
					Logger.log('executing query: ' + nextQuery, Logger.LogLevel.INFO);
				}

				tx.executeSql(nextQuery, null, queries.length ? next : successCallback, handleSqlStatementError);
			}
			// call next()
			next(tx);
		}
		// call multiSql()
		multiSql(tx, queries);
	});
};

/**
 * Drops the tables listed in the given array.
 * 
 * @param tables
 *            array of tables to be dropped
 * @param callback
 *            callback function
 */
DBLayer.dropTables = function(tables, callback) {
	// construct the queries
	var queries = [];
	for ( var i = 0; i < tables.length; i++) {
		queries.push("DROP TABLE IF EXISTS " + tables[i] + ";");
	}

	// run the queries
	DBLayer.executeBatch(queries, callback);
}

/**
 * Prepares the database.
 * 
 * @param ready
 *            function to be called when database ready
 */
DBLayer.prepareDatabase = function(ready) {
	// if database was created just now...
	if (db.version !== Constants.dbVersion) {
		if (Logger.canLog(Logger.LogLevel.INFO)) {
			Logger.log('Preparing the database');
		}

		db.changeVersion(db.version, Constants.dbVersion, function(t) {
			var start = new Date();

			if (Logger.canLog(Logger.LogLevel.INFO)) {
				Logger.log('Dropping any existing tables');
			}

			// drop tables
			for ( var i = 0; i < db_tables.length; i++) {
				t.executeSql("DROP TABLE IF EXISTS " + db_tables[i]);
			}

			if (Logger.canLog(Logger.LogLevel.INFO)) {
				Logger.log('Running the common table creation queries');
			}

			// common queries
			for ( var i = 0; i < db_queries.length; i++) {
				t.executeSql(db_queries[i]);
			}

			if (Logger.canLog(Logger.LogLevel.INFO)) {
				Logger.log('Running the language table queries');
			}

			// language queries
			for ( var i = 0; i < db_languages.length; i++) {
				var lang_db_queries = window[db_languages[i] + '_db_queries'];
				for ( var j = 0; j < lang_db_queries.length; j++) {
					t.executeSql(lang_db_queries[j]);
				}
			}

			if (Logger.canLog(Logger.LogLevel.WARNING)) {
				var end = new Date();
				Logger.log('executed table creation queries in ' + (end - start) + 'ms', Logger.LogLevel.WARNING);
			}
		}, handleSqlTransactionError, function() {
			ready();
		});
	}
	// ...otherwise
	else {
		ready();
	}
}