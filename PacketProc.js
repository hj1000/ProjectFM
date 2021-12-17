var PROC_KEEP_ALIVE = 1;
var PROC_GET_USER_DATA = 1000;
var PROC_GET_OID_DATA = 1001;
var PROC_GET_MAPLEVEL_DATA = 1002;
var PROC_UPDATE_CUR_MAPLEVEL = 1003;

var PROC_GET_AVATAR_INFO = 1100;
var PROC_GET_FISH_INFO = 1101;
var PROC_GET_FISHPOS_INFO= 1102;
var PROC_GET_MAPCLEAR_INFO = 1103;

var PROC_ITEM_UPGRADE = 1200;

var PROC_GET_FISHDATA_BYOID = 1300;
var PROC_GET_FISHDATA_BYFID = 1301;
var PROC_COMPLETE_FISH = 1302;

var PROC_RELOAD_AVATAR_INFO = 2000;
var PROC_RELOAD_FISH_INFO = 2001;
var PROC_RELOAD_FISHPOS_INFO = 2002;
var PROC_RELOAD_ITEM_INFO = 2003;

//var Iconv = require('iconv').Iconv;
//var m_iconv = new Iconv( 'EUC-KR', 'UTF-8//TRANSLIT//IGNORE' );

exports.SendKeepAlive = function ( socket, packetMake, packetEvent, evtReceive, iPacketIndex ) {
	//console.time( iPacketIndex );
	
	var sendIndex = 0;
	var sendPacket = new Buffer( 1024 );
	sendPacket.writeInt16LE( PROC_KEEP_ALIVE, sendIndex );		sendIndex += 2;
	sendPacket.writeInt32LE( iPacketIndex, sendIndex );			sendIndex += 4;
	packetMake.fnSend( socket, sendPacket, sendIndex );
	
	packetEvent.fnCreateEvent( evtReceive, iPacketIndex, RecvKeepAlive );
	
	function RecvKeepAlive( recvPacket ) {
		var recvIndex = 0;
		var packetKind		= recvPacket.readInt16LE( recvIndex );		recvIndex += 2;
		var packetIndex		= recvPacket.readInt32LE( recvIndex );		recvIndex += 4;

		//console.timeEnd( iPacketIndex );
		//console.log( 'Recv:', iPacketIndex );
	}
}

exports.SendGetUserData = function ( socket, res, packetMake, packetEvent, evtReceive, strAccount, iPacketIndex ) {
	//console.time( iPacketIndex );
	
	var iLength = strAccount.length;
	
	var sendIndex = 0;
	var sendPacket = new Buffer( 1024 );
	sendPacket.writeInt16LE( PROC_GET_USER_DATA, sendIndex );	sendIndex += 2;
	sendPacket.writeInt32LE( iPacketIndex, sendIndex );			sendIndex += 4;
	sendPacket.writeUInt8( iLength, sendIndex );				sendIndex += 1;
	sendPacket.write( strAccount, sendIndex );					sendIndex += iLength;
	packetMake.fnSend( socket, sendPacket, sendIndex );
	
	packetEvent.fnCreateEvent( evtReceive, iPacketIndex, RecvGetUserData );

	function RecvGetUserData( recvPacket ) {
		var recvIndex = 0;
		var packetKind		= recvPacket.readInt16LE( recvIndex );		recvIndex += 2;
		var packetIndex		= recvPacket.readInt32LE( recvIndex );		recvIndex += 4;
		var iOid			= recvPacket.readInt32LE( recvIndex );		recvIndex += 4;
		var sMapLevel		= recvPacket.readInt16LE( recvIndex );		recvIndex += 2;
		var sCurMapLevel	= recvPacket.readInt16LE( recvIndex );		recvIndex += 2;
		var iPoint			= recvPacket.readInt32LE( recvIndex );		recvIndex += 4;
		var iGold			= recvPacket.readInt32LE( recvIndex );		recvIndex += 4;

		//console.timeEnd( iPacketIndex );
		//console.log( 'Recv:', iPacketIndex, strAccount, iOid, iPoint );

		var data = {};
		data.strAccount = strAccount;
		data.iOid = iOid;
		data.sMapLevel = sMapLevel;
		data.sCurMapLevel = sCurMapLevel;
		data.iPoint = iPoint;
		data.iGold = iGold;

		res.end( JSON.stringify(data) );
	}
}

