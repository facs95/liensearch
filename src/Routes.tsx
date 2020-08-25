import React, { useContext } from 'react';
import {Route, Redirect} from 'react-router-dom';
import { Login, Dashboard, CreateAccount, NewOrder } from './views';
import { UserContext } from './context/UserContext';
import {AuthWrapper, AppWrapper} from './components';
import { OrderInfo } from './views/OrderInfo';
import { ManageAdming } from './views/admin/ManageAdmin';
import { UpdateOrder } from './views/UpdateOrder/UpdateOrder';

const authWrap = (component: JSX.Element): JSX.Element => <AuthWrapper>{component}</AuthWrapper>
const appWrap = (component: JSX.Element): JSX.Element => <AppWrapper>{component}</AppWrapper>

export const Routes : React.FC = () => {
    const currentUser = useContext(UserContext);
    
    if(currentUser?.uid) {
        return (
            <>
                <Route exact path='/' render={() => appWrap(<Dashboard />)} />
                <Route exact path='/new-order/:step' render={() => appWrap(<NewOrder />)} />
                <Route exact path='/update/:id/:step' render={() => appWrap(<UpdateOrder />)} />
                <Route exact path='/order/:id' render={() => appWrap(<OrderInfo />)} />
                <Route exact path='/admin/manage' render={() => appWrap(<ManageAdming />)} />
                {/* <Redirect to="/" /> // Need to understand this */}
            </>
        )
    } else {
        return (
            <>
                <Route exact path="/" render={() => authWrap(<Login />)} />
                <Route exact path='/create-account' render={() => authWrap(<CreateAccount />)} />
                <Redirect to="/" />
            </>
        )
    }
}