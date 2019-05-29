import React, {Component} from 'react';
// import logo from './logo.svg';
import './App.css';
import Matches from "./main/Matches";
import { MainPage } from './main/MainPage';

class App extends Component {
    render() {
        return (
            <div>
                {/* Privet */}
                <MainPage />
            </div>
        );
    }

}

export default App;
