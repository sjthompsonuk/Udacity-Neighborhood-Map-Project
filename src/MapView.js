import React from 'react';
import './index.css';

class MapView extends React.Component {
  componentDidMount() {
    let map = new window.google.maps.Map(document.getElementById('map'), {
      center: {lat: 51.5, lng: -0.11},
      zoom: 12,
      mapTypeId: 'roadmap',
    });
  }

  render() {
    return (
        <div id='map' />
    );
  }
};

export default MapView
