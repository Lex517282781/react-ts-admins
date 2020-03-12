import React from 'react';
// import Count from './pages/count'
import Crop from './pages/crop'
import './App.css';

class App extends React.Component {

  handleSend = (data: string) => {
    console.log(data)
  }

  render() {
    return (
      <div className="App">
        <Crop />
      </div>
    )
  }
}

export default App;

