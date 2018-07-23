import React, { Component } from 'react';
import './index.css'

class Filter extends Component {

  filter = (e) => {
      this.props.updateQuery(e.target.value.toLowerCase())
  }

  resetFilter = () => {
      this.props.updateQuery('')
  }

  render() {
    return (
        <div>
          <form>
            <input type="text" placeholder="Filter List" value={this.props.query} onChange={this.filter}/>
            <button type="button" onClick={this.resetFilter}>Clear Filter</button>
          </form>
        </div>
    )
  }

}

export default Filter
