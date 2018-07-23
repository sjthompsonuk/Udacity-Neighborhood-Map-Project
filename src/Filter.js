import React, { Component } from 'react'
import './index.css'

class Filter extends Component {

    filter = (e) => {
        //Push any text query to lower case and update state for matching with list
        this.props.updateQuery(e.target.value.toLowerCase())
    }

    resetFilter = () => {
        //Quick reset
        this.props.updateQuery('')
    }

    render() {
        return (
            <div className="filter">
                <form id="form">
                    <input type="text" aria-label="Type to filter" placeholder="Type to filter" value={this.props.query} onChange={this.filter}/>
                    <div>
                        <button type="button" onClick={this.resetFilter}>Clear Filter</button>
                    </div>
                </form>
            </div>
        )
    }
}

export default Filter
