import React from 'react';
import ClipUploadPage from './pages/clip-upload'

class App extends React.Component {

  handleSend = (data: string) => {
    console.log(data)
  }

  render() {
    return (
      <div className="App">
        <ClipUploadPage />
      </div>
    )
  }
}

export default App;