exports.SendGetOidData = function ( socket, res, packetMake, packetEvent, evtReceive, iOid, strAccountList, iPacketIndex ) {
	//console.time( iPacketIndex );
	
	var iLength = strAccountList.length;
	
	var sendIndex = 0;
	var sendPacket = new Buffer( 1024 );
	sendPacket.writeInt16LE( PROC_GET_OID_DATA, sendIndex );	sendIndex += 2;
	sendPacket.writeInt32LE( iPacketIndex, sendIndex );			sendIndex += 4;
	sendPacket.writeInt32LE( iOid, sendIndex );					sendIndex += 4;
	sendPacket.writeInt16LE( iLength, sendIndex );				sendIndex += 2;
	sendPacket.write( strAccountList, sendIndex );				sendIndex += iLength;
	packetMake.fnSend( socket, sendPacket, sendIndex );
	
	packetEvent.fnCreateEvent( evtReceive, iPacketIndex, RecvGetOidData );

	function RecvGetOidData( recvPacket ) {
		var recvIndex = 0;
		var packetKind		= recvPacket.readInt16LE( recvIndex );		recvIndex += 2;
		var packetIndex		= recvPacket.readInt32LE( recvIndex );		recvIndex += 4;
		var iOid			= recvPacket.readInt32LE( recvIndex );		recvIndex += 4;

		//console.timeEnd( iPacketIndex );
		//console.log( 'Recv:', iPacketIndex, strAccount, iOid, iPoint );

		var data = {};
		data.iOid = iOid;

		res.end( JSON.stringify(data) );
	}
}

exports.SendGetMapLevelData = function ( socket, res, packetMake, packetEvent, evtReceive, iOid, iPacketIndex ) {
	//console.time( iPacketIndex );
	
	var sendIndex = 0;
	var sendPacket = new Buffer( 1024 );
	sendPacket.writeInt16LE( PROC_GET_MAPLEVEL_DATA, sendIndex );	sendIndex += 2;
	sendPacket.writeInt32LE( iPacketIndex, sendIndex );				sendIndex += 4;
	sendPacket.writeInt32LE( iOid, sendIndex );						sendIndex += 4;
	packetMake.fnSend( socket, sendPacket, sendIndex );
	
	packetEvent.fnCreateEvent( evtReceive, iPacketIndex, RecvGetMapLevelData );

	function RecvGetMapLevelData( recvPacket ) {
		var recvIndex = 0;
		var packetKind		= recvPacket.readInt16LE( recvIndex );		recvIndex += 2;
		var packetIndex		= recvPacket.readInt32LE( recvIndex );		recvIndex += 4;
		var sLevel1			= recvPacket.readInt16LE( recvIndex );		recvIndex += 2;
		var sValue1			= recvPacket.readInt16LE( recvIndex );		recvIndex += 2;
		var iPoint1			= recvPacket.readInt32LE( recvIndex );		recvIndex += 4;
		var iGold1			= recvPacket.readInt32LE( recvIndex );		recvIndex += 4;
		var sLevel2			= recvPacket.readInt16LE( recvIndex );		recvIndex += 2;
		var sValue2			= recvPacket.readInt16LE( recvIndex );		recvIndex += 2;
		var iPoint2			= recvPacket.readInt32LE( recvIndex );		recvIndex += 4;
		var iGold2			= recvPacket.readInt32LE( recvIndex );		recvIndex += 4;
		var sLevel3			= recvPacket.readInt16LE( recvIndex );		recvIndex += 2;
		var sValue3			= recvPacket.readInt16LE( recvIndex );		recvIndex += 2;
		var iPoint3			= recvPacket.readInt32LE( recvIndex );		recvIndex += 4;
		var iGold3			= recvPacket.readInt32LE( recvIndex );		recvIndex += 4;

		//console.timeEnd( iPacketIndex );
		//console.log( 'Recv:', iPacketIndex, strAccount, iOid, sMapLevel );

		var data = {};
		data.sLevel1	= sLevel1;
		data.sValue1	= sValue1;
		data.iPoint1	= iPoint1;
		data.iGold1		= iGold1;
		data.sLevel2	= sLevel2;
		data.sValue2	= sValue2;
		data.iPoint2	= iPoint2;
		data.iGold2		= iGold2;
		data.sLevel3	= sLevel3;
		data.sValue3	= sValue3;
		data.iPoint3	= iPoint3;
		data.iGold3		= iGold3;

		res.end( JSON.stringify(data) );
	}
}

