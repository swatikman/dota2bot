import React, { Component } from 'react';
import Matches from './Matches';
import './MainPage.css';

export class MainPage extends Component {

    render() {
        return (
            <div>
                <div className="header" >
                    <div>
                        Test
                    </div>
                </div>
                <div className="content">
                    <div className={`allMatches`}>
                        <Matches header={`Live and upcoming matches`} className={`leftMatches`}/>
                        <Matches header={`Past matches`}/>
                    </div>
                </div>
            </div>
        )
    }
}