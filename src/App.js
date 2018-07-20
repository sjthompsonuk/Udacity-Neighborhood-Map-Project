import React, { Component } from 'react';
import './index.css'
import MapView from './MapView'
import Sidebar from './Sidebar'

class App extends Component {

  state = {
    places: [
        {title: 'The Tower of London', search: 'tower+of+london'},
        {title: 'Big Ben', search: 'big+ben,+london'},
        {title: 'Buckingham Palace', search: 'buckingham+palace,+london'},
        {title: 'The Shard', search: 'the+shard,+london'},
        {title: 'The British Museum', search: 'the+british+museum,+london'}
    ],
    activeMarker: null
  }

  tempData = []

  updateActiveMarker = (id) => {
      this.setState({activeMarker:id})
  }

  componentDidMount() {
      this.getAllData()
  }

  getAllData = () => {
      //this.tempData = this.state.searchPlaces
      //console.log(this.tempData)
      for (let i = 0; i < this.state.places.length; i++) {
          this.getData(this.state.places[i])
      }
  }

  getData = async (entry) => {
      //API request here and map searchPlaces into placesData
      const api_call = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${entry.search}&key=AIzaSyAQ8K05Bp11d0n6XLbb3eZd5vohjzGqWdU`)
      const data = await api_call.json()
      if (data.status === "OK") {
          let item = entry
          item.latlng = data.results[0].geometry.location
          item.display = true
          item.id
          this.tempData.push(item)
          //Check if searches all returned and entered into tempData before updating App
          if (this.tempData.length === this.state.places.length) {
              //Tag items with id number matching order in array (to match marker id)
              for (let i =0; i < this.tempData.length; i++) {
                  this.tempData[i].id = i
              }
              this.setState({places:this.tempData})
          }
      } else {
          alert(`There was an error with the Google API ${data.status}`)
      }
  }

  render() {
    return (
      <div id="app">
        <Sidebar updateActiveMarker={this.updateActiveMarker} activeMarker={this.state.activeMarker} places={this.state.places} populateInfoWindow={this.populateInfoWindow} />
        <MapView activeMarker={this.state.activeMarker} places={this.state.places} populateInfoWindow={this.populateInfoWindow} />
      </div>
    )
  }

}

export default App
