import React, { Component } from 'react';
import './index.css'

class Filter extends Component {

  state = {
      query: ''
  }

  filter = (e) => {
      this.setState({query:e.target.value})
  }

  render() {
    return (
        <div>
          <input type="text" placeholder="Filter List" value={this.state.query} onChange={this.filter}/>
        </div>
    )
  }

}

export default Filter
