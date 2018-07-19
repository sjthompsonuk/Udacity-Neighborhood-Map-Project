import React, { Component } from 'react';
import './index.css'

class List extends Component {

  render() {
    return (
      <li className='list'>
        {this.props.place.latlng.lat}
      </li>
    )
  }

}

export default List
