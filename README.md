# BoReLESS - Grunt Bower + RequireJS + LESS Boilerplate

This is a boilerplate to ease builds of web projects utilising RequireJS, having several JS library dependencies. Unlike Yeoman & other tools, this is a pure Grunt script with full transparency on how the build is handled; there is no magic.

## Installation

If you don't already have node.js 0.8.x or later, fetch it from [nodejs.org](http://www.nodejs.org/). In addition we need a few dependencies you may have.

    > npm install -g bower grunt-cli

Installing the project itself is easy. Both build system dependencies and app dependencies are triggered by

    > npm install

It actually performs a release build, too (to verify that everything is ok).

## Building

To trigger **debug** build

    > grunt debug

To trigger **release** build

    > grunt release

## Running the Service

Most likely the normal *grunt server* will fail (yet there is no big reason why it should). The system comes with bundled *node/express* stack, because that is likely you would use for development use, anyway. Start the server in **debug** mode by

    > npm start

Note that if you have run *grunt debug* in another window, it should be rebuilding your changed pages in the background.

To test the service in **release** mode, use

    > grunt release
    > NODE_ENV=production node server/server.js

##  Extending & Hacking

###  Project layout

#### App

    client/             The client-side source code
    client/index.html   The HTML entry point, stub page
    client/app          Application source code
    client/app/main.js  The app JS entry point
    client/components   The 3rd party JS dependencies
    client/css          The CSS templates


####  Build System

    grunt.js            The Grunt build configuration
    components.json     The Bower components
    .bowerrc            The Bower directory overrides
    package.json        The build level dependencies

###  Server Stub

    server/server.js    The stub static file server
    server/package.json The server specific dependencies

### Build Results

    staging/            Results of the build step
    dist/               Minified & optimised version

## TODO

* Use some sensible app boilerplate (or fetch it from another project)
* Add Cordova builds (or put it its own branch or an example)
* Add templating language compilation into JS RequireJS modules
* Add tests and travis configuration
* Add some examples & documentation

## Release History

* 2013/01/16 - v0.1.0 - Initial release
* 2013/03/10 - v0.2.0 - Update to Grunt 0.4.0

## License

Copyright (c) 2013 [SC5](http://sc5.io/), licensed for users and contributors under MIT license.
https://github.com/sc5/grunt-boreless-boilerplate/blob/master/LICENSE-MIT
