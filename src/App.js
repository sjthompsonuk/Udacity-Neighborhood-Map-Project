import React, { Component } from 'react';
import './index.css'
import MapView from './MapView'
import Sidebar from './Sidebar'

class App extends Component {

  state = {

     // TODO turn this to JSON?

     // TODO Add info from Wiki or FourSquare for infoWindow
    places: [
        {title: 'The Tower of London', search: 'tower+of+london'},
        {title: 'Big Ben', search: 'big+ben,+london'},
        {title: 'Buckingham Palace', search: 'buckingham+palace,+london'},
        {title: 'The Shard', search: 'the+shard,+london'},
        {title: 'The British Museum', search: 'the+british+museum,+london'}
    ],
    wikiData: {},
    activeMarker: null,
    query: ''
  }

  tempData = []
  //Below is object with seperate index array so it can be correctly merged after both API async calls are made, as the order of reuturns is unknown
  tempWikiData = {}
  tempWikiDataIndex = []
  search = 'https://en.wikipedia.org/w/api.php?action=query&origin=*&format=json&prop=pageimages|description&pageids='

  updateQuery = (query) => {
      this.setState({
          query,
          activeMarker:null
      })
      this.tempData = this.state.places
      for (let i = 0; i < this.tempData.length; i++) {
          this.tempData[i].display = (this.tempData[i].title.toLowerCase().includes(query)) ? true : false
      }
      this.setState({places:this.tempData})
  }

  updateActiveMarker = (id) => {
      if (this.state.activeMarker === id) {
          this.setState({activeMarker:null})
      } else {
          this.setState({activeMarker:id})
      }
  }

  componentDidMount() {
      this.getAllData()
  }

  getAllData = () => {
      console.log('async getData call for each place')
      for (let i = 0; i < this.state.places.length; i++) {
          //Google API requests
          this.tempData = []
          this.getData(this.state.places[i])
          // Wiki API requests
          this.tempWikiDataIndex = []
          this.tempWikiData = {}
          this.getWikiData(this.state.places[i])
      }
  }
  //Google API requests
  getData = async (entry) => {
      //API request here and map searchPlaces into placesData
      const api_call = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${entry.search}&key=AIzaSyAQ8K05Bp11d0n6XLbb3eZd5vohjzGqWdU`)
      const data = await api_call.json()
      if (data.status === "OK") {
          let item = entry
          item.latlng = data.results[0].geometry.location
          item.display = true
          this.tempData.push(item)
          //Check if searches all returned and entered into tempData before updating App
          if (this.tempData.length === this.state.places.length) {
              //Tag items with id number matching order in array (to match marker id)
              for (let i =0; i < this.tempData.length; i++) {
                  this.tempData[i].id = i
              }
              // TODO Dont allow to setState until wiki also ready then do together
              this.setState({places:this.tempData})
          }
      } else {
          alert(`There was an error with the Google API ${data.status}`)
      }
  }

  //Wiki API requests
  //TODO will be 2 batches of requests, many, then 1
  getWikiData = async (entry) => {
      //API request here to create object searchable by title...as may be in differnt order to 'places'
      try {
          const api_call = await fetch(`https://en.wikipedia.org/w/api.php?action=query&origin=*&list=search&srlimit=1&format=json&srsearch=${entry.title}`)
          console.log(api_call)
          const data = await api_call.json()
          console.log(data)
          let item = entry
          item.pageid = data.query.search[0].pageid
          this.tempWikiData[entry.title] = item
          this.tempWikiDataIndex.push(data.query.search[0].pageid)

          //once all item pageids found run full data pull
          if (this.tempWikiDataIndex.length === this.state.places.length) {
              console.log(this.tempWikiDataIndex)
              this.getAdditionalWikiData()
          }

      } catch (error) {console.log(error)}

      //TODO add better error handling

  }

  getAdditionalWikiData = async () => {
      //Make search string
      let search = 'https://en.wikipedia.org/w/api.php?action=query&origin=*&prop=pageimages|description&format=json&formatversion=2&pageids=3969'
      //for (let i = 0; i < this.tempWikiDataIndex.length; i++) {
    //      search = search + this.tempWikiDataIndex[i] + '|'
     // }
      console.log(search)
      //do async API request
      try {
          const api_call = await fetch(`search`)
          let data = await api_call.json()
          console.log(data)


      } catch (error) {console.log(error)}
      //TODO add better error handling
  }

  render() {
    return (
      <div id="app">
        <Sidebar query={this.state.query} updateQuery={this.updateQuery} updateActiveMarker={this.updateActiveMarker} places={this.state.places} populateInfoWindow={this.populateInfoWindow} />
        <MapView activeMarker={this.state.activeMarker} updateActiveMarker={this.updateActiveMarker} places={this.state.places} populateInfoWindow={this.populateInfoWindow} />
      </div>
    )
  }

}

export default App
