import React from 'react';
import AddForm from './component/AddForm';
import ListWrapper from "./component/ListWrapper";
import {limitDefaultValue, stateNameListWrapper} from "./config/appConfig";
import {MadmenVolume} from "./service/MadmenService";
import {root} from "./index";

export const renderListWrapper = (vo: MadmenVolume) => {
    root.render(
        <React.StrictMode>
            <h1><a href="/">キチガイデータベース</a></h1>
            <fieldset>
                <legend>登録フォーム</legend>
                <AddForm/>
            </fieldset>
            <fieldset>
                <legend>一覧</legend>
                <div id="madmen_list">
                    <ListWrapper vo={vo}/>
                </div>
            </fieldset>
        </React.StrictMode>
    );
};

export const indexListWrapper = () => {

    const vo = new MadmenVolume();
    vo.set_page(1);

    if ('/' === window.location.pathname) {
        vo.add_history = 1;
    }

    let flg_strage = 0;
    if (window.location.pathname.startsWith('/l/')) {
        const jsonMadmenVolume = localStorage.getItem(stateNameListWrapper);
        if (jsonMadmenVolume) {
            flg_strage = 1;
            vo.set(JSON.parse(jsonMadmenVolume));
        }
        vo.set_page(Number(window.location.pathname.replace('/l/', '')));
    }

    if (1 !== flg_strage) {
        vo.set_limit(limitDefaultValue);
        vo.set_sort_ud('desc');
    }

    renderListWrapper(vo);
};

export const addEventListenerListWrapper = () => {
    window.addEventListener('popstate', (event) => {
        if (stateNameListWrapper === event.state.stateName) {
            if (null === document.getElementById('madmen_list')) {
                const vo = new MadmenVolume(event.state);
                renderListWrapper(vo);
            }
        }
    });
};
