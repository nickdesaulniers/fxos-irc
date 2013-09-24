// initial prototype, not in use, example only
var PING_RE = /^PING :(.+)/
var socket = navigator.mozTCPSocket.open('irc.mozilla.org', 6697, {
  useSSL: true,
});

socket.onerror = function (e) {
  console.error('error');
  console.log(e.data);
};

socket.onclose = function (e) {
  console.log('close');
};

socket.ondata = function (e) {
  console.log(e.data);
  var match = e.data.match(PING_RE);
  if (match && match.length === 2) {
    socket.send('PONG :' + match[1] + '\r\n');
    console.log('sent: PONG :'+ match[1]);
  }
};

socket.onopen = function (e) {
  console.log('connected');

  socket.send('NICK fxos\r\n');
  socket.send('USER fxos_ident irc.mozilla.org bla :fxos\r\n');
  //socket.send('JOIN #pe\r\n');
  //socket.send('PRIVMSG #pe hello world');
};

