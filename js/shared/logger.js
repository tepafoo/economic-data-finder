/**
 * Constructor.
 */
function Logger() {
}

// log
Logger.LogLevel = {
	NONE : 0,
	ERROR : 1,
	WARNING : 2,
	INFO : 3
}

// this is overriden by the Ant build script
Logger.CurrentLogLevel = Logger.LogLevel.NONE;

/**
 * Returns <code>true</code> if can log at the given log level.<br/>See <code>Logger.LogLevel</code> in constants.js
 * 
 * @param logLevel
 * @returns {Boolean}
 */
Logger.canLog = function(logLevel) {
	return (Logger.CurrentLogLevel >= logLevel);
}

/**
 * Logs a given message, if logging is enabled.
 * 
 * @param message
 *            message to be logged
 * @param level
 *            see <code>Logger.LogLevel</code> in constants.js
 */
Logger.log = function(message, level) {
	switch (level) {
	case Logger.LogLevel.INFO:
		console.log('EDF - ' + message);
		break;
	case Logger.LogLevel.WARNING:
		console.warn('EDF - ' + message);
		break;
	case Logger.LogLevel.ERROR:
		console.error('EDF - ' + message);
		break;
	default:
		console.log('EDF - ' + message);
		break;
	}
}