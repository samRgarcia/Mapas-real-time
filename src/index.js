import React from 'react';
import ReactDOM from 'react-dom';
import {SocketProvider} from './Context/SocketContext';
import MapasApp from './MapasApp';
import './index.css';

ReactDOM.render(
    <SocketProvider>
        <MapasApp />
    </SocketProvider>,
  document.getElementById('root')
);

