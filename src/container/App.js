import React, {Component, Fragment} from 'react';
import logo from '../logo.svg';
import './App.css';
import AppBar from 'material-ui/AppBar';

class App extends Component {
  render() {
    return (
      <Fragment>
        <AppBar
          title="Menu Bar"
          iconClassNameRight="muidocs-icon-navigation-expand-more"
        />
        <div className="App">
          <header className="App-header">
            <img src={logo} className="App-logo" alt="logo"/>
            <h1 className="App-title">Welcome to React</h1>
          </header>
          <p className="App-intro">
            To get started, edit <code>src/App.js</code> and save to reload.
          </p>
        </div>
      </Fragment>
    );
  }
}

export default App;
