/* fxos-irc, an IRC client application for Mozilla's Firefox OS
 * Copyright (C) 2013  Nick Desaulniers <nick@mozilla.com>
 *
 * This file incorporates work covered by the following copyright and
 * permission notice:
 *
 * Copyright (c) 2010, Martyn Smith
 * Copyright (c) 2011-2013, Fabien Cazenave
 * Copyright (c) 2013, Yusuke Kamiyamane
 * Copyright (c) 2013, Mark James
 * Copyright (c) 2013, Mozilla Corporation
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

var clients = {};
var privMSG = {};

var $ = document.getElementById.bind(document);

function joinChans (channels, client, username, host) {
  channels.split(/\s*,\s*/).forEach(function (chan) {
    chan = chan.trim();
    if (chan.length === 0) {
      return;
    }
    if (chan[0] !== "#") {
      chan = "#" + chan;
    }
    client.join(chan, function () {
      console.log("Joined ", chan);
      new Tab({
        chan: chan,
        client: client,
        nick: username,
        host: host,
      });
    });
  });
};

document.addEventListener("DOMContentLoaded", function () {
  var $advanced = $("advanced");

  $("advanced-link").onclick = function () {
    if ($advanced.style.display === "block") {
      $advanced.style.display = "none";
    } else {
      $advanced.style.display = "block";
    }
  }

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
    var port = $("port").value;
    var secure = $("secure").checked;

    localStorage.nick = username;

    hostEle.value = null;
    channelsEle.value = null;

    if (!host || !username) {
      console.error("No username or host");
      return;
    }

    // cache clients by host
    var client = clients[host];
    if (client) {
      joinChans(channels, client, username, host);
    } else {
      client = clients[host] = new Client(host, username, {
        stripColors: true,
        autoConnect: false,
        secure: secure,
        port: port || (secure ? 6697 : 6667),
        //debug: true,
      });

      $("loading").style.display = "block";
      client.connect(function () {
        console.log("client connected");
        $("loading").style.display = "none";

        var div = document.createElement("div");
        div.id = "__" + host;

        var disconnect = document.createElement("img");
        disconnect.src = "disconnect.png";
        disconnect.className = "moz-button";

        disconnect.onclick = function () {
          client.disconnect(function () {
            console.log("client disconnected");
            var listing = $("__" + host);
            delete clients[host];
            listing.parentElement.removeChild(listing);

            // remove tabs and cards for all chans on that host
            var nodes = document.querySelectorAll("." + host.replace(/\./g, "-"));
            for (var i = 0; i < nodes.length; ++i) {
              var el = nodes[i];
              el.parentNode.removeChild(el)
            }
            for (var nick in privMSG) {
              if (host === privMSG[nick].host) {
                delete privMSG[nick];
              }
            }
          });
        };

        div.appendChild(disconnect);
        div.appendChild(document.createTextNode(host));
        div.onclick = function () {
          hostEle.value = host;
        };
        $("hostlist").appendChild(div);

        joinChans(channels, client, username, host);

      });

      client.addListener("pm", function (from, text, message) {
        if (!(from in privMSG)) {
          privMSG[from] = new Tab({
            chan: from,
            client: client,
            nick: username,
            host: host,
          });
        }
        privMSG[from].addText(from, text);
      });
    }
  });
});

