import React from 'react';
import {BrowserRouter, Switch, Route} from 'react-router-dom';
import { MainPage } from '../../main/MainPage';

const Navigation = () => {
    return (
        <BrowserRouter>
            <Switch>
                <Route path='/' component={MainPage} />
            </Switch>
        </BrowserRouter>
    )
}

export default Navigation;