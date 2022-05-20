/* eslint-disable import/first */

import React from 'react';
import AddForm from '../component/AddForm';
import ListWrapper from "../component/ListWrapper";
import {
    globalState,
    limitDefaultValue,
    sortKeyDefaultValue,
    sortUdDefaultValue,
    stateNameListWrapper
} from "../config/appConfig";
import {MadmenVolume} from "../service/MadmenService";
import {ListController} from "./ListController";

export class ListWrapperController {

    /**
     *
     */
    static addEventListener = () => {
        window.addEventListener('popstate', (event) => {
            if (stateNameListWrapper === event.state.stateName) {
                if (null === document.getElementById('madman_list')) {
                    const vo = new MadmenVolume(event.state);
                    this.render(vo);
                }
            }
        });
    }

    /**
     *
     */
    static index = () => {

        const vo = new MadmenVolume();
        vo.set_page(1);
        vo.set_limit(limitDefaultValue);
        vo.set_sort_key(sortKeyDefaultValue);
        vo.set_sort_ud(sortUdDefaultValue);

        if ('/' === window.location.pathname) {
            vo.add_history = 1;
        }
        else if (window.location.pathname.startsWith('/l/')) {
            const jsonMadmenVolume = localStorage.getItem(stateNameListWrapper);
            if (jsonMadmenVolume) {
                vo.set(JSON.parse(jsonMadmenVolume));
            }
            vo.set_page(Number(window.location.pathname.replace('/l/', '')));
        }

        this.render(vo);
    }

    private static handleGotoTopLinkClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        ListController.render();
        e.preventDefault();
    }

    /**
     *
     * @param vo
     */
    static render = (vo?: MadmenVolume) => {

        if (undefined === vo) {
            // @ts-ignore
            vo = new MadmenVolume();
            vo.add_history = 1;
            vo.set_limit(limitDefaultValue);
            vo.set_sort_key(sortKeyDefaultValue);
            vo.set_sort_ud(sortUdDefaultValue);
            vo.set_page(1);
        }

        // 闇の力(setTimeout)でリセット

        // @ts-ignore
        globalState.rootRoot.render(
            <React.StrictMode>
            </React.StrictMode>
        );

        setTimeout(() => {
            // @ts-ignore
            globalState.rootRoot.render(
                <React.StrictMode>
                    <h1><a href="/" onClick={this.handleGotoTopLinkClick}>キチガイデータベース</a></h1>
                    <fieldset>
                        <legend>登録フォーム</legend>
                        <AddForm/>
                    </fieldset>
                    <fieldset>
                        <legend>一覧</legend>
                        <div id="madman_list">
                            <ListWrapper vo={vo}/>
                        </div>
                    </fieldset>
                </React.StrictMode>
            );
        }, 100);
    }
}
