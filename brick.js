/* http://mozilla.github.io/brick/download.html?byob=deck,layout,tabbar */
window.Platform = {};
var logFlags = {};
! function() {
    function e(e) {
        if (this._element = e, e.className != this._classCache) {
            if (this._classCache = e.className, !this._classCache) return;
            var t, n = this._classCache.replace(/^\s+|\s+$/g, "").split(/\s+/);
            for (t = 0; t < n.length; t++) a.call(this, n[t])
        }
    }

    function t(e, t) {
        e.className = t.join(" ")
    }

    function n(e, t, n) {
        Object.defineProperty ? Object.defineProperty(e, t, {
            get: n
        }) : e.__defineGetter__(t, n)
    }
    if (!("undefined" == typeof window.Element || "classList" in document.documentElement)) {
        var r = Array.prototype,
            o = r.indexOf,
            i = r.slice,
            a = r.push,
            s = r.splice,
            c = r.join;
        e.prototype = {
            add: function(e) {
                this.contains(e) || (a.call(this, e), t(this._element, i.call(this, 0)))
            },
            contains: function(e) {
                return -1 !== o.call(this, e)
            },
            item: function(e) {
                return this[e] || null
            },
            remove: function(e) {
                var n = o.call(this, e); - 1 !== n && (s.call(this, n, 1), t(this._element, i.call(this, 0)))
            },
            toString: function() {
                return c.call(this, " ")
            },
            toggle: function(e) {
                -1 === o.call(this, e) ? this.add(e) : this.remove(e)
            }
        }, window.DOMTokenList = e, n(Element.prototype, "classList", function() {
            return new e(this)
        })
    }
}();
var SideTable;
if ("undefined" != typeof WeakMap && navigator.userAgent.indexOf("Firefox/") < 0 ? SideTable = WeakMap : function() {
    var e = Object.defineProperty,
        t = Date.now() % 1e9;
    SideTable = function() {
        this.name = "__st" + (1e9 * Math.random() >>> 0) + (t+++"__")
    }, SideTable.prototype = {
        set: function(t, n) {
            var r = t[this.name];
            r && r[0] === t ? r[1] = n : e(t, this.name, {
                value: [t, n],
                writable: !0
            })
        },
        get: function(e) {
            var t;
            return (t = e[this.name]) && t[0] === e ? t[1] : void 0
        },
        "delete": function(e) {
            this.set(e, void 0)
        }
    }
}(), function(e) {
    function t(e) {
        y.push(e), b || (b = !0, m(r))
    }

    function n(e) {
        return window.ShadowDOMPolyfill && window.ShadowDOMPolyfill.wrapIfNeeded(e) || e
    }

    function r() {
        b = !1;
        var e = y;
        y = [], e.sort(function(e, t) {
            return e.uid_ - t.uid_
        });
        var t = !1;
        e.forEach(function(e) {
            var n = e.takeRecords();
            o(e), n.length && (e.callback_(n, e), t = !0)
        }), t && r()
    }

    function o(e) {
        e.nodes_.forEach(function(t) {
            var n = h.get(t);
            n && n.forEach(function(t) {
                t.observer === e && t.removeTransientObservers()
            })
        })
    }

    function i(e, t) {
        for (var n = e; n; n = n.parentNode) {
            var r = h.get(n);
            if (r)
                for (var o = 0; o < r.length; o++) {
                    var i = r[o],
                        a = i.options;
                    if (n === e || a.subtree) {
                        var s = t(a);
                        s && i.enqueue(s)
                    }
                }
        }
    }

    function a(e) {
        this.callback_ = e, this.nodes_ = [], this.records_ = [], this.uid_ = ++w
    }

    function s(e, t) {
        this.type = e, this.target = t, this.addedNodes = [], this.removedNodes = [], this.previousSibling = null, this.nextSibling = null, this.attributeName = null, this.attributeNamespace = null, this.oldValue = null
    }

    function c(e) {
        var t = new s(e.type, e.target);
        return t.addedNodes = e.addedNodes.slice(), t.removedNodes = e.removedNodes.slice(), t.previousSibling = e.previousSibling, t.nextSibling = e.nextSibling, t.attributeName = e.attributeName, t.attributeNamespace = e.attributeNamespace, t.oldValue = e.oldValue, t
    }

    function u(e, t) {
        return E = new s(e, t)
    }

    function l(e) {
        return L ? L : (L = c(E), L.oldValue = e, L)
    }

    function d() {
        E = L = void 0
    }

    function f(e) {
        return e === L || e === E
    }

    function p(e, t) {
        return e === t ? e : L && f(e) ? L : null
    }

    function v(e, t, n) {
        this.observer = e, this.target = t, this.options = n, this.transientObservedNodes = []
    }
    var h = new SideTable,
        m = window.msSetImmediate;
    if (!m) {
        var _ = [],
            g = String(Math.random());
        window.addEventListener("message", function(e) {
            if (e.data === g) {
                var t = _;
                _ = [], t.forEach(function(e) {
                    e()
                })
            }
        }), m = function(e) {
            _.push(e), window.postMessage(g, "*")
        }
    }
    var b = !1,
        y = [],
        w = 0;
    a.prototype = {
        observe: function(e, t) {
            if (e = n(e), !t.childList && !t.attributes && !t.characterData || t.attributeOldValue && !t.attributes || t.attributeFilter && t.attributeFilter.length && !t.attributes || t.characterDataOldValue && !t.characterData) throw new SyntaxError;
            var r = h.get(e);
            r || h.set(e, r = []);
            for (var o, i = 0; i < r.length; i++)
                if (r[i].observer === this) {
                    o = r[i], o.removeListeners(), o.options = t;
                    break
                }
            o || (o = new v(this, e, t), r.push(o), this.nodes_.push(e)), o.addListeners()
        },
        disconnect: function() {
            this.nodes_.forEach(function(e) {
                for (var t = h.get(e), n = 0; n < t.length; n++) {
                    var r = t[n];
                    if (r.observer === this) {
                        r.removeListeners(), t.splice(n, 1);
                        break
                    }
                }
            }, this), this.records_ = []
        },
        takeRecords: function() {
            var e = this.records_;
            return this.records_ = [], e
        }
    };
    var E, L;
    v.prototype = {
        enqueue: function(e) {
            var n = this.observer.records_,
                r = n.length;
            if (n.length > 0) {
                var o = n[r - 1],
                    i = p(o, e);
                if (i) return n[r - 1] = i, void 0
            } else t(this.observer);
            n[r] = e
        },
        addListeners: function() {
            this.addListeners_(this.target)
        },
        addListeners_: function(e) {
            var t = this.options;
            t.attributes && e.addEventListener("DOMAttrModified", this, !0), t.characterData && e.addEventListener("DOMCharacterDataModified", this, !0), t.childList && e.addEventListener("DOMNodeInserted", this, !0), (t.childList || t.subtree) && e.addEventListener("DOMNodeRemoved", this, !0)
        },
        removeListeners: function() {
            this.removeListeners_(this.target)
        },
        removeListeners_: function(e) {
            var t = this.options;
            t.attributes && e.removeEventListener("DOMAttrModified", this, !0), t.characterData && e.removeEventListener("DOMCharacterDataModified", this, !0), t.childList && e.removeEventListener("DOMNodeInserted", this, !0), (t.childList || t.subtree) && e.removeEventListener("DOMNodeRemoved", this, !0)
        },
        addTransientObserver: function(e) {
            if (e !== this.target) {
                this.addListeners_(e), this.transientObservedNodes.push(e);
                var t = h.get(e);
                t || h.set(e, t = []), t.push(this)
            }
        },
        removeTransientObservers: function() {
            var e = this.transientObservedNodes;
            this.transientObservedNodes = [], e.forEach(function(e) {
                this.removeListeners_(e);
                for (var t = h.get(e), n = 0; n < t.length; n++)
                    if (t[n] === this) {
                        t.splice(n, 1);
                        break
                    }
            }, this)
        },
        handleEvent: function(e) {
            switch (e.stopImmediatePropagation(), e.type) {
                case "DOMAttrModified":
                    var t = e.attrName,
                        n = e.relatedNode.namespaceURI,
                        r = e.target,
                        o = new u("attributes", r);
                    o.attributeName = t, o.attributeNamespace = n;
                    var a = e.attrChange === MutationEvent.ADDITION ? null : e.prevValue;
                    i(r, function(e) {
                        return !e.attributes || e.attributeFilter && e.attributeFilter.length && -1 === e.attributeFilter.indexOf(t) && -1 === e.attributeFilter.indexOf(n) ? void 0 : e.attributeOldValue ? l(a) : o
                    });
                    break;
                case "DOMCharacterDataModified":
                    var r = e.target,
                        o = u("characterData", r),
                        a = e.prevValue;
                    i(r, function(e) {
                        return e.characterData ? e.characterDataOldValue ? l(a) : o : void 0
                    });
                    break;
                case "DOMNodeRemoved":
                    this.addTransientObserver(e.target);
                case "DOMNodeInserted":
                    var s, c, r = e.relatedNode,
                        f = e.target;
                    "DOMNodeInserted" === e.type ? (s = [f], c = []) : (s = [], c = [f]);
                    var p = f.previousSibling,
                        v = f.nextSibling,
                        o = u("childList", r);
                    o.addedNodes = s, o.removedNodes = c, o.previousSibling = p, o.nextSibling = v, i(r, function(e) {
                        return e.childList ? o : void 0
                    })
            }
            d()
        }
    }, e.JsMutationObserver = a
}(this), !window.MutationObserver && (window.MutationObserver = window.WebKitMutationObserver || window.JsMutationObserver, !MutationObserver)) throw new Error("no mutation observer support");
! function(e) {
    function t(t, i) {
        var a = i || {};
        if (!t) throw new Error("document.register: first argument `name` must not be empty");
        if (t.indexOf("-") < 0) throw new Error("document.register: first argument ('name') must contain a dash ('-'). Argument provided was '" + String(t) + "'.");
        if (a.name = t, !a.prototype) throw new Error("Options missing required prototype property");
        return a.lifecycle = a.lifecycle || {}, a.ancestry = n(a.extends), r(a), o(a), l(a.prototype), f(t, a), a.ctor = p(a), a.ctor.prototype = a.prototype, a.prototype.constructor = a.ctor, e.ready && e.upgradeAll(document), a.ctor
    }

    function n(e) {
        var t = w[e];
        return t ? n(t.extends).concat([t]) : []
    }

    function r(e) {
        for (var t, n = e.extends, r = 0; t = e.ancestry[r]; r++) n = t.is && t.tag;
        e.tag = n || e.name, n && (e.is = e.name)
    }

    function o(e) {
        if (!Object.__proto__) {
            var t = HTMLElement.prototype;
            if (e.is) {
                var n = document.createElement(e.tag);
                t = Object.getPrototypeOf(n)
            }
            for (var r, o = e.prototype; o && o !== t;) {
                var r = Object.getPrototypeOf(o);
                o.__proto__ = r, o = r
            }
        }
        e.native = t
    }

    function i(e) {
        return a(E(e.tag), e)
    }

    function a(t, n) {
        return n.is && t.setAttribute("is", n.is), s(t, n), t.__upgraded__ = !0, e.upgradeSubtree(t), u(t), t
    }

    function s(e, t) {
        Object.__proto__ ? e.__proto__ = t.prototype : (c(e, t.prototype, t.native), e.__proto__ = t.prototype)
    }

    function c(e, t, n) {
        for (var r = {}, o = t; o !== n && o !== HTMLUnknownElement.prototype;) {
            for (var i, a = Object.getOwnPropertyNames(o), s = 0; i = a[s]; s++) r[i] || (Object.defineProperty(e, i, Object.getOwnPropertyDescriptor(o, i)), r[i] = 1);
            o = Object.getPrototypeOf(o)
        }
    }

    function u(e) {
        e.createdCallback && e.createdCallback()
    }

    function l(e) {
        var t = e.setAttribute;
        e.setAttribute = function(e, n) {
            d.call(this, e, n, t)
        };
        var n = e.removeAttribute;
        e.removeAttribute = function(e, t) {
            d.call(this, e, t, n)
        }
    }

    function d(e, t, n) {
        var r = this.getAttribute(e);
        n.apply(this, arguments), this.attributeChangedCallback && this.getAttribute(e) !== r && this.attributeChangedCallback(e, r)
    }

    function f(e, t) {
        w[e] = t
    }

    function p(e) {
        return function() {
            return i(e)
        }
    }

    function v(e, t) {
        var n = w[t || e];
        return n ? new n.ctor : E(e)
    }

    function h(e) {
        if (!e.__upgraded__ && e.nodeType === Node.ELEMENT_NODE) {
            var t = e.getAttribute("is") || e.localName,
                n = w[t];
            return n && a(e, n)
        }
    }

    function m(t) {
        var n = L.call(this, t);
        return e.upgradeAll(n), n
    }
    e || (e = window.CustomElements = {
        flags: {}
    });
    var _ = e.flags,
        g = Boolean(document.register),
        b = !_.register && g;
    if (b) {
        var y = function() {};
        e.registry = {}, e.upgradeElement = y, e.watchShadow = y, e.upgrade = y, e.upgradeAll = y, e.upgradeSubtree = y, e.observeDocument = y, e.upgradeDocument = y, e.takeRecords = y
    } else {
        var w = {}, E = document.createElement.bind(document),
            L = Node.prototype.cloneNode;
        document.register = t, document.createElement = v, Node.prototype.cloneNode = m, e.registry = w, e.upgrade = h
    }
    e.hasNative = g, e.useNative = b
}(window.CustomElements),

