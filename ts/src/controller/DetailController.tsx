/* eslint-disable import/first */

import React from 'react';
import {globalState, stateNameCard} from "../config/appConfig";
import {MadmenCols, MadmenService} from "../service/MadmenService";
import Detail from "../component/Detail";
import {ListWrapperController} from "./ListWrapperController";

export class DetailController {

    /**
     *
     */
    static addEventListener = () => {
        window.addEventListener('popstate', (event) => {
            if (stateNameCard === event.state.stateName) {
                this.render(event.state.r, event.state.history_back, event.state.page);
            }
        });
    }

    /**
     *
     */
    static index = () => {
        const madmen = new MadmenService();
        const id = window.location.pathname.replace('/d/', '');
        madmen.find_by_id(id).then((r: MadmenCols | false) => {
            if (! r) {
                window.location.href = '/';
                return;
            }

            let page = 0;
            const jsonString = localStorage.getItem(stateNameCard+id);
            if (jsonString) {
                const obj = JSON.parse(jsonString);
                page = obj.page;
            }
            this.render(r, 0, page);
        });
    }

    private static handleGotoTopLinkClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        ListWrapperController.render();
        e.preventDefault();
    }

    /**
     *
     * @param r
     * @param history_back
     * @param page
     */
    static render = (r: MadmenCols, history_back: number, page: number) => {
        // @ts-ignore
        globalState.rootRoot.render(
            <React.StrictMode>
                <h1><a href="/" onClick={this.handleGotoTopLinkClick}>キチガイデータベース</a></h1>
                <Detail r={r} history_back={history_back} page={page}/>
            </React.StrictMode>
        );
    }
}
