import React, { Component } from 'react';
import './index.css'

class Filter extends Component {

  filter = (e) => {
      this.props.updateQuery(e.target.value.toLowerCase())
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
