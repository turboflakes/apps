import React from 'react';
import {
  HashRouter as Router,
  Switch,
  Route,
  Redirect
} from "react-router-dom";

import withTheme from './theme/withTheme'
import { IndexPage } from './components/layout/IndexPage'
import { LayoutPage } from './components/layout/LayoutPage'
import {isNetworkSupported} from './constants'

function LayoutRoute({
  layout: Layout,  
  page: Page,  
  ...rest
}) {
  return (
    <Route {...rest} render={props => {
        if (isNetworkSupported(props.match.params.chainName) || typeof props.match.params.chainName === "undefined") {
          return (
            <Layout {...props} >
              <Page {...props} />
            </Layout>
          )
        }
        return (
          <Redirect
            to={{
              pathname: "/kusama",
              state: { from: props.location }
            }}
          />  
        )
      }
    } />
  );
}

function App() {
  return (
      <Router>
        <Switch>
          <LayoutRoute exact strict path="/:chainName/:page" layout={LayoutPage} page={IndexPage} />
          <Redirect to="/kusama/val-groups" />
        </Switch>
      </Router>
  );
}

export default withTheme(App);
