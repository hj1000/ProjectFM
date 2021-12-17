exports.fnCreateEvent = function ( evtEmitter, evtName, funcName ) {
	var delay = 3 * 1000;
	
	if( arguments.length > 3 )		delay = arguments[3];
		
	evtEmitter.once( evtName, funcName );
	setTimeout( this.fnRemoveEvent, delay, evtEmitter, evtName, funcName );
}

exports.fnRemoveEvent = function ( evtEmitter, evtName, funcName ) {
	evtEmitter.removeListener( evtName, funcName );
}