function(e) {
    function t(e, n, r) {
        var o = e.firstElementChild;
        if (!o)
            for (o = e.firstChild; o && o.nodeType !== Node.ELEMENT_NODE;) o = o.nextSibling;
        for (; o;) n(o, r) !== !0 && t(o, n, r), o = o.nextElementSibling;
        return null
    }

    function n(e, t) {
        for (var n = e.shadowRoot; n;) r(n, t), n = n.olderShadowRoot
    }

    function r(e, r) {
        t(e, function(e) {
            return r(e) ? !0 : (n(e, r), void 0)
        }), n(e, r)
    }

    function o(e) {
        return s(e) ? (c(e), !0) : (d(e), void 0)
    }

    function i(e) {
        r(e, function(e) {
            return o(e) ? !0 : void 0
        })
    }

    function a(e) {
        return o(e) || i(e)
    }

    function s(t) {
        if (!t.__upgraded__ && t.nodeType === Node.ELEMENT_NODE) {
            var n = t.getAttribute("is") || t.localName,
                r = e.registry[n];
            if (r) return O.dom && console.group("upgrade:", t.localName), e.upgrade(t), O.dom && console.groupEnd(), !0
        }
    }

    function c(e) {
        d(e), h(e) && r(e, function(e) {
            d(e)
        })
    }

    function u(e) {
        if (A.push(e), !k) {
            k = !0;
            var t = window.Platform && window.Platform.endOfMicrotask || setTimeout;
            t(l)
        }
    }

    function l() {
        k = !1;
        for (var e, t = A, n = 0, r = t.length; r > n && (e = t[n]); n++) e();
        A = []
    }

    function d(e) {
        N ? u(function() {
            f(e)
        }) : f(e)
    }

    function f(e) {
        (e.enteredViewCallback || e.__upgraded__ && O.dom) && (O.dom && console.group("inserted:", e.localName), h(e) && (e.__inserted = (e.__inserted || 0) + 1, e.__inserted < 1 && (e.__inserted = 1), e.__inserted > 1 ? O.dom && console.warn("inserted:", e.localName, "insert/remove count:", e.__inserted) : e.enteredViewCallback && (O.dom && console.log("inserted:", e.localName), e.enteredViewCallback())), O.dom && console.groupEnd())
    }

    function p(e) {
        v(e), r(e, function(e) {
            v(e)
        })
    }

    function v(e) {
        N ? u(function() {
            _removed(e)
        }) : _removed(e)
    }

    function v(e) {
        (e.leftViewCallback || e.__upgraded__ && O.dom) && (O.dom && console.log("removed:", e.localName), h(e) || (e.__inserted = (e.__inserted || 0) - 1, e.__inserted > 0 && (e.__inserted = 0), e.__inserted < 0 ? O.dom && console.warn("removed:", e.localName, "insert/remove count:", e.__inserted) : e.leftViewCallback && e.leftViewCallback()))
    }

    function h(e) {
        for (var t = e, n = window.ShadowDOMPolyfill && window.ShadowDOMPolyfill.wrapIfNeeded(document) || document; t;) {
            if (t == n) return !0;
            t = t.parentNode || t.host
        }
    }

    function m(e) {
        if (e.shadowRoot && !e.shadowRoot.__watched) {
            O.dom && console.log("watching shadow-root for: ", e.localName);
            for (var t = e.shadowRoot; t;) _(t), t = t.olderShadowRoot
        }
    }

    function _(e) {
        e.__watched || (w(e), e.__watched = !0)
    }

    function g(e) {
        switch (e.localName) {
            case "style":
            case "script":
            case "template":
            case void 0:
                return !0
        }
    }

    function b(e) {
        if (O.dom) {
            var t = e[0];
            if (t && "childList" === t.type && t.addedNodes && t.addedNodes) {
                for (var n = t.addedNodes[0]; n && n !== document && !n.host;) n = n.parentNode;
                var r = n && (n.URL || n._URL || n.host && n.host.localName) || "";
                r = r.split("/?").shift().split("/").pop()
            }
            console.group("mutations (%d) [%s]", e.length, r || "")
        }
        e.forEach(function(e) {
            "childList" === e.type && (T(e.addedNodes, function(e) {
                g(e) || a(e)
            }), T(e.removedNodes, function(e) {
                g(e) || p(e)
            }))
        }), O.dom && console.groupEnd()
    }

    function y() {
        b(M.takeRecords()), l()
    }

    function w(e) {
        M.observe(e, {
            childList: !0,
            subtree: !0
        })
    }

    function E(e) {
        w(e)
    }

    function L(e) {
        O.dom && console.group("upgradeDocument: ", (e.URL || e._URL || "").split("/").pop()), a(e), O.dom && console.groupEnd()
    }
    var O = window.logFlags || {}, N = !window.MutationObserver || window.MutationObserver === window.JsMutationObserver;
    e.hasPolyfillMutations = N;
    var k = !1,
        A = [],
        M = new MutationObserver(b),
        T = Array.prototype.forEach.call.bind(Array.prototype.forEach);
    e.watchShadow = m, e.upgradeAll = a, e.upgradeSubtree = i, e.observeDocument = E, e.upgradeDocument = L, e.takeRecords = y
}(window.CustomElements),

