var $container;
var $tabbar;

var clients = {};

document.addEventListener("DOMContentLoaded", function () {
  var $ = document.getElementById.bind(document);

  $container = $("container");
  $tabbar = $("tabbar");

  $("connect").addEventListener("click", function () {
    var hostEle = $("host");
    var userEle = $("username");
    var channelsEle = $("channels");

    var host = hostEle.value;
    var username = userEle.value;
    var channels = channelsEle.value;

    hostEle.value = null;
    channelsEle.value = null;

    if (host && username) {
      // cache clients by host
      if (!clients[host]) {
        clients[host] = new Client(host, username, {
          stripColors: true,
          autoConnect: false,
        });
      }

      var client = clients[host];

      $("loading").style.display = "block";
      client.connect(function () {
        console.log('client connected');
        $("loading").style.display = "none";
        
        var div = document.createElement("div");
        div.id = "__" + host;

        var disconnect = document.createElement("button");
        disconnect.textContent = "-";

        disconnect.onclick = function () {
          client.disconnect(function () {
            console.log('client disconnected');
            var listing = $("__" + host);
            delete clients[host];
            listing.parentElement.removeChild(listing);

            // remove tabs and cards for all chans on that host
            var nodes = document.querySelectorAll("." + host.replace(/\./g, "-"));
            for (var i = 0; i < nodes.length; ++i) {
              var el = nodes[i];
              el.parentNode.removeChild(el)
            }
          });
        };

        div.textContent = host;
        div.appendChild(disconnect);
        div.onclick = function () {
          hostEle.value = host;
        };
        $("hostlist").appendChild(div);

        var chans = channels.split(/\s*,\s*/);

        chans.forEach(function (chan) {
          client.join(chan, function () {
            console.log("Joined", chan)
            new Tab({
              chan: chan,
              client: client,
              nick: username,
              host: host
            });
          });
        });
      });
    }
  });
});

var FlatUIColors = [
  "#1abc9c",
  "#2ecc71",
  "#3498db",
  "#9b59b6",
  "#34495e",
  "#f1c40f",
  "#e67e22",
  "#c0392b"
];

function Tab (opts) {
  this.card = document.createElement("x-card");
  this.card.id = "__" + opts.chan.substr(1);
  this.card.className = opts.host.replace(/\./g, "-");
  console.log("TAB HOST", opts.host.replace(/\./g, "-"))

  var color = FlatUIColors[FlatUIColors.length * Math.random() | 0];
  this.card.style.backgroundColor = color;
  this.tab = document.createElement("x-tabbar-tab");

  this.tab.setAttribute("target-selector", "x-deck x-card#" + this.card.id);
  this.tab.textContent = opts.chan;
  this.tab.style.backgroundColor = color;
  this.tab.className = opts.host.replace(/\./g, "-");

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

  this.addText(this.nick, "Joined " + opts.chan, "status");
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

  addText: function (user, text, type) {
    var timestamp =  (new Date).toTimeString().substr(0, 5);
    var p = document.createElement("p");
    p.textContent = timestamp + " < " + user + " > " + text;
    
    if (user === this.nick) { 
      p.classList.add("mine");
    }

    if (type) {
      p.classList.add(type)
    }

    this.log.appendChild(p);
    this.log.scrollTop = this.log.scrollHeight;
  },
}

