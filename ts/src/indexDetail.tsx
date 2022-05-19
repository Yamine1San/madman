import React from 'react';
import {stateNameCard} from "./config/appConfig";
import {MadmenCols, MadmenService} from "./service/MadmenService";
import Detail from "./component/Detail";
import {root} from "./index";

export const renderDetail = (r: MadmenCols, history_back:number) => {
    root.render(
        <React.StrictMode>
            <h1><a href="/">キチガイデータベース</a></h1>
            <Detail r={r} history_back={history_back}/>
        </React.StrictMode>
    );
};

export const indexDetail = () => {
    const madmen = new MadmenService();
    const id = window.location.pathname.replace('/d/', '');
    madmen.find_by_id(id).then((r: MadmenCols | false) => {
        if (! r) {
            window.location.href = '/';
            return;
        }
        renderDetail(r, 0);
    });
};

export const addEventListenerDetail = () => {
    window.addEventListener('popstate', (event) => {
        if (stateNameCard === event.state.stateName) {
            renderDetail(event.state.r, event.state.history_back);
        }
    });
};
