import React, { useContext } from 'react';
import {Route, Redirect} from 'react-router-dom';
import { Login, Dashboard  } from './views';
import { UserContext } from './context/UserContext';
import {AuthWrapper, AppWrapper} from './components';


const authWrap = (component: JSX.Element): JSX.Element => <AuthWrapper>{component}</AuthWrapper>
const appWrap = (component: JSX.Element): JSX.Element => <AppWrapper>{component}</AppWrapper>

export const Routes : React.FC = () => {
    const currentUser = useContext(UserContext);

    if(currentUser) {
        return (
            <>
                <Route exact path='/' render={() => appWrap(<Dashboard />)} />
                <Redirect to="/" />
            </>
        )
    } else {
        return (
            <>
                <Route exact path="/login" render={() => authWrap(<Login />)} />
                <Redirect to="/login" />
            </>
        )
    }
}