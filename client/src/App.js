import React from 'react'
import { Route,Redirect,Switch } from 'react-router-dom';
import Auth from './pages/Auth';
import Events from './pages/Events'
import Bookings from './pages/Bookings';
import MainNav from './components/navigation/Navigation'
const App = () => {
  return (
    <React.Fragment>
      <MainNav/>
      <Switch>
        <Redirect from='/' to='/auth' exact/>
        <Route path='/auth' component={ Auth } />
        <Route path='/events' component={ Events } />
        <Route path='/bookings' component={ Bookings   } />
      </Switch>
    </React.Fragment>
  );
};

export default App
