import React, { Component } from 'react';
import './index.css'
import MapView from './MapView'
import Sidebar from './Sidebar'
import Places from './Places.json'

class App extends Component {

  state = {
    // Here add titles, which become the search strings in both Maps API and Wiki API
    places: Places,
    activeMarker: null,
    query: ''
  }

  tempData = []
  //Below is object with seperate index array so it can be correctly merged after both API async calls are made, as the order of reuturns is unknown
  tempWikiData = []
  search = 'https://en.wikipedia.org/w/api.php?action=query&origin=*&format=json&prop=pageimages|description&pageids='
  wikiComplete = false
  googleComplete = false
  wikiDataCount = 0
  //Preload images
  images = []

  updateQuery = (query) => {
      this.setState({
          query,
          activeMarker:null
      })
      this.tempData = this.state.places
      for (let i = 0; i < this.tempData.length; i++) {
          this.tempData[i].display = (this.tempData[i].urlTitle.toLowerCase().includes(query)) ? true : false
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
      this.tempData = []
      this.tempWikiData = this.state.places
      for (let i = 0; i < this.state.places.length; i++) {
          //Google API requests
          this.getData(this.state.places[i])
          // Wiki API requests
          this.getWikiData(this.tempWikiData[i])
      }
  }
  //Google API requests
  getData = async (entry) => {

      try {
          //API request here and map searchPlaces into placesData
          const api_call = await fetch(`https://maps.googleapis.com/maps/api/geocode/json?address=${entry.title}&key=AIzaSyAQ8K05Bp11d0n6XLbb3eZd5vohjzGqWdU`)
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
                  this.googleComplete = true
                  // Dont allow to setState until wiki also ready then do together
                  if (this.wikiComplete === true) {
                      console.log('wiki api finished first')
                      this.mergeApiData()
                  }
              }
          } else {
              alert(`There was an error with the Google API return`)
              console.log(data.status)
              console.log(data)
          }
      } catch (error) {
          alert('Sorry there was a problem retreiving data from the Google Maps API - try again later. See console for more detail')
          console.log(error)
      }

  }

  //Wiki API requests
  //TODO will be 2 batches of requests, many, then 1
  getWikiData = async (entry) => {
      //API request here to create object searchable by title...as may be in differnt order to 'places'
      try {
          const api_call = await fetch(`https://en.wikipedia.org/w/api.php?action=query&origin=*&list=search&srlimit=1&format=json&srsearch=${entry.title}`)
          const data = await api_call.json()
          let item = entry
          item.pageid = data.query.search[0].pageid
          entry = item
          this.wikiDataCount += 1
          //once all item pageids found run full data pull
          if (this.wikiDataCount === this.state.places.length) {
              this.wikiDataCount = 0
              this.getAdditionalWikiData()
          }

      } catch (error) {
          alert('Sorry there was a problem retreiving data from Wikipedia - try again later. See console for more detail')
          console.log(error)
      }

  }

  getAdditionalWikiData = async () => {
      //Make search string
      let search = 'https://en.wikipedia.org/w/api.php?action=query&origin=*&prop=pageimages|description&format=json&formatversion=2&pageids='
      for (let i = 0; i < this.tempWikiData.length; i++) {
          search = search + this.tempWikiData[i].pageid
          if (i < (this.tempWikiData.length - 1)) {
              search = search + `|`
          }
      }
      //do async API request
      try {
          const api_call = await fetch(`${search}`)
          let data = await api_call.json()

          // Loop through all items in the tempWikiData which is indexed by PLACE title (not wikipedia page titles which may be similar/same), to add remaining data.
          //TODO make this update the tempWikiData object correctly
          for (let i = 0; i < this.tempWikiData.length; i++) {
              let item = this.tempWikiData[i]
              let num = item.pageid
              for (let j = 0; j < data.query.pages.length; j++) {
                  let page = data.query.pages[j]
                  if (page.pageid === num) {
                      item.urlTitle = page.title
                      item.description = page.description
                      item.image = page.pageimage
                  }
              }
          }
          this.addWikiMediaImagesAll()

      } catch (error) {
          alert('Sorry there was a problem retreiving data from Wikipedia - try again later. See console for more detail')
          console.log(error)
      }
  }

  addWikiMediaImagesAll = () => {
      for (let i = 0; i < this.tempWikiData.length; i++) {
          this.addWikiMediaImages(this.tempWikiData[i])
      }
  }

  addWikiMediaImages = async (item) => {
      //Make search string
      let search = 'https://commons.wikimedia.org/w/api.php?action=query&format=json&origin=*&prop=imageinfo&iiurlwidth=400&iiprop=url|extmetadata&titles=File:'
      try {
          const api_call = await fetch(search + item.image)
          let data = await api_call.json()
          for (let key in data.query.pages) {
              //Preload image
              let image = new Image()
              image.src = data.query.pages[key].imageinfo[0].thumburl
              this.images.push(image)
              item.urlImage = data.query.pages[key].imageinfo[0].thumburl
              item.credit = data.query.pages[key].imageinfo[0].extmetadata.Artist.value
          }
          this.wikiDataCount += 1
          if (this.wikiDataCount === this.tempWikiData.length) {
              this.wikiDataCount = 0
              this.wikiComplete = true
              if (this.googleComplete === true) {
                  console.log('google api finsihed first')
                  this.mergeApiData()
              }
          }

      } catch (error) {
          alert('Sorry there was a problem retreiving data from Wikimedia - try again later. See console for more detail')
          console.log(error)
      }

  }

  mergeApiData = () => {
      //will be called when both this.tempData array and this.tempWikiData objects are ready for merging and seting state.
      this.wikiComplete = false
      this.googleComplete = false
      //TODO change below
      console.log(this.tempData)
      console.log(this.tempWikiData)
      for (let i = 0; i < this.tempData.length; i++) {
          let googleItem = this.tempData[i]
          for (let j = 0; j < this.tempWikiData.length; j++) {
              let wikiItem = this.tempWikiData[j]
              if (googleItem.title === wikiItem.title) {
                  googleItem.pageid = wikiItem.pageid
                  googleItem.description = wikiItem.description
                  googleItem.urlImage = wikiItem.urlImage
                  googleItem.urlTitle = wikiItem.urlTitle
                  googleItem.image = wikiItem.image
                  googleItem.credit = wikiItem.credit
              }
          }
      }
      this.setState({places:this.tempData})
  }

  render() {
    return (
      <div id="app">
        <header>
          <h3>Iconic London Landmarks</h3>
        </header>
        <Sidebar query={this.state.query} updateQuery={this.updateQuery} updateActiveMarker={this.updateActiveMarker} places={this.state.places} populateInfoWindow={this.populateInfoWindow} />
        <MapView activeMarker={this.state.activeMarker} updateActiveMarker={this.updateActiveMarker} places={this.state.places} populateInfoWindow={this.populateInfoWindow} />
        <footer>
          <p>
            © Sam Thompson 2018 | Data:<a href="https://maps.google.com">Google Maps</a>|<a href="https://www.wikipedia.org">Wikipedia</a>|<a href="https://commons.wikimedia.org">Wikimedia Commons</a>
          </p>
        </footer>
      </div>
    )
  }

}

export default App
