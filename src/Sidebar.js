import React, { Component } from 'react'
import './index.css'
import List from './List'
import Filter from './Filter'

class Sidebar extends Component {

    componentDidMount() {
    }

    render() {
        return (
            <div className='sidebar'>
                <Filter query={this.props.query} updateQuery={this.props.updateQuery} places={this.props.places}/>
                <ul>
                    {this.props.places.map(place => (
                        place.display === true &&(
                            <List key={place.title} updateActiveMarker={this.props.updateActiveMarker} place={place} />
                        )
                    ))}
                </ul>
            </div>
        )
    }
}

export default Sidebar
