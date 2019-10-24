import React from "react";
import { Provider, connect } from "react-redux";
import PropTypes from "prop-types";
import { BrowserRouter as Router, Route, Switch, Redirect } from "react-router-dom";

import JssProvider from "react-jss/lib/JssProvider";
import { create } from "jss";

import { createGenerateClassName, jssPreset, MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import "bootstrap/dist/css/bootstrap.css";

import Home from "../../containers/Home";
import Register from "../../containers/Register";
import SignIn from "../../containers/SignIn";
import AppContainer from "../AppContainer";
import NoMatch from "../../containers/NoMatch";

import "../base.scss";
import "./styles.scss";

const theme = createMuiTheme({
  typography: {
    // Tell Material-UI what the font-size on the html element is.
    htmlFontSize: 10,
    useNextVariants: true
  }
});

const generateClassName = createGenerateClassName();
const jss = create({
  ...jssPreset(),
  insertionPoint: "jss-insertion-point"
});

class App extends React.Component {
  static propTypes = {
    dispatch: PropTypes.func,
    store: PropTypes.object.isRequired
  };

  render() {
    const { store, user } = this.props;

    if (user) {
      return (
        <JssProvider jss={jss} generateClassName={generateClassName}>
          <Provider store={store}>
            <Router>
              <MuiThemeProvider theme={theme}>
                <Switch>
                  <Route exact path="/" render={() => <Redirect to="/mails/inbox" />} />
                  <Route path="/mails" component={AppContainer} />
                  <Route path="/newemail" component={AppContainer} />
                  <Redirect from='/register' to='/mails/inbox' />
                  <Redirect from='/sign-in' to='/mails/inbox' />
                  <Route component={NoMatch} />
                </Switch>
              </MuiThemeProvider>
            </Router>
          </Provider>
        </JssProvider >
      );
    }

    return (
      <JssProvider jss={jss} generateClassName={generateClassName}>
        <Provider store={store}>
          <Router>
            <MuiThemeProvider theme={theme}>
              <Switch>
                <Route exact path="/" component={Home} />
                <Route path="/register" component={Register} />
                <Route path="/sign-in" component={SignIn} />
                <Route render={props => (<Redirect to={{
                  pathname: "/sign-in",
                  state: { from: props.location }
                }} />)} />
              </Switch>
            </MuiThemeProvider>
          </Router>
        </Provider>
      </JssProvider >
    );
  }
}

const mapStateToProps = state => {
  const { user } = state.session;

  return ({
    user
  });
};

export default connect(mapStateToProps)(App);
