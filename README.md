#FXOS IRC

## Notes
* Uses a [modified version](https://github.com/nickdesaulniers/node-irc) of [node-irc](https://github.com/martynsmith/node-irc), [shimmed out](https://github.com/nickdesaulniers/node-irc/commit/c7281891232db4b27ce1c5e32c34eaabf50c459e) for fxos.  Need to fix this up and contribute back upstream.
* [API](https://node-irc.readthedocs.org/en/latest/API.html) for node-irc
* Uses [brick](http://mozilla.github.io/brick/)
* my node-irc has a bunch of logging statements commented out, comment these back in for help debugging
* this is a packaged app.  refreshing a packaged app is [broken](https://github.com/mozilla/r2d2b2g/issues/776).  What I have to do is, quit the simulator (leave dashboard open), Refresh, Connect, Refresh

