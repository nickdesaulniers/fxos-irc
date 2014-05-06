var tabCounter = 0;
var FlatUIColors = [
  "#1abc9c",
  "#40d47e",
  "#3498db",
  "#9b59b6",
  "#34495e",
  "#16a085",
  "#27ae60",
  "#2980b9",
  "#8e44ad",
  "#2c3e50",
  "#f1c40f",
  "#e67e22",
  "#e74c3c",
  "#f39c12",
  "#d35400",
  "#c0392b",
];

function Tab (opts) {
  var host = opts.host.replace(/\./g, "-");
  var color = FlatUIColors[FlatUIColors.length * Math.random() | 0];

  var card = document.createElement("x-card");
  card.id = "__" + tabCounter++;
  card.classList.add(host);
  card.style.backgroundColor = color;
  card.addEventListener("show", function () {
    if (this.tab.classList.contains("glow")) {
      this.tab.classList.remove("glow");
    }
  }.bind(this));

  var tab = document.createElement("x-tabbar-tab");
  tab.setAttribute("target-selector", "x-deck x-card#" + card.id);
  tab.textContent = opts.chan;
  tab.style.backgroundColor = color;
  tab.className = host;

  var log = document.createElement("div");
  log.className = "chat";
  log.onclick = this.openPrivate.bind(this);

  var input = document.createElement("input");
  input.className = "send";
  input.placeholder = document.webL10n.get("enter");
  input.onkeyup = this.send.bind(this);

  var flipbox = document.createElement("x-flipbox");

  var controls = Tab.addControls(
    card,
    this.doPart.bind(this),
    opts.userList ? flipbox.showBack.bind(flipbox) : null
  );

  var front = document.createElement("div");
  front.appendChild(log);
  front.appendChild(input);
  front.appendChild(controls);
  flipbox.appendChild(front);

  var backControls = Tab.addControls(card, flipbox.showFront.bind(flipbox));

  var backLog = document.createElement("div");
  backLog.className = "chat";
  backLog.onclick = this.openPrivate.bind(this);

  var back = document.createElement("div");
  back.style.backgroundColor = color;
  back.appendChild(backLog);
  back.appendChild(backControls);
  flipbox.appendChild(back);

  card.appendChild(flipbox);

  document.getElementById("container").appendChild(card);
  document.getElementById("tabbar").appendChild(tab);

  this.client = opts.client;
  this.nick = opts.nick;
  this.host = opts.host;
  this.card = card;
  this.tab = tab;
  this.log = log;
  this.input = input;

  var joinStr = null;
  if (opts.chan) {
    this.chan = opts.chan;
    this.client.addListener("message" + opts.chan, this.onMessage.bind(this));
    joinStr = document.webL10n.get("join", { channel: opts.chan });
    this.addText(this.nick, joinStr, "status");
  }

  this.client.addListener("names" + opts.chan, function (nicks) {
    var frag = document.createDocumentFragment();
    Object.keys(nicks).forEach(function (nick) {
      frag.appendChild(this.addNick(nick));
    }.bind(this));
    backLog.appendChild(frag);
  }.bind(this));
};

Tab.addControls = function (card, onClose, onUserList) {
  var controls = document.createElement("div");
  controls.className = "part";
  controls.style.backgroundColor = card.style.backgroundColor;

  var userList = null;
  if (typeof onUserList === "function") {
    userList = document.createElement("img");
    userList.src = "images/user.png";
    userList.onclick = onUserList;
    controls.appendChild(userList);
  }

  var part = document.createElement("img");
  part.src = "images/close.png";
  part.onclick = onClose;
  controls.appendChild(part);

  return controls;
};

Tab.prototype = {
  onMessage: function (from, data) {
    if (document.getElementById("container").selectedCard.id !== this.card.id &&
        !this.tab.classList.contains("glow")) {
      this.tab.classList.add("glow");
    }
    this.addText(from, Utf8.decode(data));
  },

  send: function (e) {
    var say = this.input.value;
    if (e.keyCode === 13 && say) {
      this.input.value = null;
      this.addText(this.nick, say);
      this.client.say(this.chan, Utf8.encode(say));
    }
  },

  addText: function (user, text, type, target) {
    var timestamp = (new Date).toTimeString().substr(0, 5);
    var p = null;

    var escapeText = this.escapeHtml(text);
    escapeText = escapeText.replace(/(http(s)?:\/\/[^ '"\n<>\]\[\*!@\(\)]+)/g, "<a href='$1' target='_blank'>$1</a>");

    if (type) {
      p = document.createElement("p");
      p.classList.add(type);
      p.appendChild(document.createTextNode(timestamp + " < " + escapeText));
    } else {
      p = this.addNick(user);
      p.insertBefore(document.createTextNode(timestamp), p.firstChild);
      p.innerHTML += escapeText;
    }

    target = target || this.log;
    target.appendChild(p);
    target.scrollTop = target.scrollHeight;
  },

  addNick: function (nick) {
    var open = document.createTextNode(" < ");
    var close = document.createTextNode(" > ");
    var text = document.createTextNode(nick);
    var p = document.createElement("p");
    var a = null;
    p.appendChild(open);
    if (nick !== this.nick) {
      a = document.createElement("a");
      a.href = "#" + nick;
      a.appendChild(text);
      p.appendChild(a);
    } else {
      p.appendChild(text);
    }
    p.appendChild(close);
    return p;
  },

  openPrivate: function (e) {
    if (e.target.tagName === "A" && !e.target.target) {
      var name = e.target.textContent;
      e.preventDefault();

      if (!privMSG[name] && name !== this.nick) {
        privMSG[name] = new Tab({
          chan: name,
          client: this.client,
          nick: this.nick,
          host: this.host,
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
    document.getElementById("container").showCard(0);
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

