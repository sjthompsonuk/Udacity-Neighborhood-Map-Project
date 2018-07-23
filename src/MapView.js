import React from 'react';
import './index.css';
import MapOptions from './MapOptions.json'

class MapView extends React.Component {
    //Acts like the google maps callback init function

  markers = []

  // This has received new places props from parent so...WillReceiveProps lifecycle event
  componentWillReceiveProps(nextProps) {

      // Define self to allow it to be used within 'addEventListener'
      const self = this
      for (let i = 0; i < this.markers.length; i++) {
          if (this.markers[i].ghost === false) {
              this.markers[i].setMap(null)
          }
      }
      this.markers = []

      // The following group uses the location array to create an array of markers on initialize.

      for (let i = 0; i < nextProps.places.length; i++) {

        if (nextProps.places[i].display === true) {
            // Get the position from the location array.
            let position = nextProps.places[i].latlng
            let title = nextProps.places[i].title
            // Create a marker per location, and put into markers array.
            let marker = new window.google.maps.Marker({
              map: this.map,
              position: position,
              title: title,
              mapOptions: MapOptions.json,
              //animation: window.google.maps.Animation.DROP,
              id: i,
              //ghost property to keep same length marker array for list matching
              ghost: false
            })
            // Push the marker to our array of markers.
            this.markers.push(marker)


            // Create an onclick event to open an infowindow at each marker.
            marker.addListener('click', function() {
                self.activateMarker(this)
            })
            this.bounds.extend(nextProps.places[i].latlng)
        } else {
            let marker = {ghost: true}
            this.markers.push(marker)
        }

    }

      //Extend the boundaries of the map for each marker
    this.map.fitBounds(this.bounds)

    // When active marker id changes in parent state it is passed as new prop. Then populate the infowindow

    this.openInfoWindow(nextProps.activeMarker)
  }

  activateMarker = (marker) => {
      this.props.updateActiveMarker(marker.id)
  }

  openInfoWindow = (id) => {

      if (id !== null) {
          let marker = this.markers[id]
          marker.setAnimation(window.google.maps.Animation.BOUNCE)
          window.setTimeout(function() {
            marker.setAnimation(null)
        }, 1000)
          if (this.infowindow.marker !== marker) {
            this.infowindow.marker = marker
            this.infowindow.setContent(this.createContentString(id))
            this.infowindow.open(this.map, marker)
            // Make sure the marker property is cleared if the infowindow is closed.
            const self = this
            this.infowindow.addListener('closeclick',function(){
              self.infowindow.setMarker = null
              self.props.updateActiveMarker(null)
            })
          }
      }
  }

  createContentString = (id) => {
      //TODO image attribute, wiki/google)
      let place = this.props.places[id]
      let wikiUrl = 'https://en.wikipedia.org/wiki/' + place.urlTitle
      let contentString = ''
      contentString += `<div class=infowindow>`
      //picture is loaded 200px wide
      contentString += `<div class="placeimage"><img id="placeimage" alt="picture of ${place.urlTitle}" src="${place.urlImage}""></div>`
      contentString += `<h4><a href="${wikiUrl}">${place.urlTitle}</a></h4>`
      contentString += `<p>${place.description}</p>`
      contentString += (`<p class="credit">Image: ${place.credit}</p>`)
      contentString += `</div>`

      return (contentString)
  }

  componentDidMount() {
      //LOAD MAP
    this.map = new window.google.maps.Map(document.getElementById('map'), {
      center: {lat: 51.5, lng: -0.11},
      zoom: 12,
      //mapTypeId: 'roadmap',
      disableDefaultUI: true,
      styles: MapOptions
    })

    this.infowindow = new window.google.maps.InfoWindow()
    this.bounds = new window.google.maps.LatLngBounds()

  }

  render() {
    return (
        <div id='map' />
    )
  }
}

export default MapView
