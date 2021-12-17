var m_connect = require( 'connect' );
var m_url = require( 'url' );

var m_webPort = 800;
var m_server = m_connect.createServer();
m_server.use( m_connect.logger('short') );
m_server.use( m_connect.query() );
m_server.use( '/GetUserData', fnPageGetUserData );
m_server.use( '/GetOidData', fnPageGetOidData );
m_server.use( '/GetMapLevelData', fnPageGetMapLevelData );
m_server.use( '/UpdateCurMapLevel', fnPageUpdateCurMapLevel );
m_server.use( '/ItemUpgrade', fnPageItemUpgrade );
m_server.use( '/GetAvatarInfo', fnPageGetAvatarInfo );
m_server.use( '/GetFishInfo', fnPageGetFishInfo );
m_server.use( '/GetFishPosInfo', fnPageGetFishPosInfo );
m_server.use( '/GetMapClearInfo', fnPageGetMapClearInfo );
m_server.use( '/GetFishDataByOid', fnPageGetFishDataByOid );
m_server.use( '/GetFishDataByFid', fnPageGetFishDataByFid );
m_server.use( '/CompleteFish', fnPageCompleteFish );

m_server.use( '/ReloadAvatarInfo', fnPageReloadAvatarInfo );
m_server.use( '/ReloadFishInfo', fnPageReloadFishInfo );
m_server.use( '/ReloadFishPosInfo', fnPageReloadFishPosInfo );
m_server.use( '/ReloadItemInfo', fnPageReloadItemInfo );

m_server.listen( m_webPort, fnWebServer );

function fnWebServer() {
	console.log( 'WebStart:', m_webPort );
}

var m_net = require( 'net' );
var m_packetEvent = require( './module/PacketEvent.js' )
var m_packetMake = require( './module/PacketMake.js' )
var m_packetProc = require( './module/PacketProc.js' )

var m_packetIndex = 0;
var m_tcpPort = 12345;
var m_tcpIp = 'xxx.yyy.com';
var m_socket = m_net.connect( m_tcpPort, m_tcpIp, fnConnect );
m_socket.on( 'data', fnReceive );

var m_evtReceive = new process.EventEmitter();
m_evtReceive.setMaxListeners( 0 );

function fnConnect() {
	console.log( 'Server Connected:', m_tcpIp, m_tcpPort );
	
	setInterval( fnKeepAlive, 1000 );

	function fnKeepAlive() {
		m_packetProc.SendKeepAlive( m_socket, m_packetMake, m_packetEvent, m_evtReceive, fnGetPacketIndex() );
	}
}

function fnReceive( data ) {
	m_packetMake.fnReceive( data, m_evtReceive );
}

function fnGetPacketIndex() {
	if( m_packetIndex < 10 * 10000 * 10000 )	m_packetIndex += 1;
	else										m_packetIndex = 0;
	return m_packetIndex;
}

function fnPageGetUserData( req, res ) {
	var strAccount = req.query.account;
	if (strAccount == undefined || strAccount.length <= 0) return res.end( 'error strAccount is invalid' );
	
	m_packetProc.SendGetUserData( m_socket, res, m_packetMake, m_packetEvent, m_evtReceive, strAccount, fnGetPacketIndex() );
}

function fnPageGetOidData( req, res ) {
	var iOid = req.query.oid;
	if (iOid == undefined || iOid.length <= 0) return res.end( 'error iOid is invalid' );

	var strAccountList = req.query.accountlist;
	if (strAccountList == undefined || strAccountList.length <= 0) return res.end( 'error strAccountList is invalid' );
	
	m_packetProc.SendGetOidData( m_socket, res, m_packetMake, m_packetEvent, m_evtReceive, iOid, strAccountList, fnGetPacketIndex() );
}

function fnPageGetMapLevelData( req, res ) {
	var iOid = req.query.oid;
	if (iOid == undefined || iOid.length <= 0) return res.end( 'error iOid is invalid' );
	
	m_packetProc.SendGetMapLevelData( m_socket, res, m_packetMake, m_packetEvent, m_evtReceive, iOid, fnGetPacketIndex() );
}

function fnPageUpdateCurMapLevel( req, res ) {
	var iOid = req.query.oid;
	if (iOid == undefined || iOid.length <= 0) return res.end( 'error iOid is invalid' );

	var sMapLevel = req.query.maplevel;
	if (sMapLevel == undefined || sMapLevel.length <= 0) return res.end( 'error iOid is invalid' );
	
	m_packetProc.SendUpdateCurMapLevel( m_socket, res, m_packetMake, m_packetEvent, m_evtReceive, iOid, sMapLevel, fnGetPacketIndex() );
}

