/* eslint-disable import/first */

import React from "react";
import {Provider} from "react-redux";
import {store} from "../redux/store";
import {globalRoot, stateNameCard} from "../config/appConfig";
import {MadmenCols, MadmenService} from "../service/MadmenService";
import Detail from "../component/Detail";
import Title from "../component/Title";
import {window_location_pathname} from "../index";

export class DetailController {

    /**
     *
     */
    static addEventListener = () => {
        window.addEventListener('popstate', (event) => {
            if (! event.state) {
                return;
            }

            if (stateNameCard !== event.state.stateName) {
                return;
            }

            DetailController.render(event.state.r, event.state.history_back, event.state.page);
        });
    }

    /**
     *
     */
    static default = () => {
        const madmen = new MadmenService();
        const id = window_location_pathname.replace('/d/', '');
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

    /**
     *
     * @param r
     * @param history_back
     * @param page
     */
    static render = (r: MadmenCols, history_back: number, page: number) => {
        globalRoot.rootRoot.render(
            <Provider store={store}>
                <Title/>
                <Detail r={r} history_back={history_back} page={page}/>
            </Provider>
        );
    }
}
