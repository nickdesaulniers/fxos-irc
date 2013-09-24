#FXOS IRC

## Notes
* Uses a [modified version](https://github.com/nickdesaulniers/node-irc) of [node-irc](https://github.com/martynsmith/node-irc), [shimmed out](https://github.com/nickdesaulniers/node-irc/commit/c7281891232db4b27ce1c5e32c34eaabf50c459e) for fxos.  Need to fix this up and contribute back upstream.
* Since node-irc is GPLv3, and this uses a derivative of node-irc, this whole codebase needs to be GPLv3'd.
* [API](https://node-irc.readthedocs.org/en/latest/API.html) for node-irc
* Uses [brick](http://mozilla.github.io/brick/), but [modified](https://github.com/mozilla/brick/issues/63)
* I'd like to see something where the user first selects from a list of pre entered servers, maybe stored via indexxedDB or localstorage, then selects or enters a room to join and can flip between multiple rooms they are in.
* my node-irc has a bunch of logging statements commented out, comment these back in for help debugging
* this is a packaged app.  refreshing a packaged app is [broken](https://github.com/mozilla/r2d2b2g/issues/776).  What I have to do is, quit the simulator (leave dashboard open), Refresh, Connect, Refresh
* Current state: once open, enter host and username (irc.mozilla.org and asdasdasd) then press connect

