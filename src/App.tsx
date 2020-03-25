import React from 'react';
// import Count from './pages/count'
// import CropPage from './pages/crop'
// import UploadPage from './pages/upload'
import ClipUploadPage from './pages/clip-upload'

class App extends React.Component {

  handleSend = (data: string) => {
    console.log(data)
  }

  render() {
    return (
      <div className="App">
        <ClipUploadPage />
        {/* <UploadPage/> */}
        {/* <CropPage /> */}
      </div>
    )
  }
}

export default App;

