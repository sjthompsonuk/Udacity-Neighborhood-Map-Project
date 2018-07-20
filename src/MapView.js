import React from 'react';
import './index.css';

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

      //this.infoWindow = new window.google.maps.InfoWindow();

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
          if (this.infowindow.marker != marker) {
            this.infowindow.marker = marker
            this.infowindow.setContent('<div>' + marker.title + '</div>')
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

  componentDidMount() {
      //LOAD MAP
    this.map = new window.google.maps.Map(document.getElementById('map'), {
      center: {lat: 51.5, lng: -0.11},
      zoom: 12,
      mapTypeId: 'roadmap',
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
