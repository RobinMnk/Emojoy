import React from 'react';
import './App.css';
import FaceAPI from "./components/faceapi";
import WebRtc from './components/web_rtc';

const App: React.FC = () => {
  return (
    <div className="App">
      <FaceAPI></FaceAPI>
    </div>
  );
}

export default App;
