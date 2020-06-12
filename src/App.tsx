import React, {useState, useEffect} from 'react';
import { Switch, Router } from 'react-router-dom';
import { createBrowserHistory } from "history";
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import {Routes} from './Routes';
import { UserContext, User } from './context/UserContext';
import * as firebase from 'firebase/app';
import './initFirebase';

const history = createBrowserHistory();

const theme = createMuiTheme({})


const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    firebase.auth().onAuthStateChanged(async (user) => {
      if (user) {
        const token = await user.getIdTokenResult();
        setCurrentUser({admin: token.claims.admin});
        setLoading(false);
      } else {
        setCurrentUser(null);
        setLoading(false);
      }
    });
  }, []);
  
  if(loading) return <></>;
  return (
    <ThemeProvider theme={theme}>
        <UserContext.Provider value={currentUser}>
            <Router history={history}>
                <Switch>
                    <Routes />
                </Switch>
            </Router>
        </UserContext.Provider>
    </ThemeProvider>
  );
}

export default App;