exports.SendUpdateCurMapLevel = function ( socket, res, packetMake, packetEvent, evtReceive, iOid, sMapLevel, iPacketIndex ) {
	//console.time( iPacketIndex );
	
	var sendIndex = 0;
	var sendPacket = new Buffer( 1024 );
	sendPacket.writeInt16LE( PROC_UPDATE_CUR_MAPLEVEL, sendIndex );	sendIndex += 2;
	sendPacket.writeInt32LE( iPacketIndex, sendIndex );				sendIndex += 4;
	sendPacket.writeInt32LE( iOid, sendIndex );						sendIndex += 4;
	sendPacket.writeInt16LE( sMapLevel, sendIndex );				sendIndex += 2;
	packetMake.fnSend( socket, sendPacket, sendIndex );
	
	packetEvent.fnCreateEvent( evtReceive, iPacketIndex, RecvUpdateCurMapLevel );

	function RecvUpdateCurMapLevel( recvPacket ) {
		var recvIndex = 0;
		var packetKind		= recvPacket.readInt16LE( recvIndex );		recvIndex += 2;
		var packetIndex		= recvPacket.readInt32LE( recvIndex );		recvIndex += 4;
		var sCurMapLevel	= recvPacket.readInt16LE( recvIndex );		recvIndex += 2;
		var sLevel1			= recvPacket.readInt16LE( recvIndex );		recvIndex += 2;
		var sValue1			= recvPacket.readInt16LE( recvIndex );		recvIndex += 2;
		var iPoint1			= recvPacket.readInt32LE( recvIndex );		recvIndex += 4;
		var iGold1			= recvPacket.readInt32LE( recvIndex );		recvIndex += 4;
		var sLevel2			= recvPacket.readInt16LE( recvIndex );		recvIndex += 2;
		var sValue2			= recvPacket.readInt16LE( recvIndex );		recvIndex += 2;
		var iPoint2			= recvPacket.readInt32LE( recvIndex );		recvIndex += 4;
		var iGold2			= recvPacket.readInt32LE( recvIndex );		recvIndex += 4;
		var sLevel3			= recvPacket.readInt16LE( recvIndex );		recvIndex += 2;
		var sValue3			= recvPacket.readInt16LE( recvIndex );		recvIndex += 2;
		var iPoint3			= recvPacket.readInt32LE( recvIndex );		recvIndex += 4;
		var iGold3			= recvPacket.readInt32LE( recvIndex );		recvIndex += 4;

		//console.timeEnd( iPacketIndex );
		//console.log( 'Recv:', iPacketIndex, strAccount, iOid, sMapLevel );

		var data = {};
		data.sCurMapLevel = sCurMapLevel;
		data.sLevel1	= sLevel1;
		data.sValue1	= sValue1;
		data.iPoint1	= iPoint1;
		data.iGold1		= iGold1;
		data.sLevel2	= sLevel2;
		data.sValue2	= sValue2;
		data.iPoint2	= iPoint2;
		data.iGold2		= iGold2;
		data.sLevel3	= sLevel3;
		data.sValue3	= sValue3;
		data.iPoint3	= iPoint3;
		data.iGold3		= iGold3;

		res.end( JSON.stringify(data) );
	}
}

