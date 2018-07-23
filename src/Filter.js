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
        <div className="filter">
          <form>
            <input type="text" placeholder="Type to filter" value={this.props.query} onChange={this.filter}/>
            <button type="button" onClick={this.resetFilter}>Clear Filter</button>
          </form>
        </div>
    )
  }

}

export default Filter