function(e) {
    function t(e) {
        return r(e, c)
    }

    function n(e) {
        return r(e, u)
    }

    function r(e, t) {
        return "link" === e.localName && e.getAttribute("rel") === t
    }

    function o(e) {
        return "script" === e.localName
    }

    function i(e, t) {
        var n = e;
        n instanceof Document || (n = document.implementation.createHTMLDocument(c), n.body.innerHTML = e), n._URL = t;
        var r = n.createElement("base");
        return r.setAttribute("href", document.baseURI || document.URL), n.head.appendChild(r), window.HTMLTemplateElement && HTMLTemplateElement.bootstrap && HTMLTemplateElement.bootstrap(n), n
    }
    e || (e = window.HTMLImports = {
        flags: {}
    });
    var a, s = e.xhr,
        c = "import",
        u = "stylesheet",
        l = {
            documents: {},
            cache: {},
            preloadSelectors: ["link[rel=" + c + "]", "element link[rel=" + u + "]", "template", "script[src]:not([type])", 'script[src][type="text/javascript"]'].join(","),
            loader: function(e) {
                return a = new d(l.loaded, e), a.cache = l.cache, a
            },
            load: function(e, t) {
                a = l.loader(t), l.preload(e)
            },
            preload: function(e) {
                var t = e.querySelectorAll(l.preloadSelectors);
                t = this.filterMainDocumentNodes(e, t), t = this.extractTemplateNodes(t), a.addNodes(t)
            },
            filterMainDocumentNodes: function(e, t) {
                return e === document && (t = Array.prototype.filter.call(t, function(e) {
                    return !o(e)
                })), t
            },
            extractTemplateNodes: function(e) {
                var t = [];
                return e = Array.prototype.filter.call(e, function(e) {
                    if ("template" === e.localName) {
                        if (e.content) {
                            var n = e.content.querySelectorAll("link[rel=" + u + "]");
                            n.length && (t = t.concat(Array.prototype.slice.call(n, 0)))
                        }
                        return !1
                    }
                    return !0
                }), t.length && (e = e.concat(t)), e
            },
            loaded: function(e, r, o) {
                if (t(r)) {
                    var a = l.documents[e];
                    a || (a = i(o, e), h.resolvePathsInHTML(a), l.documents[e] = a, l.preload(a)), r.import = {
                        href: e,
                        ownerNode: r,
                        content: a
                    }, r.content = o = a
                }
                r.__resource = o, n(r) && h.resolvePathsInStylesheet(r)
            }
        }, d = function(e, t) {
            this.onload = e, this.oncomplete = t, this.inflight = 0, this.pending = {}, this.cache = {}
        };
    d.prototype = {
        addNodes: function(e) {
            this.inflight += e.length, m(e, this.require, this), this.checkDone()
        },
        require: function(e) {
            var t = h.nodeUrl(e);
            e.__nodeUrl = t, this.dedupe(t, e) || this.fetch(t, e)
        },
        dedupe: function(e, t) {
            return this.pending[e] ? (this.pending[e].push(t), !0) : this.cache[e] ? (this.onload(e, t, a.cache[e]), this.tail(), !0) : (this.pending[e] = [t], !1)
        },
        fetch: function(e, t) {
            var n = function(n, r) {
                this.receive(e, t, n, r)
            }.bind(this);
            s.load(e, n)
        },
        receive: function(e, t, n, r) {
            n || (a.cache[e] = r), a.pending[e].forEach(function(t) {
                n || this.onload(e, t, r), this.tail()
            }, this), a.pending[e] = null
        },
        tail: function() {
            --this.inflight, this.checkDone()
        },
        checkDone: function() {
            this.inflight || this.oncomplete()
        }
    };
    var f = ["href", "src", "action"],
        p = "[" + f.join("],[") + "]",
        v = "{{.*}}",
        h = {
            nodeUrl: function(e) {
                return h.resolveUrl(h.documentURL, h.hrefOrSrc(e))
            },
            hrefOrSrc: function(e) {
                return e.getAttribute("href") || e.getAttribute("src")
            },
            documentUrlFromNode: function(e) {
                return h.getDocumentUrl(e.ownerDocument || e)
            },
            getDocumentUrl: function(e) {
                var t = e && (e._URL || e.impl && e.impl._URL || e.baseURI || e.URL) || "";
                return t.split("#")[0]
            },
            resolveUrl: function(e, t) {
                return this.isAbsUrl(t) ? t : this.compressUrl(this.urlToPath(e) + t)
            },
            resolveRelativeUrl: function(e, t) {
                return this.isAbsUrl(t) ? t : this.makeDocumentRelPath(this.resolveUrl(e, t))
            },
            isAbsUrl: function(e) {
                return /(^data:)|(^http[s]?:)|(^\/)/.test(e)
            },
            urlToPath: function(e) {
                var t = e.split("/");
                return t.pop(), t.push(""), t.join("/")
            },
            compressUrl: function(e) {
                var t = "",
                    n = e.indexOf("?");
                n > -1 && (t = e.substring(n), e = e.substring(n, 0));
                for (var r, o = e.split("/"), i = 0; i < o.length; i++) r = o[i], ".." === r && (o.splice(i - 1, 2), i -= 2);
                return o.join("/") + t
            },
            makeDocumentRelPath: function(e) {
                return h.urlElt.href = e, !h.urlElt.host || h.urlElt.host === window.location.host && h.urlElt.protocol === window.location.protocol ? this.makeRelPath(h.documentURL, h.urlElt.href) : e
            },
            makeRelPath: function(e, t) {
                for (var n = e.split("/"), r = t.split("/"); n.length && n[0] === r[0];) n.shift(), r.shift();
                for (var o = 0, i = n.length - 1; i > o; o++) r.unshift("..");
                var a = r.join("/");
                return a
            },
            resolvePathsInHTML: function(e, t) {
                t = t || h.documentUrlFromNode(e), h.resolveAttributes(e, t), h.resolveStyleElts(e, t);
                var n = e.querySelectorAll("template");
                n && m(n, function(e) {
                    e.content && h.resolvePathsInHTML(e.content, t)
                })
            },
            resolvePathsInStylesheet: function(e) {
                var t = h.nodeUrl(e);
                e.__resource = h.resolveCssText(e.__resource, t)
            },
            resolveStyleElts: function(e, t) {
                var n = e.querySelectorAll("style");
                n && m(n, function(e) {
                    e.textContent = h.resolveCssText(e.textContent, t)
                })
            },
            resolveCssText: function(e, t) {
                return e.replace(/url\([^)]*\)/g, function(e) {
                    var n = e.replace(/["']/g, "").slice(4, -1);
                    return n = h.resolveRelativeUrl(t, n), "url(" + n + ")"
                })
            },
            resolveAttributes: function(e, t) {
                var n = e && e.querySelectorAll(p);
                n && m(n, function(e) {
                    this.resolveNodeAttributes(e, t)
                }, this)
            },
            resolveNodeAttributes: function(e, t) {
                f.forEach(function(n) {
                    var r = e.attributes[n];
                    if (r && r.value && r.value.search(v) < 0) {
                        var o = h.resolveRelativeUrl(t, r.value);
                        r.value = o
                    }
                })
            }
        };
    h.documentURL = h.getDocumentUrl(document), h.urlElt = document.createElement("a"), s = s || {
        async: !0,
        ok: function(e) {
            return e.status >= 200 && e.status < 300 || 304 === e.status || 0 === e.status
        },
        load: function(t, n, r) {
            var o = new XMLHttpRequest;
            return (e.flags.debug || e.flags.bust) && (t += "?" + Math.random()), o.open("GET", t, s.async), o.addEventListener("readystatechange", function() {
                4 === o.readyState && n.call(r, !s.ok(o) && o, o.response, t)
            }), o.send(), o
        },
        loadDocument: function(e, t, n) {
            this.load(e, t, n).responseType = "document"
        }
    };
    var m = Array.prototype.forEach.call.bind(Array.prototype.forEach);
    e.path = h, e.xhr = s, e.importer = l, e.getDocumentUrl = h.getDocumentUrl, e.IMPORT_LINK_TYPE = c
}(window.HTMLImports),

function(e) {
    function t(e) {
        return "link" === e.localName && e.getAttribute("rel") === i
    }

    function n(e) {
        return e.parentNode && !r(e) && !o(e)
    }

    function r(e) {
        return e.ownerDocument === document || e.ownerDocument.impl === document
    }

    function o(e) {
        return e.parentNode && "element" === e.parentNode.localName
    }
    var i = "import",
        a = {
            selectors: ["link[rel=" + i + "]", "link[rel=stylesheet]", "style", "script:not([type])", 'script[type="text/javascript"]'],
            map: {
                link: "parseLink",
                script: "parseScript",
                style: "parseGeneric"
            },
            parse: function(e) {
                if (!e.__importParsed) {
                    e.__importParsed = !0;
                    var t = e.querySelectorAll(a.selectors);
                    s(t, function(e) {
                        a[a.map[e.localName]](e)
                    })
                }
            },
            parseLink: function(e) {
                t(e) ? e.content && a.parse(e.content) : this.parseGeneric(e)
            },
            parseGeneric: function(e) {
                n(e) && document.head.appendChild(e)
            },
            parseScript: function(t) {
                if (n(t)) {
                    var r = (t.__resource || t.textContent).trim();
                    if (r) {
                        var o = t.__nodeUrl;
                        if (!o) {
                            var o = e.path.documentUrlFromNode(t),
                                i = "[" + Math.floor(1e3 * (Math.random() + 1)) + "]",
                                a = r.match(/Polymer\(['"]([^'"]*)/);
                            i = a && a[1] || i, o += "/" + i + ".js"
                        }
                        //r += "\n//# sourceURL=" + o + "\n", eval.call(window, r)
                    }
                }
            }
        }, s = Array.prototype.forEach.call.bind(Array.prototype.forEach);
    e.parser = a
}(HTMLImports),

function() {
    function e() {
        HTMLImports.importer.load(document, function() {
            HTMLImports.parser.parse(document), HTMLImports.readyTime = (new Date).getTime(), document.dispatchEvent(new CustomEvent("HTMLImportsLoaded", {
                bubbles: !0
            }))
        })
    }
    "function" != typeof window.CustomEvent && (window.CustomEvent = function(e) {
        var t = document.createEvent("HTMLEvents");
        return t.initEvent(e, !0, !0), t
    }), "complete" === document.readyState ? e() : window.addEventListener("DOMContentLoaded", e)
}(),

function() {
    function e(e) {
        return "link" === e.localName && e.getAttribute("rel") === t
    }
    var t = window.HTMLImports ? HTMLImports.IMPORT_LINK_TYPE : "none",
        n = {
            selectors: ["link[rel=" + t + "]"],
            map: {
                link: "parseLink"
            },
            parse: function(e) {
                if (!e.__parsed) {
                    e.__parsed = !0;
                    var t = e.querySelectorAll(n.selectors);
                    r(t, function(e) {
                        n[n.map[e.localName]](e)
                    }), CustomElements.upgradeDocument(e), CustomElements.observeDocument(e)
                }
            },
            parseLink: function(t) {
                e(t) && this.parseImport(t)
            },
            parseImport: function(e) {
                e.content && n.parse(e.content)
            }
        }, r = Array.prototype.forEach.call.bind(Array.prototype.forEach);
    CustomElements.parser = n
}(),

function() {
    function e() {
        CustomElements.parser.parse(document), CustomElements.upgradeDocument(document);
        var e = window.Platform && Platform.endOfMicrotask ? Platform.endOfMicrotask : setTimeout;
        e(function() {
            CustomElements.ready = !0, CustomElements.readyTime = Date.now(), window.HTMLImports && (CustomElements.elapsed = CustomElements.readyTime - HTMLImports.readyTime), document.body.dispatchEvent(new CustomEvent("WebComponentsReady", {
                bubbles: !0
            }))
        })
    }
    if ("function" != typeof window.CustomEvent && (window.CustomEvent = function(e) {
        var t = document.createEvent("HTMLEvents");
        return t.initEvent(e, !0, !0), t
    }), "complete" === document.readyState) e();
    else {
        var t = window.HTMLImports ? "HTMLImportsLoaded" : "DOMContentLoaded";
        window.addEventListener(t, e)
    }
}(),

function() {
    function e(e) {
        var t = P.call(e);
        return S[t] || (S[t] = t.match(R)[1].toLowerCase())
    }

    function t(n, r) {
        var o = t[r || e(n)];
        return o ? o(n) : n
    }

    function n(t) {
        return -1 == U.indexOf(e(t)) ? Array.prototype.slice.call(t, 0) : [t]
    }

    function r(e, t) {
        return (t || I).length ? n(e.querySelectorAll(t)) : []
    }

    function o(e, t) {
        var n = {
            added: [],
            removed: []
        };
        t.forEach(function(t) {
            t._mutation = !0;
            for (var r in n)
                for (var o = e._records["added" == r ? "inserted" : "removed"], i = t[r + "Nodes"], a = i.length, s = 0; a > s && -1 == n[r].indexOf(i[s]); s++) n[r].push(i[s]), o.forEach(function(e) {
                    e(i[s], t)
                })
        })
    }

    function i(n, r, o) {
        var i = e(o);
        return "object" == i && "object" == e(n[r]) ? q.merge(n[r], o) : n[r] = t(o, i), n
    }

    function a(e, t, n) {
        var r = {};
        for (var o in n) r[o.split(":")[0]] = !0;
        for (var i in t) r[i.split(":")[0]] || (n[i] = t[i])
    }

    function s(e) {
        return e.mixins.forEach(function(t) {
            var n = q.mixins[t];
            for (var r in n) switch (r) {
                case "lifecycle":
                case "methods":
                    a(r, n[r], e[r]);
                    break;
                case "accessors":
                case "prototype":
                    for (var o in n[r]) a(o, n[r], e.accessors);
                    break;
                case "events":
            }
        }), e
    }

    function c(e, t) {
        var n = r(this, e.value).filter(function(e) {
            return e == t.target || e.contains ? e.contains(t.target) : null
        })[0];
        return n ? e.listener = e.listener.bind(n) : null
    }

    function u(e) {
        if (e.type.match("touch")) e.target.__touched__ = !0;
        else if (e.target.__touched__ && e.type.match("mouse")) return delete e.target.__touched__, void 0;
        return !0
    }

    function l(e) {
        var t = "over" == e;
        return {
            attach: "OverflowEvent" in E ? "overflowchanged" : [],
            condition: function(n) {
                return n.flow = e, n.type == e + "flow" || 0 === n.orient && n.horizontalOverflow == t || 1 == n.orient && n.verticalOverflow == t || 2 == n.orient && n.horizontalOverflow == t && n.verticalOverflow == t
            }
        }
    }

    function d(e, t, n, r) {
        r ? t[e] = n[e] : Object.defineProperty(t, e, {
            writable: !0,
            enumerable: !0,
            value: n[e]
        })
    }

    function f(e, t) {
        var n = Object.getOwnPropertyDescriptor(e, "target");
        for (var r in t) j[r] || d(r, e, t, n);
        e.baseEvent = t
    }

    function p(e, t) {
        return {
            value: e.boolean ? "" : t,
            method: e.boolean && !t ? "removeAttribute" : "setAttribute"
        }
    }

    function v(e, t, n, r) {
        var o = p(t, r);
        e[o.method](n, o.value)
    }

    function h(e, t, n, r, o) {
        for (var i = t.property ? [e.xtag[t.property]] : t.selector ? q.query(e, t.selector) : [], a = i.length; a--;) i[a][o](n, r)
    }

    function m(e, t, n) {
        e.__view__ && e.__view__.updateBindingValue(e, t, n)
    }

    function _(e, t, n, r, o, i) {
        var a = n.split(":"),
            s = a[0];
        if ("get" == s) a[0] = t, e.prototype[t].get = q.applyPseudos(a.join(":"), r[n], e.pseudos);
        else if ("set" == s) {
            a[0] = t;
            var c = e.prototype[t].set = q.applyPseudos(a.join(":"), o ? function(e) {
                this.xtag._skipSet = !0, this.xtag._skipAttr || v(this, o, i, e), this.xtag._skipAttr && o.skip && delete this.xtag._skipAttr, r[n].call(this, o.boolean ? !! e : e), m(this, i, e), delete this.xtag._skipSet
            } : r[n] ? function(e) {
                r[n].call(this, e), m(this, i, e)
            } : null, e.pseudos);
            o && (o.setter = c)
        } else e.prototype[t][n] = r[n]
    }

    function g(e, t) {
        e.prototype[t] = {};
        var n = e.accessors[t],
            r = n.attribute,
            o = r && r.name ? r.name.toLowerCase() : t;
        r && (r.key = t, e.attributes[o] = r);
        for (var i in n) _(e, t, i, n, r, o);
        if (r) {
            if (!e.prototype[t].get) {
                var a = (r.boolean ? "has" : "get") + "Attribute";
                e.prototype[t].get = function() {
                    return this[a](o)
                }
            }
            e.prototype[t].set || (e.prototype[t].set = function(e) {
                v(this, r, o, e), m(this, o, e)
            })
        }
    }

    function b(e, t, n) {
        e.__tap__ || (e.__tap__ = {
            click: "mousedown" == n.type
        }, e.__tap__.click ? e.addEventListener("click", t.observer) : (e.__tap__.scroll = t.observer.bind(e), window.addEventListener("scroll", e.__tap__.scroll, !0), e.addEventListener("touchmove", t.observer), e.addEventListener("touchcancel", t.observer), e.addEventListener("touchend", t.observer))), e.__tap__.click || (e.__tap__.x = n.touches[0].pageX, e.__tap__.y = n.touches[0].pageY)
    }

    function y(e, t) {
        e.__tap__ && (e.__tap__.click ? e.removeEventListener("click", t.observer) : (window.removeEventListener("scroll", e.__tap__.scroll, !0), e.removeEventListener("touchmove", t.observer), e.removeEventListener("touchcancel", t.observer), e.removeEventListener("touchend", t.observer)), delete e.__tap__)
    }

    function w(e, t, n) {
        var r = n.changedTouches[0];
        return r.pageX < e.__tap__.x + t.gesture.tolerance && r.pageX > e.__tap__.x - t.gesture.tolerance && r.pageY < e.__tap__.y + t.gesture.tolerance && r.pageY > e.__tap__.y - t.gesture.tolerance ? !0 : void 0
    }
    var E = window,
        L = document,
        O = function() {}, N = function() {
            return !0
        }, k = /([\w-]+(?:\([^\)]+\))?)/g,
        A = /(\w*)(?:\(([^\)]*)\))?/,
        M = /(\d+)/g,
        T = {
            action: function(e, t) {
                return e.value.match(M).indexOf(String(t.keyCode)) > -1 == ("keypass" == e.name) || null
            }
        }, C = function() {
            var e = E.getComputedStyle(L.documentElement, ""),
                t = (Array.prototype.slice.call(e).join("").match(/-(moz|webkit|ms)-/) || "" === e.OLink && ["", "o"])[1];
            return {
                dom: "ms" == t ? "MS" : t,
                lowercase: t,
                css: "-" + t + "-",
                js: "ms" == t ? t : t[0].toUpperCase() + t.substr(1)
            }
        }(),
        D = Element.prototype.matchesSelector || Element.prototype[C.lowercase + "MatchesSelector"],
        x = E.MutationObserver || E[C.js + "MutationObserver"],
        S = {}, P = S.toString,
        R = /\s([a-zA-Z]+)/;
    t.object = function(e) {
        var n = {};
        for (var r in e) n[r] = t(e[r]);
        return n
    }, t.array = function(e) {
        for (var n = e.length, r = new Array(n); n--;) r[n] = t(e[n]);
        return r
    };
    var U = ["undefined", "null", "number", "boolean", "string", "function"],
        I = "",
        j = {};
    for (var H in document.createEvent("CustomEvent")) j[H] = 1;
    var q = {
        tags: {},
        defaultOptions: {
            pseudos: [],
            mixins: [],
            events: {},
            methods: {},
            accessors: {},
            lifecycle: {},
            attributes: {},
            prototype: {
                xtag: {
                    get: function() {
                        return this.__xtag__ ? this.__xtag__ : this.__xtag__ = {
                            data: {}
                        }
                    }
                }
            }
        },
        register: function(e, t) {
            var r;
            if ("string" == typeof e) {
                r = e.toLowerCase();
                var o = t.prototype;
                delete t.prototype;
                var i = q.tags[r] = s(q.merge({}, q.defaultOptions, t));
                for (var a in i.events) i.events[a] = q.parseEvent(a, i.events[a]);
                for (a in i.lifecycle) i.lifecycle[a.split(":")[0]] = q.applyPseudos(a, i.lifecycle[a], i.pseudos);
                for (a in i.methods) i.prototype[a.split(":")[0]] = {
                    value: q.applyPseudos(a, i.methods[a], i.pseudos),
                    enumerable: !0
                };
                for (a in i.accessors) g(i, a);
                var c = i.lifecycle.created || i.lifecycle.ready;
                i.prototype.createdCallback = {
                    enumerable: !0,
                    value: function() {
                        var e = this;
                        q.addEvents(this, i.events), i.mixins.forEach(function(t) {
                            q.mixins[t].events && q.addEvents(e, q.mixins[t].events)
                        });
                        var t = c ? c.apply(this, n(arguments)) : null;
                        for (var r in i.attributes) {
                            var o = i.attributes[r],
                                a = this.hasAttribute(r);
                            (a || o.boolean) && (this[o.key] = o.boolean ? a : this.getAttribute(r))
                        }
                        return i.pseudos.forEach(function(t) {
                            t.onAdd.call(e, t)
                        }), t
                    }
                }, i.lifecycle.inserted && (i.prototype.enteredViewCallback = {
                    value: i.lifecycle.inserted,
                    enumerable: !0
                }), i.lifecycle.removed && (i.prototype.leftDocumentCallback = {
                    value: i.lifecycle.removed,
                    enumerable: !0
                }), i.lifecycle.attributeChanged && (i.prototype.attributeChangedCallback = {
                    value: i.lifecycle.attributeChanged,
                    enumerable: !0
                });
                var u = i.prototype.setAttribute || HTMLElement.prototype.setAttribute;
                i.prototype.setAttribute = {
                    writable: !0,
                    enumberable: !0,
                    value: function(e, t) {
                        var n = i.attributes[e.toLowerCase()];
                        this.xtag._skipAttr || u.call(this, e, n && n.boolean ? "" : t), n && (n.setter && !this.xtag._skipSet && (this.xtag._skipAttr = !0, n.setter.call(this, n.boolean ? !0 : t)), t = n.skip ? n.boolean ? this.hasAttribute(e) : this.getAttribute(e) : t, h(this, n, e, n.boolean ? "" : t, "setAttribute")), delete this.xtag._skipAttr
                    }
                };
                var l = i.prototype.removeAttribute || HTMLElement.prototype.removeAttribute;
                i.prototype.removeAttribute = {
                    writable: !0,
                    enumberable: !0,
                    value: function(e) {
                        var t = i.attributes[e.toLowerCase()];
                        this.xtag._skipAttr || l.call(this, e), t && (t.setter && !this.xtag._skipSet && (this.xtag._skipAttr = !0, t.setter.call(this, t.boolean ? !1 : void 0)), h(this, t, e, void 0, "removeAttribute")), delete this.xtag._skipAttr
                    }
                };
                var d = o ? o : t["extends"] ? Object.create(L.createElement(t["extends"]).constructor).prototype : E.HTMLElement.prototype;
                return L.register(r, {
                    "extends": t["extends"],
                    prototype: Object.create(d, i.prototype)
                })
            }
        },
        mixins: {},
        prefix: C,
        touches: {
            active: [],
            changed: []
        },
        captureEvents: ["focus", "blur", "scroll", "underflow", "overflow", "overflowchanged"],
        customEvents: {
            overflow: l("over"),
            underflow: l("under"),
            animationstart: {
                attach: [C.dom + "AnimationStart"]
            },
            animationend: {
                attach: [C.dom + "AnimationEnd"]
            },
            transitionend: {
                attach: [C.dom + "TransitionEnd"]
            },
            move: {
                attach: ["mousemove", "touchmove"],
                condition: u
            },
            enter: {
                attach: ["mouseover", "touchenter"],
                condition: u
            },
            leave: {
                attach: ["mouseout", "touchleave"],
                condition: u
            },
            tapstart: {
                observe: {
                    mousedown: L,
                    touchstart: L
                },
                condition: u
            },
            tapend: {
                observe: {
                    mouseup: L,
                    touchend: L
                },
                condition: u
            },
            tapmove: {
                attach: ["tapstart", "dragend", "touchcancel"],
                condition: function(e, t) {
                    switch (e.type) {
                        case "move":
                            return !0;
                        case "dragover":
                            var n = t.lastDrag || {};
                            return t.lastDrag = e, n.pageX != e.pageX && n.pageY != e.pageY || null;
                        case "tapstart":
                            t.touches = t.touches || 1, t.move || (t.current = this, t.move = q.addEvents(this, {
                                move: t.listener,
                                dragover: t.listener
                            }), t.tapend = q.addEvent(L, "tapend", t.listener));
                            break;
                        case "tapend":
                        case "dragend":
                        case "touchcancel":
                            t.touches--, t.touches || (q.removeEvents(t.current, t.move || {}), q.removeEvent(L, t.tapend || {}), delete t.lastDrag, delete t.current, delete t.tapend, delete t.move)
                    }
                }
            }
        },
        pseudos: {
            keypass: T,
            keyfail: T,
            delegate: {
                action: c
            },
            within: {
                action: c,
                onAdd: function(e) {
                    var t = e.source.condition;
                    t && (e.source.condition = function(n, r) {
                        return q.query(this, e.value).filter(function(e) {
                            return e == n.target || e.contains ? e.contains(n.target) : null
                        })[0] ? t.call(this, n, r) : null
                    })
                }
            },
            preventable: {
                action: function(e, t) {
                    return !t.defaultPrevented
                }
            }
        },
        clone: t,
        typeOf: e,
        toArray: n,
        wrap: function(e, t) {
            return function() {
                var r = n(arguments),
                    o = e.apply(this, r);
                return o === !1 ? !1 : t.apply(this, "undefined" != typeof o ? n(o) : r)
            }
        },
        merge: function(t, n, r) {
            if ("string" == e(n)) return i(t, n, r);
            for (var o = 1, a = arguments.length; a > o; o++) {
                var s = arguments[o];
                for (var c in s) i(t, c, s[c])
            }
            return t
        },
        uid: function() {
            return Math.random().toString(36).substr(2, 10)
        },
        query: r,
        skipTransition: function(e, t, n) {
            var r = C.js + "TransitionProperty";
            e.style[r] = e.style.transitionProperty = "none", q.requestFrame(function() {
                var o;
                t && (o = t.call(n)), q.requestFrame(function() {
                    e.style[r] = e.style.transitionProperty = "", o && q.requestFrame(o)
                })
            })
        },
        requestFrame: function() {
            var e = E.requestAnimationFrame || E[C.lowercase + "RequestAnimationFrame"] || function(e) {
                    return E.setTimeout(e, 20)
                };
            return function(t) {
                return e.call(E, t)
            }
        }(),
        matchSelector: function(e, t) {
            return D.call(e, t)
        },
        set: function(e, t, n) {
            e[t] = n, window.CustomElements && CustomElements.upgradeAll(e)
        },
        innerHTML: function(e, t) {
            q.set(e, "innerHTML", t)
        },
        hasClass: function(e, t) {
            return e.className.split(" ").indexOf(t.trim()) > -1
        },
        addClass: function(e, t) {
            var n = e.className.trim().split(" ");
            return t.trim().split(" ").forEach(function(e) {~
                n.indexOf(e) || n.push(e)
            }), e.className = n.join(" ").trim(), e
        },
        removeClass: function(e, t) {
            var n = t.trim().split(" ");
            return e.className = e.className.trim().split(" ").filter(function(e) {
                return e && !~n.indexOf(e)
            }).join(" "), e
        },
        toggleClass: function(e, t) {
            return q[q.hasClass(e, t) ? "removeClass" : "addClass"].call(null, e, t)
        },
        queryChildren: function(e, t) {
            var r = e.id,
                o = e.id = r || "x_" + q.uid(),
                i = "#" + o + " > ";
            t = i + (t + "").replace(",", "," + i, "g");
            var a = e.parentNode.querySelectorAll(t);
            return r || e.removeAttribute("id"), n(a)
        },
        createFragment: function(e) {
            var t = L.createDocumentFragment();
            if (e) {
                for (var r = t.appendChild(L.createElement("div")), o = n(e.nodeName ? arguments : !(r.innerHTML = e) || r.children), i = o.length, a = 0; i > a;) t.insertBefore(o[a++], r);
                t.removeChild(r)
            }
            return t
        },
        manipulate: function(e, t) {
            var n = e.nextSibling,
                r = e.parentNode,
                o = L.createDocumentFragment(),
                i = t.call(o.appendChild(e), o) || e;
            n ? r.insertBefore(i, n) : r.appendChild(i)
        },
        applyPseudos: function(e, t, r, o) {
            var i = t,
                a = {};
            if (e.match(":"))
                for (var s = e.match(k), c = s.length; --c;) s[c].replace(A, function(t, u, l) {
                    if (!q.pseudos[u]) throw "pseudo not found: " + u + " " + s;
                    var d = a[c] = Object.create(q.pseudos[u]);
                    d.key = e, d.name = u, d.value = l, d.arguments = (l || "").split(","), d.action = d.action || N, d.source = o;
                    var f = i;
                    i = function() {
                        var t = n(arguments),
                            r = {
                                key: e,
                                name: u,
                                value: l,
                                source: o,
                                listener: f
                            }, i = d.action.apply(this, [r].concat(t));
                        return null === i || i === !1 ? i : r.listener.apply(this, t)
                    }, r && d.onAdd && (r.getAttribute ? d.onAdd.call(r, d) : r.push(d))
                });
            for (var u in a) a[u].onCompiled && (i = a[u].onCompiled(i, a[u]) || i);
            return i
        },
        removePseudos: function(e, t) {
            t._pseudos.forEach(function(t) {
                t.onRemove && t.onRemove.call(e, t)
            })
        },
        parseEvent: function(e, t) {
            var r = e.split(":"),
                o = r.shift(),
                i = q.customEvents[o],
                a = q.merge({
                    type: o,
                    stack: O,
                    condition: N,
                    attach: [],
                    _attach: [],
                    pseudos: "",
                    _pseudos: [],
                    onAdd: O,
                    onRemove: O
                }, i || {});
            a.attach = n(a.base || a.attach), a.chain = o + (a.pseudos.length ? ":" + a.pseudos : "") + (r.length ? ":" + r.join(":") : "");
            var s = a.condition;
            a.condition = function(e) {
                return e.touches, e.targetTouches, s.apply(this, n(arguments))
            };
            var c = q.applyPseudos(a.chain, t, a._pseudos, a);
            if (a.stack = function(e) {
                e.touches, e.targetTouches;
                var t = e.detail || {};
                return t.__stack__ ? t.__stack__ == c ? (e.stopPropagation(), e.cancelBubble = !0, c.apply(this, n(arguments))) : void 0 : c.apply(this, n(arguments))
            }, a.listener = function(e) {
                var t = n(arguments),
                    r = a.condition.apply(this, t.concat([a]));
                return r ? e.type == o ? a.stack.apply(this, t) : (q.fireEvent(e.target, o, {
                    baseEvent: e,
                    detail: {
                        __stack__: c
                    }
                }), void 0) : r
            }, a.attach.forEach(function(e) {
                a._attach.push(q.parseEvent(e, a.listener))
            }), i && i.observe && !i.__observing__) {
                i.observer = function(e) {
                    var t = a.condition.apply(this, n(arguments).concat([i]));
                    return t ? (q.fireEvent(e.target, o, {
                        baseEvent: e
                    }), void 0) : t
                };
                for (var u in i.observe) q.addEvent(i.observe[u] || document, u, i.observer, !0);
                i.__observing__ = !0
            }
            return a
        },
        addEvent: function(e, t, n, r) {
            var o = "function" == typeof n ? q.parseEvent(t, n) : n;
            return o._pseudos.forEach(function(t) {
                t.onAdd.call(e, t)
            }), o._attach.forEach(function(t) {
                q.addEvent(e, t.type, t)
            }), o.onAdd.call(e, o, o.listener), e.addEventListener(o.type, o.stack, r || q.captureEvents.indexOf(o.type) > -1), o
        },
        addEvents: function(e, t) {
            var n = {};
            for (var r in t) n[r] = q.addEvent(e, r, t[r]);
            return n
        },
        removeEvent: function(e, t, n) {
            n = n || t, n.onRemove.call(e, n, n.listener), q.removePseudos(e, n), n._attach.forEach(function(t) {
                q.removeEvent(e, t)
            }), e.removeEventListener(n.type, n.stack)
        },
        removeEvents: function(e, t) {
            for (var n in t) q.removeEvent(e, t[n])
        },
        fireEvent: function(e, t, n, r) {
            var o = L.createEvent("CustomEvent");
            n = n || {}, r && console.warn("fireEvent has been modified, more info here: "), o.initCustomEvent(t, n.bubbles !== !1, n.cancelable !== !1, n.detail), n.baseEvent && f(o, n.baseEvent);
            try {
                e.dispatchEvent(o)
            } catch (i) {
                console.warn("This error may have been caused by a change in the fireEvent method, more info here: ", i)
            }
        },
        addObserver: function(e, t, n) {
            e._records || (e._records = {
                inserted: [],
                removed: []
            }, x ? (e._observer = new x(function(t) {
                o(e, t)
            }), e._observer.observe(e, {
                subtree: !0,
                childList: !0,
                attributes: !1,
                characterData: !1
            })) : ["Inserted", "Removed"].forEach(function(t) {
                e.addEventListener("DOMNode" + t, function(n) {
                    n._mutation = !0, e._records[t.toLowerCase()].forEach(function(e) {
                        e(n.target, n)
                    })
                }, !1)
            })), -1 == e._records[t].indexOf(n) && e._records[t].push(n)
        },
        removeObserver: function(e, t, n) {
            var r = e._records;
            r && n ? r[t].splice(r[t].indexOf(n), 1) : r[t] = []
        }
    }, F = 0,
        V = null;
    L.addEventListener("mousedown", function(e) {
        F++, V = e.target
    }, !0), L.addEventListener("mouseup", function() {
        F--, V = null
    }, !1);
    var Y = {
        touches: {
            configurable: !0,
            get: function() {
                return this.__touches__ || (this.identifier = 0) || (this.__touches__ = F ? [this] : [])
            }
        },
        targetTouches: {
            configurable: !0,
            get: function() {
                return this.__targetTouches__ || (this.__targetTouches__ = F && this.currentTarget && (this.currentTarget == V || this.currentTarget.contains && this.currentTarget.contains(V)) ? [this] : [])
            }
        },
        changedTouches: {
            configurable: !0,
            get: function() {
                return this.touches
            }
        }
    };
    for (H in Y) UIEvent.prototype[H] = Y[H], Object.defineProperty(UIEvent.prototype, H, Y[H]);
    var X = {
        value: null,
        writable: !0,
        configurable: !0
    }, B = {
            touches: X,
            targetTouches: X,
            changedTouches: X
        };
    if (E.TouchEvent)
        for (H in B) E.TouchEvent.prototype[H] = B[H];
    q.customEvents.tap = {
        observe: {
            mousedown: document,
            touchstart: document
        },
        gesture: {
            tolerance: 8
        },
        condition: function(e, t) {
            var n = e.target;
            switch (e.type) {
                case "touchstart":
                    return n.__tap__ && n.__tap__.click && y(n, t), b(n, t, e), void 0;
                case "mousedown":
                    return n.__tap__ || b(n, t, e), void 0;
                case "scroll":
                case "touchcancel":
                    return y(this, t), void 0;
                case "touchmove":
                case "touchend":
                    return this.__tap__ && !w(this, t, e) ? (y(this, t), void 0) : "touchend" == e.type || null;
                case "click":
                    return y(this, t), !0
            }
        }
    }, E.xtag = q, "function" == typeof define && define.amd && define(q), L.addEventListener("WebComponentsReady", function() {
        q.fireEvent(L.body, "DOMComponentsLoaded")
    })
}();
! function() {
    function t(t, e) {
        this._historyStack = [], this.currIndex = -1, this._itemCap = void 0, this.itemCap = e, this._validatorFn = t ? t : function() {
            return !0
        }
    }

    function e(t) {
        var e = window.getComputedStyle(t),
            n = xtag.prefix.js + "TransitionDuration";
        return e.transitionDuration ? e.transitionDuration : e[n]
    }

    function n(t) {
        if ("string" != typeof t) return 0;
        var e = /^(\d*\.?\d+)(m?s)$/,
            n = t.toLowerCase().match(e);
        if (n) {
            var r = n[1],
                i = n[2],
                a = parseFloat(r);
            if (isNaN(a)) throw "value error";
            if ("s" === i) return 1e3 * a;
            if ("ms" === i) return a;
            throw "unit error"
        }
        return 0
    }

    function r(t, e) {
        return (t % e + e) % e
    }

    function i(t) {
        return xtag.queryChildren(t, "x-card")
    }

    function a(t, e) {
        var n = i(t);
        return isNaN(parseInt(e)) || 0 > e || e >= n.length ? null : n[e]
    }

    function o(t, e) {
        var n = i(t);
        return n.indexOf(e)
    }

    function s(t, r, a, s, u) {
        t.xtag._selectedCard = a;
        var c = new Date;
        t.xtag._lastAnimTimestamp = c;
        var h = function() {
            c === t.xtag._lastAnimTimestamp && (l(t), xtag.fireEvent(t, "shuffleend", {
                detail: {
                    oldCard: r,
                    newCard: a
                }
            }))
        };
        if (a === r) return h(), void 0;
        var f = !1,
            v = !1,
            p = !1,
            g = function() {
                f && v && (i(t).forEach(function(t) {
                    t.removeAttribute("selected"), t.removeAttribute("leaving")
                }), r.setAttribute("leaving", !0), a.setAttribute("selected", !0), t.xtag._selectedCard = a, t.selectedIndex = o(t, a), u && (r.setAttribute("reverse", !0), a.setAttribute("reverse", !0)), xtag.fireEvent(t, "shufflestart", {
                    detail: {
                        oldCard: r,
                        newCard: a
                    }
                }))
            }, m = function() {
                p || f && v && b()
            }, b = function() {
                p = !0;
                var t = !1,
                    i = !1,
                    o = !1,
                    u = function(e) {
                        o || (e.target === r ? (t = !0, r.removeEventListener("transitionend", u)) : e.target === a && (i = !0, a.removeEventListener("transitionend", u)), t && i && (o = !0, h()))
                    };
                r.addEventListener("transitionend", u), a.addEventListener("transitionend", u);
                var c = n(e(r)),
                    l = n(e(a)),
                    f = Math.max(c, l),
                    v = 1.15,
                    g = "none" === s.toLowerCase() ? 0 : Math.ceil(f * v);
                0 === g ? (o = !0, r.removeEventListener("transitionend", u), a.removeEventListener("transitionend", u), r.removeAttribute(d), a.removeAttribute(d), h()) : (r.removeAttribute(d), a.removeAttribute(d), window.setTimeout(function() {
                    o || (o = !0, r.removeEventListener("transitionend", u), a.removeEventListener("transitionend", u), h())
                }, g))
            };
        xtag.skipTransition(r, function() {
            return r.setAttribute("card-anim-type", s), r.setAttribute(d, !0), f = !0, g(), m
        }, this), xtag.skipTransition(a, function() {
            return a.setAttribute("card-anim-type", s), a.setAttribute(d, !0), v = !0, g(), m
        }, this)
    }

    function u(t, e, n, r, a) {
        var o = t.xtag._selectedCard;
        if (o === e) {
            var u = {
                detail: {
                    oldCard: o,
                    newCard: e
                }
            };
            return xtag.fireEvent(t, "shufflestart", u), xtag.fireEvent(t, "shuffleend", u), void 0
        }
        l(t), void 0 === n && (console.log("defaulting to none transition"), n = "none");
        var c;
        switch (r) {
            case "forward":
                c = !1;
                break;
            case "reverse":
                c = !0;
                break;
            default:
                o || (c = !1);
                var d = i(t);
                c = d.indexOf(e) < d.indexOf(o) ? !0 : !1
        }
        e.hasAttribute("transition-override") && (n = e.getAttribute("transition-override")), a || t.xtag.history.pushState(e), s(t, o, e, n, c)
    }

    function c(t, e, n, r) {
        var i = a(t, e);
        if (!i) throw "no card at index " + e;
        u(t, i, n, r)
    }

    function l(t) {
        if (t.xtag._initialized) {
            var e = i(t),
                n = t.xtag._selectedCard;
            n && n.parentNode === t || (n = e.length > 0 ? t.xtag.history && t.xtag.history.numStates > 0 ? t.xtag.history.currState : e[0] : null), e.forEach(function(t) {
                t.removeAttribute("leaving"), t.removeAttribute(d), t.removeAttribute("card-anim-type"), t.removeAttribute("reverse"), t !== n ? t.removeAttribute("selected") : t.setAttribute("selected", !0)
            }), t.xtag._selectedCard = n, t.selectedIndex = o(t, n)
        }
    }
    var d = "_before-animation",
        h = t.prototype;
    h.pushState = function(t) {
        if (this.canRedo && this._historyStack.splice(this.currIndex + 1, this._historyStack.length - (this.currIndex + 1)), this._historyStack.push(t), this.currIndex = this._historyStack.length - 1, this.sanitizeStack(), "none" !== this._itemCap && this._historyStack.length > this._itemCap) {
            var e = this._historyStack.length;
            this._historyStack.splice(0, e - this._itemCap), this.currIndex = this._historyStack.length - 1
        }
    }, h.sanitizeStack = function() {
        for (var t, e = this._validatorFn, n = 0; n < this._historyStack.length;) {
            var r = this._historyStack[n];
            r !== t && e(r) ? (t = r, n++) : (this._historyStack.splice(n, 1), n <= this.currIndex && this.currIndex--)
        }
    }, h.forwards = function() {
        this.canRedo && this.currIndex++, this.sanitizeStack()
    }, h.backwards = function() {
        this.canUndo && this.currIndex--, this.sanitizeStack()
    }, Object.defineProperties(h, {
        DEFAULT_CAP: {
            value: 10
        },
        itemCap: {
            get: function() {
                return this._itemCap
            },
            set: function(t) {
                if (void 0 === t) this._itemCap = this.DEFAULT_CAP;
                else if ("none" === t) this._itemCap = "none";
                else {
                    var e = parseInt(t, 10);
                    if (isNaN(t) || 0 >= t) throw "attempted to set invalid item cap: " + t;
                    this._itemCap = e
                }
            }
        },
        canUndo: {
            get: function() {
                return this.currIndex > 0
            }
        },
        canRedo: {
            get: function() {
                return this.currIndex < this._historyStack.length - 1
            }
        },
        numStates: {
            get: function() {
                return this._historyStack.length
            }
        },
        currState: {
            get: function() {
                var t = this.currIndex;
                return t >= 0 && t < this._historyStack.length ? this._historyStack[t] : null
            }
        }
    }), xtag.register("x-deck", {
        lifecycle: {
            created: function() {
                var e = this;
                e.xtag._initialized = !0;
                var n = function(t) {
                    return t.parentNode === e
                };
                e.xtag.history = new t(n, t.DEFAULT_CAP), e.xtag._selectedCard = e.xtag._selectedCard ? e.xtag._selectedCard : null, e.xtag._lastAnimTimestamp = null, e.xtag.transitionType = "scrollLeft";
                var r = e.getCardAt(e.getAttribute("selected-index"));
                r && (e.xtag._selectedCard = r), l(e);
                var i = e.xtag._selectedCard;
                i && e.xtag.history.pushState(i)
            }
        },
        events: {
            "show:delegate(x-card)": function() {
                var t = this;
                t.show()
            }
        },
        accessors: {
            transitionType: {
                attribute: {
                    name: "transition-type"
                },
                get: function() {
                    return this.xtag.transitionType
                },
                set: function(t) {
                    this.xtag.transitionType = t
                }
            },
            selectedIndex: {
                attribute: {
                    skip: !0,
                    name: "selected-index"
                },
                get: function() {
                    return o(this, this.xtag._selectedCard)
                },
                set: function(t) {
                    this.selectedIndex !== t && c(this, t, "none"), this.setAttribute("selected-index", t)
                }
            },
            historyCap: {
                attribute: {
                    name: "history-cap"
                },
                get: function() {
                    return this.xtag.history.itemCap
                },
                set: function(t) {
                    this.xtag.history.itemCap = t
                }
            },
            numCards: {
                get: function() {
                    return this.getAllCards().length
                }
            },
            currHistorySize: {
                get: function() {
                    return this.xtag.history.numStates
                }
            },
            currHistoryIndex: {
                get: function() {
                    return this.xtag.history.currIndex
                }
            },
            cards: {
                get: function() {
                    return this.getAllCards()
                }
            },
            selectedCard: {
                get: function() {
                    return this.getSelectedCard()
                }
            }
        },
        methods: {
            shuffleTo: function(t, e) {
                var n = a(this, t);
                if (!n) throw "invalid shuffleTo index " + t;
                var r = this.xtag.transitionType;
                c(this, t, r, e)
            },
            shuffleNext: function(t) {
                t = t ? t : "auto";
                var e = i(this),
                    n = this.xtag._selectedCard,
                    a = e.indexOf(n);
                a > -1 && this.shuffleTo(r(a + 1, e.length), t)
            },
            shufflePrev: function(t) {
                t = t ? t : "auto";
                var e = i(this),
                    n = this.xtag._selectedCard,
                    a = e.indexOf(n);
                a > -1 && this.shuffleTo(r(a - 1, e.length), t)
            },
            getAllCards: function() {
                return i(this)
            },
            getSelectedCard: function() {
                return this.xtag._selectedCard
            },
            getCardIndex: function(t) {
                return o(this, t)
            },
            getCardAt: function(t) {
                return a(this, t)
            },
            historyBack: function(t) {
                var e = this.xtag.history;
                if (e.canUndo) {
                    e.backwards();
                    var n = e.currState;
                    n && u(this, n, this.transitionType, t, !0)
                }
            },
            historyForward: function(t) {
                var e = this.xtag.history;
                if (e.canRedo) {
                    e.forwards();
                    var n = e.currState;
                    n && u(this, n, this.transitionType, t, !0)
                }
            }
        }
    }), xtag.register("x-card", {
        lifecycle: {
            inserted: function() {
                var t = this,
                    e = t.parentNode;
                e && "x-deck" === e.tagName.toLowerCase() && (l(e), t.xtag.parentDeck = e, xtag.fireEvent(e, "cardadd", {
                    detail: {
                        card: t
                    }
                }))
            },
            created: function() {
                var t = this.parentNode;
                t && "x-deck" === t.tagName.toLowerCase() && (this.xtag.parentDeck = t)
            },
            removed: function() {
                var t = this;
                if (t.xtag.parentDeck) {
                    var e = t.xtag.parentDeck;
                    e.xtag.history.sanitizeStack(), l(e), xtag.fireEvent(e, "cardremove", {
                        detail: {
                            card: t
                        }
                    })
                }
            }
        },
        accessors: {
            transitionOverride: {
                attribute: {
                    name: "transition-override"
                }
            }
        },
        methods: {
            show: function() {
                var t = this.parentNode;
                t === this.xtag.parentDeck && t.shuffleTo(t.getCardIndex(this))
            }
        }
    })
}();
! function() {
    function t(t) {
        var e = t.firstElementChild;
        if (!e) return {
            header: null,
            section: null,
            footer: null
        };
        var n = e.nextElementSibling;
        return {
            header: "HEADER" == e.nodeName ? e : null,
            section: "SECTION" == e.nodeName ? e : n && "SECTION" == n.nodeName ? n : null,
            footer: "FOOTER" == t.lastElementChild.nodeName ? t.lastElementChild : null
        }
    }

    function e(t, e) {
        var n = e.__layoutScroll__ = e.__layoutScroll__ || Object.defineProperty(e, "__layoutScroll__", {
            value: {
                last: e.scrollTop
            }
        }).__layoutScroll__,
            r = e.scrollTop,
            i = t.scrollBuffer;
        return n.max = n.max || Math.max(r + i, i), n.min = n.min || Math.max(r - i, i), n
    }

    function n(t, e) {
        t.setAttribute("content-maximizing", null), e.section && (e.header && (e.section.style.marginTop = "-" + e.header.getBoundingClientRect().height + "px"), e.footer && (e.section.style.marginBottom = "-" + e.footer.getBoundingClientRect().height + "px"))
    }

    function r(t, e) {
        t.removeAttribute("content-maximized"), t.removeAttribute("content-maximizing"), e.section && (e.section.style.marginTop = "", e.section.style.marginBottom = "")
    }

    function i(i) {
        if (!i.currentTarget.hasAttribute("content-maximizing")) {
            var a = i.target,
                o = i.currentTarget;
            if (this.scrollhide && (a.parentNode == o || xtag.matchSelector(a, o.scrollTarget))) {
                var s = a.scrollTop,
                    u = o.scrollBuffer,
                    c = t(o),
                    l = e(o, a);
                s > l.last ? l.min = Math.max(s - u, u) : s < l.last && (l.max = Math.max(s + u, u)), o.maxcontent || (s > l.max && !o.hasAttribute("content-maximized") ? n(o, c) : s < l.min && r(o, c)), l.last = s
            }
        }
    }
    xtag.register("x-layout", {
        lifecycle: {
            created: function() {}
        },
        events: {
            scroll: i,
            transitionend: function(e) {
                var n = t(this);
                !this.hasAttribute("content-maximizing") || e.target != n.header && e.target != n.section && e.target != n.footer || (this.setAttribute("content-maximized", null), this.removeAttribute("content-maximizing"))
            },
            "tap:delegate(section)": function(e) {
                var i = e.currentTarget;
                if (i.taphide && this.parentNode == i) {
                    var a = t(i);
                    i.hasAttribute("content-maximizing") || i.hasAttribute("content-maximized") ? i.maxcontent || r(i, a) : n(i, a)
                }
            },
            "mouseover:delegate(section)": function(e) {
                var r = e.currentTarget;
                !r.hoverhide || this.parentNode != r || r.hasAttribute("content-maximized") || r.hasAttribute("content-maximizing") || e.relatedTarget && !this.contains(e.target) || n(r, t(r))
            },
            "mouseout:delegate(section)": function(e) {
                var n = e.currentTarget;
                !n.hoverhide || this.parentNode != n || !n.hasAttribute("content-maximized") && !n.hasAttribute("content-maximizing") || n != e.relatedTarget && n.contains(e.relatedTarget) || r(n, t(n))
            }
        },
        accessors: {
            scrollTarget: {
                attribute: {
                    name: "scroll-target"
                }
            },
            scrollBuffer: {
                attribute: {
                    name: "scroll-buffer"
                },
                get: function() {
                    return Number(this.getAttribute("scroll-buffer")) || 30
                }
            },
            taphide: {
                attribute: {
                    "boolean": !0
                }
            },
            hoverhide: {
                attribute: {
                    "boolean": !0
                }
            },
            scrollhide: {
                attribute: {
                    "boolean": !0
                }
            },
            maxcontent: {
                attribute: {
                    "boolean": !0
                },
                set: function(e) {
                    var i = t(this);
                    e ? n(this, i) : this.hasAttribute("content-maximizing") || r(this, i)
                }
            }
        }
    })
}();
! function() {
    function t() {
        var t = document.documentElement,
            e = {
                left: t.scrollLeft || document.body.scrollLeft || 0,
                top: t.scrollTop || document.body.scrollTop || 0,
                width: t.clientWidth,
                height: t.clientHeight
            };
        return e.right = e.left + e.width, e.bottom = e.top + e.height, e
    }

    function e(e) {
        var n = e.getBoundingClientRect(),
            r = t(),
            i = r.left,
            a = r.top;
        return {
            left: n.left + i,
            right: n.right + i,
            top: n.top + a,
            bottom: n.bottom + a,
            width: n.width,
            height: n.height
        }
    }

    function n(t, e, n) {
        return n.left <= t && t <= n.right && n.top <= e && e <= n.bottom
    }

    function r(t) {
        if ("x-tabbar" === t.parentNode.nodeName.toLowerCase()) {
            var e = t.targetEvent,
                n = t.targetSelector ? xtag.query(document, t.targetSelector) : t.targetElems;
            n.forEach(function(t) {
                xtag.fireEvent(t, e)
            })
        }
    }
    xtag.register("x-tabbar", {
        lifecycle: {
            created: function() {
                this.xtag.overallEventToFire = "show"
            }
        },
        events: {
            "tap:delegate(x-tabbar-tab)": function() {
                var t = xtag.query(this.parentNode, "x-tabbar-tab[selected]");
                t.length && t.forEach(function(t) {
                    t.removeAttribute("selected")
                }), this.setAttribute("selected", !0)
            }
        },
        accessors: {
            tabs: {
                get: function() {
                    return xtag.queryChildren(this, "x-tabbar-tab")
                }
            },
            targetEvent: {
                attribute: {
                    name: "target-event"
                },
                get: function() {
                    return this.xtag.overallEventToFire
                },
                set: function(t) {
                    this.xtag.overallEventToFire = t
                }
            }
        },
        methods: {}
    }), xtag.register("x-tabbar-tab", {
        lifecycle: {
            created: function() {
                this.xtag.targetSelector = null, this.xtag.overrideTargetElems = null, this.xtag.targetEvent = null
            }
        },
        events: {
            tap: function(t) {
                var i = t.currentTarget;
                if (t.changedTouches && t.changedTouches.length > 0) {
                    var a = t.changedTouches[0],
                        o = e(i);
                    n(a.pageX, a.pageY, o) && r(i)
                } else r(i)
            }
        },
        accessors: {
            targetSelector: {
                attribute: {
                    name: "target-selector"
                },
                get: function() {
                    return this.xtag.targetSelector
                },
                set: function(t) {
                    this.xtag.targetSelector = t, t && (this.xtag.overrideTargetElems = null)
                }
            },
            targetElems: {
                get: function() {
                    return this.targetSelector ? xtag.query(document, this.targetSelector) : null !== this.xtag.overrideTargetElems ? this.xtag.overrideTargetElems : []
                },
                set: function(t) {
                    this.removeAttribute("target-selector"), this.xtag.overrideTargetElems = t
                }
            },
            targetEvent: {
                attribute: {
                    name: "target-event"
                },
                get: function() {
                    if (this.xtag.targetEvent) return this.xtag.targetEvent;
                    if ("x-tabbar" === this.parentNode.nodeName.toLowerCase()) return this.parentNode.targetEvent;
                    throw "tabbar-tab is missing event to fire"
                },
                set: function(t) {
                    this.xtag.targetEvent = t
                }
            }
        },
        methods: {}
    })
}();