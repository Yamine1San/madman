/* eslint-disable import/first */

import React from "react";
import ReactDOM from "react-dom/client";
import {BrowserRouter, Route, Routes,} from "react-router-dom";
import "./css/site.css";
import reportWebVitals from "./reportWebVitals";
import {App, AppDetail} from "./component/App";
import NotFound from "./component/NotFound";

const rootElement = document.getElementById('root');
if (! rootElement) throw new Error('Failed to find the root element');

ReactDOM.createRoot(rootElement).render(
    <BrowserRouter>
        <Routes>
            <Route path="/" element={<App/>}/>
            <Route path="l/:page_no/:sort_key/:sort_ud/:limit" element={<App/>}/>
            <Route path="d/:id" element={<AppDetail/>}/>
            <Route path="*" element={<NotFound/>}/>
        </Routes>
    </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