exports.SendItemUpgrade = function ( socket, res, packetMake, packetEvent, evtReceive, iOid, sMapLevel, sItemKind, iPacketIndex ) {
	//console.time( iPacketIndex );
	
	var sendIndex = 0;
	var sendPacket = new Buffer( 1024 );
	sendPacket.writeInt16LE( PROC_ITEM_UPGRADE, sendIndex );		sendIndex += 2;
	sendPacket.writeInt32LE( iPacketIndex, sendIndex );				sendIndex += 4;
	sendPacket.writeInt32LE( iOid, sendIndex );						sendIndex += 4;
	sendPacket.writeInt16LE( sMapLevel, sendIndex );				sendIndex += 2;
	sendPacket.writeInt16LE( sItemKind, sendIndex );				sendIndex += 2;
	packetMake.fnSend( socket, sendPacket, sendIndex );
	
	packetEvent.fnCreateEvent( evtReceive, iPacketIndex, RecvItemUpgrade );

	function RecvItemUpgrade( recvPacket ) {
		var recvIndex = 0;
		var packetKind		= recvPacket.readInt16LE( recvIndex );		recvIndex += 2;
		var packetIndex		= recvPacket.readInt32LE( recvIndex );		recvIndex += 4;
		var sErrorCode		= recvPacket.readInt16LE( recvIndex );		recvIndex += 2;
		var sCurMapLevel	= recvPacket.readInt16LE( recvIndex );		recvIndex += 2;
		var sItemKind		= recvPacket.readInt16LE( recvIndex );		recvIndex += 2;
		var sLevel			= recvPacket.readInt16LE( recvIndex );		recvIndex += 2;
		var sValue			= recvPacket.readInt16LE( recvIndex );		recvIndex += 2;
		var iPoint			= recvPacket.readInt32LE( recvIndex );		recvIndex += 4;
		var iGold			= recvPacket.readInt32LE( recvIndex );		recvIndex += 4;
		var iRemainPoint	= recvPacket.readInt32LE( recvIndex );		recvIndex += 4;
		var iRemainGold		= recvPacket.readInt32LE( recvIndex );		recvIndex += 4;

		//console.timeEnd( iPacketIndex );
		//console.log( 'Recv:', iPacketIndex, strAccount, iOid, sMapLevel );

		var data = {};
		data.sErrorCode		= sErrorCode;
		data.sCurMapLevel	= sCurMapLevel;
		data.sItemKind		= sItemKind;
		data.sLevel			= sLevel;
		data.sValue			= sValue;
		data.iPoint			= iPoint;
		data.iGold			= iGold;
		data.iRemainPoint	= iRemainPoint;
		data.iRemainGold	= iRemainGold;

		res.end( JSON.stringify(data) );
	}
}

exports.SendGetAvatarInfo = function ( socket, res, packetMake, packetEvent, evtReceive, iPacketIndex ) {
	//console.time( iPacketIndex );
	
	var sendIndex = 0;
	var sendPacket = new Buffer( 1024 );
	sendPacket.writeInt16LE( PROC_GET_AVATAR_INFO, sendIndex );		sendIndex += 2;
	sendPacket.writeInt32LE( iPacketIndex, sendIndex );				sendIndex += 4;
	packetMake.fnSend( socket, sendPacket, sendIndex );
	
	packetEvent.fnCreateEvent( evtReceive, iPacketIndex, RecvGetAvatarInfo );

	function RecvGetAvatarInfo( recvPacket ) {
		var recvIndex = 0;
		var packetKind		= recvPacket.readInt16LE( recvIndex );		recvIndex += 2;
		var packetIndex		= recvPacket.readInt32LE( recvIndex );		recvIndex += 4;
		
		var data = [];
		
		var sCount			= recvPacket.readInt16LE( recvIndex );		recvIndex += 2;
		for( var i = 0; i < sCount; ++i ) {
			var sIndex		= recvPacket.readInt16LE( recvIndex );		recvIndex += 2;
			var sAvatarNum	= recvPacket.readInt16LE( recvIndex );		recvIndex += 2;
			var sKind		= recvPacket.readInt16LE( recvIndex );		recvIndex += 2;
			var iPoint		= recvPacket.readInt32LE( recvIndex );		recvIndex += 4;
			var iGold		= recvPacket.readInt32LE( recvIndex );		recvIndex += 4;
			var sSaleType	= recvPacket.readInt16LE( recvIndex );		recvIndex += 2;
			
			var tempdata = {};
			tempdata.sIndex		= sIndex;
			tempdata.sAvatarNum	= sAvatarNum;
			tempdata.sKind		= sKind;
			tempdata.iPoint		= iPoint;
			tempdata.iGold		= iGold;
			tempdata.sSaleType	= sSaleType;
			
			data[i] = tempdata;
		}

		//console.timeEnd( iPacketIndex );
		//console.log( 'Recv:', iPacketIndex, sCount );

		res.end( JSON.stringify(data) );
	}
}

