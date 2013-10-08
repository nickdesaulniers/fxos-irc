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
  var $ = document.getElementById.bind(document);
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
  this.input.placeholder = document.webL10n.get("enter");
  this.input.onkeyup = this.send.bind(this);

  this.part = document.createElement("a");
  this.part.textContent = document.webL10n.get("close");
  this.part.className = "part";
  this.part.onclick = this.doPart.bind(this);
  this.part.style.backgroundColor = color;

  this.card.appendChild(this.log);
  this.card.appendChild(this.input);
  this.card.appendChild(this.part);

  $("container").appendChild(this.card);
  $("tabbar").appendChild(this.tab);

  this.client = opts.client;
  this.chan = opts.chan;
  this.nick = opts.nick;
  this.host = opts.host;

  this.client.addListener("message" + opts.chan, this.onMessage.bind(this));

  var joinStr = document.webL10n.get("join", { channel: opts.chan });
  this.addText(this.nick, joinStr, "status");
};

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
    var timestamp = (new Date).toTimeString().substr(0, 5);
    var p = document.createElement("p");
    var html = timestamp + " &lt; ";

    var escapeText = this.escapeHtml(text);
    escapeText = escapeText.replace(/(http(s)?:\/\/[^ '"\n<>\]\[\*!@\(\)]+)/g, "<a href='$1' target='_blank'>$1</a>");

    if (type) {
      p.classList.add(type);
      html += escapeText;
    } else if (user === this.nick) {
      p.classList.add("mine");
      html += user + " &gt; " + escapeText;
    } else {
      html += "<a href='#" + user + "'>" + user + "</a> &gt; " + escapeText;
    }
    p.innerHTML = html;

    this.log.appendChild(p);
    this.log.scrollTop = this.log.scrollHeight;
  },

  openPrivate: function (e) {
    if (e.target.tagName === "A" && !e.target.target) {
      var name = e.target.textContent;

      if (!privMSG[name] && name !== this.nick) {
        privMSG[name] = new Tab({
          chan: name,
          client: this.client,
          nick: this.nick,
          host: this.host
        });
      }
    }
  },

  doPart: function () {
    if (this.chan[0] === "#") {
      this.client.part(this.chan);
    } else {
      delete privMSG[this.chan];
    }
    this.card.parentNode.removeChild(this.card);
    this.tab.parentNode.removeChild(this.tab);
    $("container").shuffleTo(0);
  },

  escapeChar: function (char, i, string) {
    var entityMap = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;",
    };
    var cleaned = entityMap[char];
    return cleaned ? cleaned : char;
  },

  escapeHtml: function (string) {
    return Array.prototype.map.call(string, this.escapeChar).join("");
  },
};

