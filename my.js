document.addEventListener('DOMContentLoaded', function () {
  var $ = document.getElementById.bind(document);
  $('connect').addEventListener('click', function () {
    var hostEle = $('host');
    var userEle = $('username');
    var host = hostEle.value;
    var username = userEle.value;
    hostEle.value = null;
    userEle.value = null;
    if (host && username) {
      var client = new Client(host, username, {
        stripColors: true,
        autoConnect: false,
      });
      client.connect(function () {
        console.log('connected');
        client.join('#pe');
      });
    }
  });
});
/*var client = new Client('irc.mozilla.org', 'fxos', {
  channels: ['#pe'],
});*/
