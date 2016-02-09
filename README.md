#### Install Dependencies
```
npm install
```

#### Start compiling, serving, and watching files
```
npm run development
```

This runs `gulp` from `./node_modules/bin`, using the version installed with this project, rather than a globally installed instance. All commands in the package.json `scripts` work this way. The `gulp` command runs the `default` task, defined in `gulpfile.js`.

All files will compile in development mode (uncompressed with source maps). [BrowserSync](http://www.browsersync.io/) will serve up files to `localhost:3000` and will stream live changes to the code and assets to all connected browsers. Don't forget about the additional BrowserSync tools available on `localhost:3001`!

```bash
npm run production
```

All files will compile without watching for changes

# Details
#### JS

Modular ES6 with [Babel](http://babeljs.io/)

#### CSS

Your Sass gets run through Autoprefixer, so don't prefix! Please use the indented `.scss` syntax

#### HTML

HTML is simply copied without any processing
