import React, { Component } from 'react';
import './index.css'

class Filter extends Component {

  filter = (e) => {
      this.props.updateQuery(e.target.value)
      // TODO Organise how to filter the places state in App and rerender

  }

  render() {
    return (
        <div>
          <input type="text" placeholder="Filter List" value={this.props.query} onChange={this.filter}/>
        </div>
    )
  }

}

export default Filter
