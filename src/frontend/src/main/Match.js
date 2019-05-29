import React, {Component} from 'react';

class Match extends Component {
    constructor(props) {
        super(props);
        this.state = {
            match: props.match,
            isEven: props.isEven,
        };
    }

    tick() {
        // this.setState(prevState => ({
        //     seconds: prevState.seconds + 1
        // }));
        console.log('one more second');
        this.formatTime();
    }

    componentDidMount() {
        this.interval = setInterval(() => this.tick(), 1000);
    }

    componentWillUnmount() {
        clearInterval(this.interval);
    }

    formatTime() {
        const timeBeforeMatch = new Date(this.state.match.beginat) - Date.now();
        if (timeBeforeMatch < 0) {
            this.setState({
                timeLeft: 'LIVE'
            });
            return;
        }
        // console.log(this.state.match.beginat);
        const seconds = Math.floor(timeBeforeMatch / 1000) % 60;
        const minutes = Math.floor(timeBeforeMatch / 1000 / 60) % 60;
        const hours = Math.floor(timeBeforeMatch / 1000 / 60 / 60) % 24;
        const days = Math.floor(timeBeforeMatch / 1000 / 60 / 60 / 24); 
        let timeLeft = '';
        if (days > 0) timeLeft += days + ' days ';
        if (hours < 10) timeLeft += '0';
        timeLeft += `${hours}:`;
        if (minutes < 10) timeLeft += '0';
        timeLeft += `${minutes}:`;
        if (seconds < 10) timeLeft += '0';
        timeLeft += seconds;
        this.setState({
            timeLeft: timeLeft
        });
    }

    render() {
        return (
            <div className={"match " + (this.state.isEven ? 'even' : 'odd')}>
                <div className="firstTeam">{this.state.match.team1.name}</div>
                <div className="startsIn">{this.state.timeLeft}</div>
                <div className="secondTeam">{this.state.match.team2.name}</div>
            </div>
        )
    }
}

export default Match