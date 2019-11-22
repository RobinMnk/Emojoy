import React from 'react';
import '../App.css';
import { Button, message } from 'antd';
import { Titlepage } from './Titlepage';

const App: React.FC = () => {
  return (
    <div className="App">
      <Titlepage />
      <Button
        type="primary"
        onClick={() => message.success("Ant Design ftw!")}
      >
        Klick mich nicht!
      </Button>
    </div>
  );
}

export default App;
