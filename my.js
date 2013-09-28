/* fxos-irc, an IRC client application for Mozilla's Firefox OS
 * Copyright (C) 2013  Nick Desaulniers <nick@mozilla.com>
 *
 * This file incorporates work covered by the following copyright and
 * permission notice:
 *
 * Copyright (c) 2010, Martyn Smith
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

var $container;
var $tabbar;

var clients = {};
var privMSG = {};

var entityMap = {
  "&": "&amp;",
  "<": "&lt;",
  ">": "&gt;",
  '"': '&quot;',
  "'": '&#39;'
};

function escapeHtml (string) {
  if (string === null || string === undefined) {
    return string;
  }

  return String(string).replace(/[&<>"']/g, function (s) {
    return entityMap[s];
  });
}

document.addEventListener("DOMContentLoaded", function () {
  var $ = document.getElementById.bind(document);

  $container = $("container");
  $tabbar = $("tabbar");

  if (localStorage.nick) {
    $("username").value = localStorage.nick;
  }

  $("connect").addEventListener("click", function () {
    var hostEle = $("host");
    var userEle = $("username");
    var channelsEle = $("channels");

    var host = hostEle.value;
    var username = userEle.value;
    var channels = channelsEle.value;

    localStorage.nick = username;

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
          if (chan[0] !== "#") {
            chan = "#" + chan;
          }
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

      client.addListener('pm', function (from, text, message) {
        if (!(from in privMSG)) {
          privMSG[from] = new Tab({
            chan: from,
            client: client,
            nick: username,
            host: host
          });
        }
        privMSG[from].addText(from, text);
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
  "#c0392b",
];

function Tab (opts) {
  var host = opts.host.replace(/\./g, "-");

  this.card = document.createElement("x-card");
  this.card.id = "__" + opts.chan.substr(1);
  this.card.className = host;

  var color = FlatUIColors[FlatUIColors.length * Math.random() | 0];
  this.card.style.backgroundColor = color;
  this.tab = document.createElement("x-tabbar-tab");

  this.tab.setAttribute("target-selector", "x-deck x-card#" + this.card.id);
  this.tab.textContent = opts.chan;
  this.tab.style.backgroundColor = color;
  this.tab.className = host;

  this.log = document.createElement("div");
  this.log.className = "chat";
  this.log.onclick = this.openPrivate.bind(this);

  this.input = document.createElement("input");
  this.input.className = "send";
  this.input.placeholder = "Type here then press <Enter> to send";
  this.input.onkeyup = this.send.bind(this);

  this.card.appendChild(this.log);
  this.card.appendChild(this.input);

  $container.appendChild(this.card);
  $tabbar.appendChild(this.tab);

  this.client = opts.client;
  this.chan = opts.chan;
  this.nick = opts.nick;
  this.host = opts.host;

  this.client.addListener("message" + opts.chan, this.onMessage.bind(this));

  this.addText(this.nick, "Joined " + opts.chan, "status");
}

Tab.prototype = {
  onMessage: function (from, data) {
    this.addText(from, data);
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

    var escapeText = escapeHtml(text);
    escapeText = escapeText.replace(/(http(s)?:\/\/[^ '"\n<>\]\[\*!@\(\)]+)/g, "<a href='$1' target='_blank'>$1</a>");

    var html = timestamp + " &lt; <a href='#"+user+"'>" + user + "</a> &gt; " + escapeText;
    p.innerHTML = html;

    if (user === this.nick) {
      p.classList.add("mine");
    }

    if (type) {
      p.classList.add(type)
    }

    this.log.appendChild(p);
    this.log.scrollTop = this.log.scrollHeight;
  },

  openPrivate: function (e) {
    console.log("CLICKED")
    if (e.target.tagName === "A") {
      var name = e.target.textContent;

      privMSG[name] = new Tab({
        chan: name,
        client: this.client,
        nick: this.nick,
        host: this.host
      });
    }
  }
}