exports.SendGetFishInfo = function ( socket, res, packetMake, packetEvent, evtReceive, iPacketIndex ) {
	//console.time( iPacketIndex );
	
	var sendIndex = 0;
	var sendPacket = new Buffer( 1024 );
	sendPacket.writeInt16LE( PROC_GET_FISH_INFO, sendIndex );		sendIndex += 2;
	sendPacket.writeInt32LE( iPacketIndex, sendIndex );				sendIndex += 4;
	packetMake.fnSend( socket, sendPacket, sendIndex );
	
	packetEvent.fnCreateEvent( evtReceive, iPacketIndex, RecvGetFishInfo );

	function RecvGetFishInfo( recvPacket ) {
		var recvIndex = 0;
		var packetKind		= recvPacket.readInt16LE( recvIndex );		recvIndex += 2;
		var packetIndex		= recvPacket.readInt32LE( recvIndex );		recvIndex += 4;
		
		var data = [];
		
		var sCount			= recvPacket.readInt16LE( recvIndex );		recvIndex += 2;
		for( var i = 0; i < sCount; ++i ) {
			var sFid			= recvPacket.readInt16LE( recvIndex );		recvIndex += 2;
			var sFishLevel		= recvPacket.readInt16LE( recvIndex );		recvIndex += 2;
			var sMinSize		= recvPacket.readInt16LE( recvIndex );		recvIndex += 2;
			var sMaxSize		= recvPacket.readInt16LE( recvIndex );		recvIndex += 2;
			var sLenFishName	= recvPacket.readInt16LE( recvIndex );		recvIndex += 2;
			
			var strFishName = new Buffer( sLenFishName );
			recvPacket.copy( strFishName, 0, recvIndex, recvIndex + sLenFishName );		recvIndex += sLenFishName;
			
			var tempdata = {};
			tempdata.sFid			= sFid;
			tempdata.sFishLevel		= sFishLevel;
			tempdata.sMinSize		= sMinSize;
			tempdata.sMaxSize		= sMaxSize;
			tempdata.strFishName	= strFishName;
			
			data[i] = tempdata;
		}

		//console.timeEnd( iPacketIndex );
		//console.log( 'Recv:', iPacketIndex, sCount );

		res.end( JSON.stringify(data) );
	}
}

exports.SendGetFishPosInfo = function ( socket, res, packetMake, packetEvent, evtReceive, sMapLevel, iPacketIndex ) {
	//console.time( iPacketIndex );
	
	var sendIndex = 0;
	var sendPacket = new Buffer( 1024 );
	sendPacket.writeInt16LE( PROC_GET_FISHPOS_INFO, sendIndex );	sendIndex += 2;
	sendPacket.writeInt32LE( iPacketIndex, sendIndex );				sendIndex += 4;
	sendPacket.writeInt16LE( sMapLevel, sendIndex );				sendIndex += 2;
	packetMake.fnSend( socket, sendPacket, sendIndex );
	
	packetEvent.fnCreateEvent( evtReceive, iPacketIndex, RecvGetFishPosInfo );

	function RecvGetFishPosInfo( recvPacket ) {
		var recvIndex = 0;
		var packetKind		= recvPacket.readInt16LE( recvIndex );		recvIndex += 2;
		var packetIndex		= recvPacket.readInt32LE( recvIndex );		recvIndex += 4;
		
		var data = [];
		
		var sCount			= recvPacket.readInt16LE( recvIndex );		recvIndex += 2;

		for( var i = 0; i < sCount; ++i ) {
			var sIndex			= recvPacket.readInt16LE( recvIndex );		recvIndex += 2;
			var sFid			= recvPacket.readInt16LE( recvIndex );		recvIndex += 2;
			var sDepth			= recvPacket.readInt16LE( recvIndex );		recvIndex += 2;
			var sMoveSpeed		= recvPacket.readInt16LE( recvIndex );		recvIndex += 2;
			
			var tempdata = {};
			tempdata.sIndex		= sIndex;
			tempdata.sFid		= sFid;
			tempdata.sDepth		= sDepth;
			tempdata.sMoveSpeed	= sMoveSpeed;
			
			data[i] = tempdata;
		}

		//console.timeEnd( iPacketIndex );
		//console.log( 'Recv:', iPacketIndex, sCount );

		res.end( JSON.stringify(data) );
	}
}

