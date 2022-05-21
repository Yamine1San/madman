import React from "react";
import ReactDOM from "react-dom/client";
import "./css/site.css";
import reportWebVitals from "./reportWebVitals";
import {DetailController} from "./controller/DetailController";
import {IndexController} from "./controller/IndexController";
import {globalState} from "./config/appConfig";

// @ts-ignore
globalState.rootRoot = ReactDOM.createRoot(document.getElementById('root'));

//
// 戻る進む処理のためのpopstate登録
//
window.addEventListener('popstate', (event) => {
    if (! event.state) {
        return;
    }

    if (! event.state.hasOwnProperty('stateName')) {
        window.location.href = '/';
        return;
    }
});
IndexController.addEventListener();
DetailController.addEventListener();

//
// ルーティング URIに応じてコントローラのアクション呼び出し
//
if ('/' === window.location.pathname || window.location.pathname.startsWith('/l/')) {
    IndexController.default();
}
else if (window.location.pathname.startsWith('/d/')) {
    DetailController.default();
}
else {
    window.location.href = '/';
}

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
