import React, { useCallback, useEffect, useState } from 'react';
import { Route, Switch } from 'react-router-dom';

import { useHttpClient } from './hooks/http-hook';

import Header from './persistent-components/Header';

import ArtistAccount from './routes/ArtistAccount';
import Landing from './routes/Landing';
import SignIn from './routes/SignIn';
import SignUp from './routes/SignUp';
import Player from './routes/Player';

import { AuthContext } from './context/auth-context';

import { lanAddress } from './.lanAddress';

import './App.css';

const App = () => {
  // eslint-disable-next-line
  const { isLoading, error, sendRequest, clearError } = useHttpClient();
  const [token, setToken] = useState(false);
  const [checking, setChecking] = useState(true);
  const [username, setUsername] = useState(null);
  const [accountType, setAccountType] = useState(null);

  const login = useCallback((username, token) => {
    setToken(token);
    setUsername(username);
    localStorage.setItem(
      'userData',
      JSON.stringify({
        username,
        token,
      })
    );
  }, []);

  const logout = useCallback(() => {
    setToken(null);
    setUsername(null);
    localStorage.removeItem('userData');
  }, []);

  useEffect(() => {
    const storedData = JSON.parse(localStorage.getItem('userData'));
    if (storedData && storedData.token) {
      login(storedData.username, storedData.token);
    }
    const checkUser = async (token) => {
      try {
        const response = await sendRequest(
          `http://${lanAddress}:5000/api/users/check`,
          'GET',
          null,
          {
            Authorization: `Bearer ${token}`,
          }
        );
        setAccountType(response.result);
        setChecking(false);
      } catch (error) {
        console.log(error);
        console.log(error.message);
        return null;
      }
    };
    checkUser(storedData.token);
  }, [login, sendRequest]);

  let body;

  if (accountType === 'userAccount') {
    body = <Player />;
  } else if (accountType === 'artistAccount') {
    body = <div>artist account</div>;
  } else if (checking) {
    body = <div>Loading...</div>;
  } else {
    body = (
      <>
        <Header />
        <div className='body-container'>
          <Switch>
            <Route path='/' exact>
              <Landing />
            </Route>
            <Route path='/sign-in'>
              <SignIn />
            </Route>
            <Route path='/sign-up'>
              <SignUp />
            </Route>
            <Route path='/aritst-account-signup'>
              <SignUp route='artist-accounts' />
            </Route>
            <Route path='/aritst-account-signin'>
              <SignIn route='artist-accounts' />
            </Route>
            <Route path='/artist-account'>
              <ArtistAccount />
            </Route>
          </Switch>
        </div>
      </>
    );
  }

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn: !!token,
        token: token,
        login: login,
        logout: logout,
        username: username,
      }}
    >
      {body}
    </AuthContext.Provider>
  );
};

export default App;