function fnPageItemUpgrade( req, res ) {
	var iOid = req.query.oid;
	if (iOid == undefined || iOid.length <= 0) return res.end( 'error iOid is invalid' );

	var sMapLevel = req.query.maplevel;
	if (sMapLevel == undefined || sMapLevel.length <= 0) return res.end( 'error sMapLevel is invalid' );
	
	var sItemKind = req.query.kind;
	if (sItemKind == undefined || sItemKind.length <= 0) return res.end( 'error sItemKind is invalid' );
	
	m_packetProc.SendItemUpgrade( m_socket, res, m_packetMake, m_packetEvent, m_evtReceive, iOid, sMapLevel, sItemKind, fnGetPacketIndex() );
}

function fnPageGetAvatarInfo( req, res ) {
	m_packetProc.SendGetAvatarInfo( m_socket, res, m_packetMake, m_packetEvent, m_evtReceive, fnGetPacketIndex() );
}

function fnPageGetFishInfo( req, res ) {
	m_packetProc.SendGetFishInfo( m_socket, res, m_packetMake, m_packetEvent, m_evtReceive, fnGetPacketIndex() );
}

function fnPageGetFishPosInfo( req, res ) {
	var sMapLevel = req.query.maplevel;
	if (sMapLevel == undefined || sMapLevel.length <= 0) return res.end( 'error sMapLevel is invalid' );

	m_packetProc.SendGetFishPosInfo( m_socket, res, m_packetMake, m_packetEvent, m_evtReceive, sMapLevel, fnGetPacketIndex() );
}

function fnPageGetMapClearInfo( req, res ) {
	m_packetProc.SendGetMapClearInfo( m_socket, res, m_packetMake, m_packetEvent, m_evtReceive, fnGetPacketIndex() );
}

function fnPageGetFishDataByOid( req, res ) {
	var iOid = req.query.oid;
	if (iOid == undefined || iOid.length <= 0) return res.end( 'error iOid is invalid' );

	m_packetProc.SendGetFishDataByOid( m_socket, res, m_packetMake, m_packetEvent, m_evtReceive, iOid, fnGetPacketIndex() );
}

function fnPageGetFishDataByFid( req, res ) {
	var iOid = req.query.oid;
	if (iOid == undefined || iOid.length <= 0) return res.end( 'error iOid is invalid 1' );

	var sFid = req.query.fid;
	if (sFid == undefined || sFid.length <= 0) return res.end( 'error sFid is invalid' );

	m_packetProc.SendGetFishDataByFid( m_socket, res, m_packetMake, m_packetEvent, m_evtReceive, iOid, sFid, fnGetPacketIndex() );
}

function fnPageCompleteFish( req, res ) {
	var iOid = req.query.oid;
	if (iOid == undefined || iOid.length <= 0) return res.end( 'error iOid is invalid' );

	var sIndex = req.query.index;
	if (sIndex == undefined || sIndex.length <= 0) return res.end( 'error sIndex is invalid' );

	var sFid = req.query.fid;
	if (sFid == undefined || sFid.length <= 0) return res.end( 'error sFid is invalid' );

	m_packetProc.SendCompleteFish( m_socket, res, m_packetMake, m_packetEvent, m_evtReceive, iOid, sIndex, sFid, fnGetPacketIndex() );
}

function fnPageReloadAvatarInfo( req, res ) {
	m_packetProc.SendReloadAvatarInfo( m_socket, res, m_packetMake, m_packetEvent, m_evtReceive, fnGetPacketIndex() );
}

function fnPageReloadFishInfo( req, res ) {
	m_packetProc.SendReloadFishInfo( m_socket, res, m_packetMake, m_packetEvent, m_evtReceive, fnGetPacketIndex() );
}

function fnPageReloadFishPosInfo( req, res ) {
	m_packetProc.SendReloadFishPosInfo( m_socket, res, m_packetMake, m_packetEvent, m_evtReceive, fnGetPacketIndex() );
}

function fnPageReloadItemInfo( req, res ) {
	m_packetProc.SendReloadItemInfo( m_socket, res, m_packetMake, m_packetEvent, m_evtReceive, fnGetPacketIndex() );
}