exports.SendGetMapClearInfo = function ( socket, res, packetMake, packetEvent, evtReceive, iPacketIndex ) {
	//console.time( iPacketIndex );
	
	var sendIndex = 0;
	var sendPacket = new Buffer( 1024 );
	sendPacket.writeInt16LE( PROC_GET_MAPCLEAR_INFO, sendIndex );	sendIndex += 2;
	sendPacket.writeInt32LE( iPacketIndex, sendIndex );				sendIndex += 4;
	packetMake.fnSend( socket, sendPacket, sendIndex );
	
	packetEvent.fnCreateEvent( evtReceive, iPacketIndex, RecvGetMapClearInfo );

	function RecvGetMapClearInfo( recvPacket ) {
		var recvIndex = 0;
		var packetKind		= recvPacket.readInt16LE( recvIndex );		recvIndex += 2;
		var packetIndex		= recvPacket.readInt32LE( recvIndex );		recvIndex += 4;
		
		var data = [];
		
		var sCount			= recvPacket.readInt16LE( recvIndex );		recvIndex += 2;

		for( var i = 0; i < sCount; ++i ) {
			var sMapLevel		= recvPacket.readInt16LE( recvIndex );		recvIndex += 2;
			var sFid			= recvPacket.readInt16LE( recvIndex );		recvIndex += 2;
			
			var tempdata = {};
			tempdata.sMapLevel	= sMapLevel;
			tempdata.sFid		= sFid;
			
			data[i] = tempdata;
		}

		//console.timeEnd( iPacketIndex );
		//console.log( 'Recv:', iPacketIndex, sCount );

		res.end( JSON.stringify(data) );
	}
}

exports.SendGetFishDataByOid = function ( socket, res, packetMake, packetEvent, evtReceive, iOid, iPacketIndex ) {
	//console.time( iPacketIndex );
	
	var sendIndex = 0;
	var sendPacket = new Buffer( 1024 );
	sendPacket.writeInt16LE( PROC_GET_FISHDATA_BYOID, sendIndex );	sendIndex += 2;
	sendPacket.writeInt32LE( iPacketIndex, sendIndex );				sendIndex += 4;
	sendPacket.writeInt32LE( iOid, sendIndex );						sendIndex += 4;
	packetMake.fnSend( socket, sendPacket, sendIndex );
	
	packetEvent.fnCreateEvent( evtReceive, iPacketIndex, RecvGetFishDataByOid );

	function RecvGetFishDataByOid( recvPacket ) {
		var recvIndex = 0;
		var packetKind		= recvPacket.readInt16LE( recvIndex );		recvIndex += 2;
		var packetIndex		= recvPacket.readInt32LE( recvIndex );		recvIndex += 4;
		var iOid			= recvPacket.readInt32LE( recvIndex );		recvIndex += 4;
		var iCount			= recvPacket.readInt32LE( recvIndex );		recvIndex += 4;
		
		var data = [];
		
		for( var i = 0; i < iCount; ++i ) {
			var sFid			= recvPacket.readInt16LE( recvIndex );		recvIndex += 2;
			var sSize			= recvPacket.readInt16LE( recvIndex );		recvIndex += 2;
			
			var tempdata = {};
			tempdata.sFid	= sFid;
			tempdata.sSize	= sSize;
			
			data[i] = tempdata;
		}
		
		//console.timeEnd( iPacketIndex );
		//console.log( 'Recv:', iPacketIndex );

		res.end( JSON.stringify(data) );
	}
}

