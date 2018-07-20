import React from 'react';
import './index.css';

class MapView extends React.Component {
    //Acts like the google maps callback init function


  markers = []
  // This has received new places props from parent so...WillReceiveProps lifecycle event
  componentWillReceiveProps() {

      // Define self to allow it to be used within 'addEventListener'
      const self = this

      //this.infoWindow = new window.google.maps.InfoWindow();

      // The following group uses the location array to create an array of markers on initialize.

     this.infowindow = new window.google.maps.InfoWindow();
     this.bounds = new window.google.maps.LatLngBounds();

      for (let i = 0; i < this.props.places.length; i++) {
        // Get the position from the location array.
        let position = this.props.places[i].latlng
      //console.log(this.props.places[i])
        //console.log(this.props.places[i].latlng)
        let title = this.props.places[i].title
        //console.log(this.props.places[i].title)
        // Create a marker per location, and put into markers array.
        let marker = new window.google.maps.Marker({
          map: this.map,
          position: position,
          title: title,
          animation: window.google.maps.Animation.DROP,
          id: i
        })
        // Push the marker to our array of markers.
        this.markers.push(marker);


        // Create an onclick event to open an infowindow at each marker.
        marker.addListener('click', function() {
            self.activateMarker(this)
        })
        this.bounds.extend(this.markers[i].position)
    }
      // TODO ?? Extend the boundaries of the map for each marker
    this.map.fitBounds(this.bounds)

  }

  activateMarker = (marker) => {
      console.log('activateMarker triggered')
      if (this.infowindow.marker != marker) {
        this.infowindow.marker = marker
        this.infowindow.setContent('<div>' + marker.title + '</div>')
        this.infowindow.open(this.map, marker)
        // Make sure the marker property is cleared if the infowindow is closed.
        const self = this
        this.infowindow.addListener('closeclick',function(){
          self.infowindow.setMarker = null
        })
      }
  }

  componentDidMount() {
      //LOAD MAP
    this.map = new window.google.maps.Map(document.getElementById('map'), {
      center: {lat: 51.5, lng: -0.11},
      zoom: 12,
      mapTypeId: 'roadmap',
    })

    //this.infoWindow = new window.google.maps.InfoWindow()
    //this.bounds = new window.google.maps.LatLngBounds()

  }

  render() {
    return (
        <div id='map' />
    )
  }
}

export default MapView
