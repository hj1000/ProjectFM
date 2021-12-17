var PACKET_START1 = 0xa1;
var PACKET_START2 = 0xb1;
var PACKET_END1 = 0x1a;
var PACKET_END2 = 0x1b;

exports.fnSend = function ( socket, packet, length ) {
	var index = 0;
	var buf = new Buffer( length + 2 + 2 + 2 );
	
	buf.writeUInt8( PACKET_START1, index );	index += 1;
	buf.writeUInt8( PACKET_START2, index );	index += 1;
	
	buf.writeInt16LE( length, index );		index += 2;
	packet.copy( buf, index, 0, length );	index += length;
	
	buf.writeUInt8( PACKET_END1, index );	index += 1;
	buf.writeUInt8( PACKET_END2, index );	index += 1;
	
	socket.write( buf );
}

exports.fnReceive = function ( data, evtReceive ) {
	var index = 0;
	var buf = new Buffer( data );
	
	while( index < buf.length ) {
		var start1 = buf.readUInt8( index );				index += 1;
		var start2 = buf.readUInt8( index );				index += 1;
		if( start1 != PACKET_START1 )		continue;
		if( start2 != PACKET_START2 )		continue;
		
		var packetlen = buf.readInt16LE( index );			index += 2;
		if( packetlen <= 0 )				continue;
		
		var packet = new Buffer( packetlen );
		buf.copy( packet, 0, index, index + packetlen );	index += packetlen;
		
		var end1 = buf.readUInt8( index );					index += 1;
		var end2 = buf.readUInt8( index );					index += 1;
		if( end1 != PACKET_END1 )			continue;
		if( end2 != PACKET_END2 )			continue;
		
		this.fnParse( packet, evtReceive );
	}
}

exports.fnParse = function ( recvPacket, evtReceive ) {
	var recvIndex = 0;
	var packetKind = recvPacket.readUInt16LE( recvIndex );		recvIndex += 2;
	var packetIndex = recvPacket.readUInt32LE( recvIndex );		recvIndex += 4;
	
	evtReceive.emit( packetIndex, recvPacket );
}
