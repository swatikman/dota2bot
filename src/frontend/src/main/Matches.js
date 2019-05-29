import React, {Component} from 'react';
import './Matches.css';
import Match from "./Match";
import Axios from 'axios';

class Matches extends Component {

    constructor(props) {
        super(props);
        this.state = {matches: [], title: props.header};
        this.getMatches();
    }

    getMatches() {
        Axios.get('http://localhost:1234/api/matches?type=upcoming')
            .then(res => {
                console.log(res.data);
                this.setState({
                    matches: res.data
                });
            })
            .catch(err => {
                console.log(err);
            })
    }

    render() {
        return <div className={`matches ${this.props.className}`}>
            <div className="matchesHeader">{this.state.title}</div>
            {
                this.state.matches.map((match, i) => {
                    return (
                        <Match key={match.id} match={match} isEven={i % 2 === 0}/>
                    )
                })
            }
        </div>
    }
}

export default Matches;
