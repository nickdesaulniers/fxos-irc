var $container;
var $tabbar;

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
    userEle.value = null;
    channelsEle.value = null;

    if (host && username) {
      var client = new Client(host, username, {
        stripColors: true,
        autoConnect: false,
      });

      client.connect(function () {
        var chans = channels.split(/\s*,\s*/);
        console.log("connected", chans);

        chans.forEach(function (chan) {
          client.join(chan);
          new Tab({
            chan: chan,
            client: client,
            nick: username
          });
        });
      });
    }
  });
});

var index = 1; //start at 2

function Tab (opts) {
  this.index = ++index;
  this.card = document.createElement("x-card");
  this.tab = document.createElement("x-tabbar-tab");

  this.tab.setAttribute("target-selector", "x-deck x-card:nth-child("+this.index+")");
  this.tab.textContent = opts.chan;

  this.log = document.createElement("pre");
  this.log.textContent = "Joined " + opts.chan;
  this.log.className = "log";

  this.input = document.createElement("input");
  this.input.className = "input";

  this.submit = document.createElement("button");
  this.submit.textContent = "Send";
  this.submit.onclick = this.send.bind(this);

  this.card.appendChild(this.log)
  this.card.appendChild(this.input)
  this.card.appendChild(this.submit)

  $container.appendChild(this.card);
  $tabbar.appendChild(this.tab);

  this.client = opts.client;
  this.chan = opts.chan;
  this.nick = opts.nick;

  this.client.addListener("message"+opts.chan, this.onMessage.bind(this));
}

function timestamp () {
  return (new Date).toTimeString().substr(0, 5);
}

Tab.prototype = {
  onMessage: function (from, data) {
    console.log(JSON.stringify(data))
    this.log.textContent += "\n " + timestamp() + " < " + from + " > " + data[1];
  },

  send: function () {
    var say = this.input.value;
    this.input.value = "";

    this.client.say(this.chan, say);
    this.log.textContent += "\n " + timestamp() + " < " + this.nick + " > " + say;
  }
}

