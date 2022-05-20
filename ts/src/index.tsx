import React from 'react';
import ReactDOM from 'react-dom/client';
import './css/site.css';
import reportWebVitals from './reportWebVitals';
import {addEventListenerListWrapper, indexListWrapper} from "./indexListWrapper";
import {addEventListenerDetail, indexDetail} from "./indexDetail";
// @ts-ignore
export const root = ReactDOM.createRoot(document.getElementById('root'));

window.addEventListener('popstate', (event) => {
    if (event.hasOwnProperty('state') ) {
        if (! event.state.hasOwnProperty('stateName')) {
            window.location.href = '/';
            return;
        }
    }
});
addEventListenerListWrapper();
addEventListenerDetail();

// ルーティング
if ('/' === window.location.pathname || window.location.pathname.startsWith('/l/')) {
    indexListWrapper();
}
else if (window.location.pathname.startsWith('/d/')) {
    indexDetail();
}
else {
    window.location.href = '/';
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
