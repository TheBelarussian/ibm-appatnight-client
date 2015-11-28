# IBM Client for Bluemix Node Server using Alchemy API

# INSTALL & RUN

Please make sure you have node up and running (htt://nodejs.org)

1. Install all node packages using npm ‘npm install’
2. Install all bower dependencies ‘bower install’
3. Run gulp ‘gulp debug’ now you should have a webserver running on port 8888

- Only edit files in src
- The build folder is generated atomatical

 # WORKING WITH THE PROJECT

 Angular structure

 - app.js is the angular starting point src/app/app.js
 - all controllers and views should be placed in src/app/{{name}}view/
 - please name controller controller.js and the view view.html to maintain building order in gulp
 - services should be located src/app/services
 - directives should be placed in src/app/directives

 Styles

 - we are using sass(scss) a nested form of css with some sugar
 - files are found in src/assets/sass/
 - the css will be generated minified and placed in dist/assets/css/style.css (please link accordingly)

 If you want you can write normal css in sass with no problems

 Images

 - place images in src/assets/images

 Fonts

 - place fonts in src/assets/fonts
