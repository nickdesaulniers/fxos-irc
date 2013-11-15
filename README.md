#Firesea IRC

## Notes
* Uses a [modified version](https://github.com/nickdesaulniers/node-irc) of [node-irc](https://github.com/martynsmith/node-irc), [shimmed out](https://github.com/nickdesaulniers/node-irc/commit/c7281891232db4b27ce1c5e32c34eaabf50c459e) for fxos.  Need to fix this up and contribute back upstream.
* [API](https://node-irc.readthedocs.org/en/latest/API.html) for node-irc
* Uses [brick](http://mozilla.github.io/brick/)
* my node-irc has a bunch of logging statements commented out, comment these back in for help debugging
* this is a packaged app.  refreshing a packaged app is [broken](https://github.com/mozilla/r2d2b2g/issues/776).  What I have to do is, quit the simulator (leave dashboard open), Refresh, Connect, Refresh

## Running in Desktop Firefox
1. Turn on mozTCPSocket pref
2. Add tcp-socket permission for a domain
  a. Hosting it locally
  - or -
  b. Github pages
3. Run

[Idea](https://github.com/mozilla-b2g/gaia/tree/master/apps/email#running-in-firefox)
from @asutherland

### 1. Turn on mozTCPSocket pref
* Open "about:config" in the browser.
* Right-click anywhere in the config setting listing, and choose "New",
"Boolean" from the context menu.
* Enter "dom.mozTCPSocket.enabled" in the "Enter the preference name" box and
click the "OK" button.
* Select "true" on the next dialog box and click the "OK" button.

### Add tcp-socket permission for a domain (locally)
So you could run this from github pages, or from your local machine.  Hosting
it locally is a better idea, because theoritically Github could serve you
different assets that abuse the ability to create TCP sockets.  Far-fetched
but possible.

I'd recommend (this part optional, but recommended) that you add a domain to
your hosts file that redirects back to your machine, that way you're not
allowing any site on localhost to use TCP sockets.  I added the following to
the bottom of my `/etc/hosts` file:

```
127.0.0.1 firesea.mozilla.org
```

### Add tct-socket permission for a domain (gh-pages)
Not implemented yet.

For whichever method you choose (locally or gh-pages), you need to add a
permission for it.  If you are hosting it locally, you would:

Bring up the error console in firefox by hitting control-shift-J. Paste the
code into the "Code" box and click the "evaluate" button.

```
host = 'http://firesea.mozilla.org:8000';
perm = Components.classes["@mozilla.org/permissionmanager;1"]
                 .createInstance(Components.interfaces.nsIPermissionManager);
ios = Components.classes["@mozilla.org/network/io-service;1"]
                .getService(Components.interfaces.nsIIOService);
uri = ios.newURI(host, null, null);
perm.add(uri, 'tcp-socket', 1);
```

This will allow `http://firesea.mozilla.org:8000` permssion to create and use
TCP sockets.  Tailor as needed.

XXX: TODO find out how to remove permission since it's not in about:permissions

### Run
I serve this locally with the command `python -m SimpleHTTPServer`.  I *should*
host the assets somewhere so you don't have to host them yourself, and create
an add-on to add the pref and permission, but I haven't yet.  I don't know
when TCPSockets will land in desktop FF pref'd off.

Once serving, go to `http://firesea.mozilla.org:8000` and enjoy.

