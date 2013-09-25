var $container;
var $tabbar;

document.addEventListener("DOMContentLoaded", function () {
  var $ = document.getElementById.bind(document);

  $container = $("container");
  $tabbar = $("tabbar");

  $("connect").addEventListener("click", function () {
    var hostEle = $("host");
    var userEle = $("username");
    //var channelsEle = $("channels");

    var host = hostEle.value;
    var username = userEle.value;
    //var channels = channelsEle.value;

    hostEle.value = null;
    userEle.value = null;
    //channelsEle.value = null;

    if (host && username) {
      var client = new Client(host, username, {
        stripColors: true,
        autoConnect: false,
      });

      client.connect(function () {
        console.log('client connected');
        var div = document.createElement("div");
        div.id = "__" + host;
        var disconnect = document.createElement("button");
        disconnect.textContent = "-";
        disconnect.onclick = function () {
          client.disconnect(function () {
            console.log('client disconnected');
            var listing = $("__" + host);
            listing.parentElement.removeChild(listing);
          });
        };
        div.textContent = host;
        div.appendChild(disconnect);
        $("hostlist").appendChild(div);
        //var chans = channels.split(/\s*,\s*/);

        /*chans.forEach(function (chan) {
          client.join(chan, function () {
            new Tab({
              chan: chan,
              client: client,
              nick: username,
            });
          });
        });*/
      });
    }
  });
});

function Tab (opts) {
  this.card = document.createElement("x-card");
  this.card.id = "__" + opts.chan.substr(1);
  // http://www.paulirish.com/2009/random-hex-color-code-snippets/#comment-931662323
  this.card.style.backgroundColor = "#" + (Math.random().toString(16) + '000000').slice(2, 8);
  this.tab = document.createElement("x-tabbar-tab");

  this.tab.setAttribute("target-selector", "x-deck x-card#" + this.card.id);
  this.tab.textContent = opts.chan;

  this.log = document.createElement("div");
  this.log.className = "chat";

  this.input = document.createElement("input");
  this.input.className = "send";
  this.input.placeholder = "Type here then press <Enter> to send";
  this.input.onkeyup = this.send.bind(this);

  this.card.appendChild(this.log)
  this.card.appendChild(this.input)

  $container.appendChild(this.card);
  $tabbar.appendChild(this.tab);

  this.client = opts.client;
  this.chan = opts.chan;
  this.nick = opts.nick;

  this.client.addListener("message" + opts.chan, this.onMessage.bind(this));

  this.addText(this.nick, "Joined " + opts.chan);
}

Tab.prototype = {
  onMessage: function (from, data) {
    this.addText(from, data[1]);
  },

  send: function (e) {
    var say = this.input.value;
    if (e.keyCode === 13 && say) {
      this.input.value = null;
      this.client.say(this.chan, say);
      this.addText(this.nick, say);
    }
  },

  addText: function (user, text) {
    var timestamp =  (new Date).toTimeString().substr(0, 5);
    var p = document.createElement("p");
    p.textContent = timestamp + " < " + user + " > " + text;
    this.log.appendChild(p);
    this.log.scrollTop = this.log.scrollHeight;
  },
}

