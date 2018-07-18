import React, { Component } from 'react';
import './index.css'
import MapView from './MapView'
import Sidebar from './Sidebar'

class App extends Component {

  state = {
    searchPlaces: [
        {title: 'The Tower of London', search: 'tower+of+london'},
        {title: 'Big Ben', search: 'big+ben,+london'},
        {title: 'Buckingham Palace', search: 'buckingham+palace,+london'},
        {title: 'The Shard', search: 'the+shard,+london'},
        {title: 'The British Museum', search: 'the+british+museum,+london'}
    ],
    placesData: []
  }

  tempData = []

  componentDidMount() {
      this.getAllData()
      this.setState({placesData:this.tempData}, function() {
          // TODO Place anything here we want to occur after set satte has taken effect
      })
  }

  getAllData = () => {
      for (let i = 0; i < this.state.searchPlaces.length; i++) {
          this.getData(this.state.searchPlaces[i])
      }
  }

  getData = async (entry) => {
      //API request here and map searchPlaces into placesData
      const api_call = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${entry.search}&key=AIzaSyAQ8K05Bp11d0n6XLbb3eZd5vohjzGqWdU`)
      const data = await api_call.json()
      if (data.status === "OK") {
          let item = entry
          item.latlng = data.results[0].geometry.location
          this.tempData.push(item)
      } else {
          alert(`There was an error with the Google API ${data.status}`)
      }
  }

  render() {
    return (
      <div id="app">
        <Sidebar />
        <MapView />
      </div>
    )
  }

}

export default App
