import React, { Component } from 'react';
import './index.css'

class List extends Component {

  listClick = (e) => {
      this.props.updateActiveMarker(this.props.place.id)
  }

  render() {
    return (
      <li className='list' onClick={this.listClick}>
        {this.props.place.title}
      </li>
    )
  }

}

export default List
