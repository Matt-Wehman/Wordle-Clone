import React from 'react';
import ReactDOM from 'react-dom/client';
import 'bootstrap/dist/css/bootstrap.min.css';
import './index.css';
import './layout.css';
import App from './App';
import {setCorrectWord} from "./Server/WordleAPI";

const root = ReactDOM.createRoot(document.getElementById('root'));
setCorrectWord(5).then(() => {
    root.render(
        <React.StrictMode>
            <App/>
        </React.StrictMode>
    );
});

