import React, { Component } from 'react';
import './index.css'
import List from './List'
import Filter from './Filter'

class Sidebar extends Component {

  componentDidMount() {
  }

  render() {
    return (
      <div className='sidebar'>
        <Filter query={this.props.query} updateQuery={this.props.updateQuery} places={this.props.places}/>
        <ul>
            {this.props.places.map(place => (
              place.display === true &&(
                <List key={place.title} updateActiveMarker={this.props.updateActiveMarker} place={place} />
              )
            ))}
        </ul>
        <footer>
        Credit: Data provided by <a href="https://maps.google.com">Google Maps</a>, <a href="https://www.wikipedia.org">Wikipedia</a> and <a href="https://commons.wikimedia.org">Wikimedia Commons</a>
        </footer>
      </div>
    )
  }

}

export default Sidebar