exports.SendGetFishDataByFid = function ( socket, res, packetMake, packetEvent, evtReceive, iOid, sFid, iPacketIndex ) {
	//console.time( iPacketIndex );
	
	var sendIndex = 0;
	var sendPacket = new Buffer( 1024 );
	sendPacket.writeInt16LE( PROC_GET_FISHDATA_BYFID, sendIndex );	sendIndex += 2;
	sendPacket.writeInt32LE( iPacketIndex, sendIndex );				sendIndex += 4;
	sendPacket.writeInt32LE( iOid, sendIndex );						sendIndex += 4;
	sendPacket.writeInt16LE( sFid, sendIndex );						sendIndex += 2;
	packetMake.fnSend( socket, sendPacket, sendIndex );
	
	packetEvent.fnCreateEvent( evtReceive, iPacketIndex, RecvGetFishDataByFid );

	function RecvGetFishDataByFid( recvPacket ) {
		var recvIndex = 0;
		var packetKind		= recvPacket.readInt16LE( recvIndex );		recvIndex += 2;
		var packetIndex		= recvPacket.readInt32LE( recvIndex );		recvIndex += 4;
		var iOid			= recvPacket.readInt32LE( recvIndex );		recvIndex += 4;
		var sSize			= recvPacket.readInt16LE( recvIndex );		recvIndex += 2;

		//console.timeEnd( iPacketIndex );
		//console.log( 'Recv:', iPacketIndex );

		var data = {};
		data.sFid = sFid;
		data.iOid = iOid;
		data.sSize = sSize;

		res.end( JSON.stringify(data) );
	}
}

exports.SendCompleteFish = function ( socket, res, packetMake, packetEvent, evtReceive, iOid, sIndex, sFid, iPacketIndex ) {
	//console.time( iPacketIndex );
	
	var sendIndex = 0;
	var sendPacket = new Buffer( 1024 );
	sendPacket.writeInt16LE( PROC_COMPLETE_FISH, sendIndex );		sendIndex += 2;
	sendPacket.writeInt32LE( iPacketIndex, sendIndex );				sendIndex += 4;
	sendPacket.writeInt32LE( iOid, sendIndex );						sendIndex += 4;
	sendPacket.writeInt16LE( sIndex, sendIndex );					sendIndex += 2;
	sendPacket.writeInt16LE( sFid, sendIndex );						sendIndex += 2;
	packetMake.fnSend( socket, sendPacket, sendIndex );
	
	packetEvent.fnCreateEvent( evtReceive, iPacketIndex, RecvCompleteFish );

	function RecvCompleteFish( recvPacket ) {
		var recvIndex = 0;
		var packetKind		= recvPacket.readInt16LE( recvIndex );		recvIndex += 2;
		var packetIndex		= recvPacket.readInt32LE( recvIndex );		recvIndex += 4;
		var sErrorCode		= recvPacket.readInt16LE( recvIndex );		recvIndex += 2;
		var sFid			= recvPacket.readInt16LE( recvIndex );		recvIndex += 2;
		var sSize			= recvPacket.readInt16LE( recvIndex );		recvIndex += 2;

		//console.timeEnd( iPacketIndex );
		//console.log( 'Recv:', iPacketIndex );

		var data = {};
		data.sErrorCode = sErrorCode;
		data.sFid = sFid;
		data.sSize = sSize;

		res.end( JSON.stringify(data) );
	}
}

exports.SendReloadAvatarInfo = function ( socket, res, packetMake, packetEvent, evtReceive, iPacketIndex ) {
	//console.time( iPacketIndex );
	
	var sendIndex = 0;
	var sendPacket = new Buffer( 1024 );
	sendPacket.writeInt16LE( PROC_RELOAD_AVATAR_INFO, sendIndex );	sendIndex += 2;
	sendPacket.writeInt32LE( iPacketIndex, sendIndex );				sendIndex += 4;
	packetMake.fnSend( socket, sendPacket, sendIndex );
	
	packetEvent.fnCreateEvent( evtReceive, iPacketIndex, RecvReloadAvatarInfo );

	function RecvReloadAvatarInfo( recvPacket ) {
		var recvIndex = 0;
		var packetKind		= recvPacket.readInt16LE( recvIndex );		recvIndex += 2;
		var packetIndex		= recvPacket.readInt32LE( recvIndex );		recvIndex += 4;
		var sResult			= recvPacket.readInt16LE( recvIndex );		recvIndex += 2;

		//console.timeEnd( iPacketIndex );
		//console.log( 'Recv:', iPacketIndex );

		var data = {};
		data.sResult = sResult

		res.end( JSON.stringify(data) );
	}
}

