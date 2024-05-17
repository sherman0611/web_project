# web_project

 1. npm install --save-dev nodemon
    After running the command, in package.json change to nodemon:
    "scripts": {
   "start": "nodemon ./bin/www"
   }
2.  npm i body-parser
3.  npm i socket.io
4.  npm i mongoose
5.  npm i multer

## To run the project
Open the project in WebStorm, go to bin/www file and click the 'Run' button.


## Google Maps API key
_AIzaSyBI3suTR3SBrWpTHrdDVscQQwqhRio-ukk_ \
to be pasted instead of 'HERE' below: \
"https://maps.googleapis.com/maps/api/js?key=HERE&callback=initMap" \
in plant_entry.ejs

## Potential UI issues
### Offline
- After creating a plant in an offline mode, you have to manually navigate to the /pending_posts page to see your entry
- If you go back online and either refresh the page or click "Upload Now" button, your plants will be uploaded to the system
### Online
- If you do not see your plants, you have to hard refresh the page 
  - to do this, you need to click CTRL+ALT+I (on Mac: Control and "Inspect" from the dropdown menu)
  - once you enter the Developer mode, you can press "refresh" button in top left corner of the page longer to see the "Empty Cache and Hard Reload"
- The same fix applies to the messages. If you refresh the page and it doesn't show the comments, hard reload.

## Contributors
- aca20aab / anborowc Anielka Borowczyk 
- sherman0611 Sherman Lam 
- RalucaCruceriu Raluca Cruceriu 
- xiaoge26 Xiaoge Liu