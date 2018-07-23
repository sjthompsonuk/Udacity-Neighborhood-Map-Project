# Neighborhood Map Project

## Overview

This project is part of the Udacity Front End Nanodegree Course. The intention is to build a React based single page app that integrates course content including responsive design, A11y, Offline First, as well as Web JS and API calls from multiple sources. I have selected several places in London as points of interest.

## Installation

The app is not in the build state, so to view it:

* Download the repo
* Run `npm install` - the basic react-create-app dependencies only, there are no additional dependencies required
* Run `npm start` - for the built in server, which will automatically load.

## Functionality

The App is fairly simple:

* Click any Landmark listed in the sidebar, or the relevant marker, to open an window with some additional information and an image of that landmark. Links to the full Wikipedia pages are included.

* To close the window click the listed item, or the relevant marker again. Clicking a different marker or landmark will close the current and open the new relevant window. You can also use the close window icon at the top right of the window.

* To filter the listed landmarks, simply type in the filter input textbox. Entries will be automatically converted to lower case.

* Clicking the 'clear filter' button will remove filter text, close any open information window and all Landmarks will display.

## Attribution

### APIs

Data is obtained through:

* Location and map data: Google Maps API
* Landmark information: Wikipedia
* Landmark imagery: Wikimedia Commons

### Images

Additional images are attributed as appropriate within the information windows. Further details can be found through links where applicable and via Wikimedia Commons.

### Google Maps API integration method

The technique I used to integrate React and Google Maps API, was to create a component wrapper for the API, as described in the article below by Sander Knape.

https://sanderknape.com/2017/07/integrating-reactjs-google-maps-widget/
