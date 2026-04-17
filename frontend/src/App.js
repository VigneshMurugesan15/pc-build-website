import React from 'react';
import PCBuilder from './components/PCBuilder';

function App() {
  return (
    <div style={{ backgroundColor: '#f5f5f5', minHeight: '100vh' }}>
      <header style={{ backgroundColor: '#333', color: 'white', padding: '20px', textAlign: 'center' }}>
        <h1>PC Build Website</h1>
      </header>
      <PCBuilder />
    </div>
  );
}

export default App;