exports.SendReloadFishInfo = function ( socket, res, packetMake, packetEvent, evtReceive, iPacketIndex ) {
	//console.time( iPacketIndex );
	
	var sendIndex = 0;
	var sendPacket = new Buffer( 1024 );
	sendPacket.writeInt16LE( PROC_RELOAD_FISH_INFO, sendIndex );	sendIndex += 2;
	sendPacket.writeInt32LE( iPacketIndex, sendIndex );				sendIndex += 4;
	packetMake.fnSend( socket, sendPacket, sendIndex );
	
	packetEvent.fnCreateEvent( evtReceive, iPacketIndex, RecvReloadFishInfo );

	function RecvReloadFishInfo( recvPacket ) {
		var recvIndex = 0;
		var packetKind		= recvPacket.readInt16LE( recvIndex );		recvIndex += 2;
		var packetIndex		= recvPacket.readInt32LE( recvIndex );		recvIndex += 4;
		var sResult			= recvPacket.readInt16LE( recvIndex );		recvIndex += 2;

		//console.timeEnd( iPacketIndex );
		//console.log( 'Recv:', iPacketIndex );

		var data = {};
		data.sResult = sResult

		res.end( JSON.stringify(data) );
	}
}

exports.SendReloadFishPosInfo = function ( socket, res, packetMake, packetEvent, evtReceive, iPacketIndex ) {
	//console.time( iPacketIndex );
	
	var sendIndex = 0;
	var sendPacket = new Buffer( 1024 );
	sendPacket.writeInt16LE( PROC_RELOAD_FISHPOS_INFO, sendIndex );	sendIndex += 2;
	sendPacket.writeInt32LE( iPacketIndex, sendIndex );				sendIndex += 4;
	packetMake.fnSend( socket, sendPacket, sendIndex );
	
	packetEvent.fnCreateEvent( evtReceive, iPacketIndex, RecvReloadFishPosInfo );

	function RecvReloadFishPosInfo( recvPacket ) {
		var recvIndex = 0;
		var packetKind		= recvPacket.readInt16LE( recvIndex );		recvIndex += 2;
		var packetIndex		= recvPacket.readInt32LE( recvIndex );		recvIndex += 4;
		var sResult			= recvPacket.readInt16LE( recvIndex );		recvIndex += 2;

		//console.timeEnd( iPacketIndex );
		//console.log( 'Recv:', iPacketIndex );

		var data = {};
		data.sResult = sResult

		res.end( JSON.stringify(data) );
	}
}

exports.SendReloadItemInfo = function ( socket, res, packetMake, packetEvent, evtReceive, iPacketIndex ) {
	//console.time( iPacketIndex );
	
	var sendIndex = 0;
	var sendPacket = new Buffer( 1024 );
	sendPacket.writeInt16LE( PROC_RELOAD_ITEM_INFO, sendIndex );	sendIndex += 2;
	sendPacket.writeInt32LE( iPacketIndex, sendIndex );				sendIndex += 4;
	packetMake.fnSend( socket, sendPacket, sendIndex );
	
	packetEvent.fnCreateEvent( evtReceive, iPacketIndex, RecvReloadItemInfo );

	function RecvReloadItemInfo( recvPacket ) {
		var recvIndex = 0;
		var packetKind		= recvPacket.readInt16LE( recvIndex );		recvIndex += 2;
		var packetIndex		= recvPacket.readInt32LE( recvIndex );		recvIndex += 4;
		var sResult			= recvPacket.readInt16LE( recvIndex );		recvIndex += 2;

		//console.timeEnd( iPacketIndex );
		//console.log( 'Recv:', iPacketIndex );

		var data = {};
		data.sResult = sResult

		res.end( JSON.stringify(data) );
	}
}
