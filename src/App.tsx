import React from 'react';
// import Count from './pages/count'
// import CropPage from './pages/crop'
// import UploadPage from './pages/upload'
import Demo from './pages/demo'

class App extends React.Component {

  handleSend = (data: string) => {
    console.log(data)
  }

  render() {
    return (
      <div className="App">
        <Demo />
        {/* <UploadPage/> */}
        {/* <CropPage /> */}
      </div>
    )
  }
}

export default App;

