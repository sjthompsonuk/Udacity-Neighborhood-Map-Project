import React, { Component } from 'react';
import './index.css'
import MapView from './MapView'
import Sidebar from './Sidebar'

class App extends Component {

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
