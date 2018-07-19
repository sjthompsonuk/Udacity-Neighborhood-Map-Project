import React, { Component } from 'react';
import './index.css'

class List extends Component {

  componentDidMount() {
      console.log(this.props.place)
  }

  render() {
    return (
      <li className='list'>
        {this.props.place.title}
      </li>
    )
  }

}

export default List
