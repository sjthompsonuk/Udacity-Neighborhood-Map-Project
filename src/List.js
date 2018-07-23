import React, { Component } from 'react';
import './index.css'

class List extends Component {

  listClick = (e) => {
      this.props.updateActiveMarker(this.props.place.id)
  }

  handleKeyEvent = (e) => {
    if(e.key === 'Enter') {
      this.props.updateActiveMarker(this.props.place.id)
    }
  }

  render() {
      //TODO On click or enter key
    return (
      <li className='list' tabIndex='0' onKeyDown={this.handleKeyEvent} onClick={this.listClick}>
        {this.props.place.urlTitle}
      </li>
    )
  }

}

export default List
