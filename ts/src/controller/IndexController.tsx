/* eslint-disable import/first */

import React from "react";
import {Provider} from "react-redux";
import {store} from "../redux/store";
import {MadmenVolume} from "../service/MadmenService";
import AddForm from "../component/AddForm";
import List from "../component/List";
import {globalRoot, globalState, sortKeyDefaultValue, sortUdDefaultValue, stateNameIndex} from "../config/appConfig";
import Title from "../component/Title";
import {window_location_pathname} from "../index";

export class IndexController {


    /**
     *
     */
    static addEventListener = () => {
        window.addEventListener('popstate', (event) => {
            if (! event.state) {
                return;
            }

            if (stateNameIndex !== event.state.stateName) {
                return;
            }

            const vo = new MadmenVolume(event.state);
            IndexController.render(vo);
        });
    }

    /**
     *
     * @param vo
     */
    static saveLocationData = (vo: MadmenVolume) => {
        vo.set('stateName', stateNameIndex);
        window.history.pushState(vo, '', '/l/'+vo.page());
        localStorage.setItem(stateNameIndex, JSON.stringify(vo));
    }

    /**
     *
     */
    static default = () => {

        const vo = new MadmenVolume();
        vo.set_page(1);
        vo.set_limit(globalState.limit);
        vo.set_sort_key(sortKeyDefaultValue);
        vo.set_sort_ud(sortUdDefaultValue);

        if (window_location_pathname === '/') {
            IndexController.saveLocationData(vo);
        }
        else if (window_location_pathname.startsWith('/l/')) {
            const jsonMadmenVolume = localStorage.getItem(stateNameIndex);
            if (jsonMadmenVolume) {
                vo.set(JSON.parse(jsonMadmenVolume));
            }
            vo.set_page(Number(window_location_pathname.replace('/l/', '')));
            if (! jsonMadmenVolume) {
                IndexController.saveLocationData(vo);
            }
        }

        this.render(vo);
    }

    /**
     *
     * @param vo
     */
    static render = (vo?: MadmenVolume) => {

        if (undefined === vo) {
            vo = new MadmenVolume();
            vo.set_page(1);
            vo.set_sort_key(sortKeyDefaultValue);
            vo.set_sort_ud(sortUdDefaultValue);
            vo.set_limit(globalState.limit);
        }

        globalRoot.root.render(
            <Provider store={store}>
                <Title/>
                <fieldset>
                    <legend>登録フォーム</legend>
                    <AddForm/>
                </fieldset>
                <fieldset>
                    <legend>一覧</legend>
                    <div id="madman_list">
                        <List vo={vo}/>
                    </div>
                </fieldset>
            </Provider>
        );
    }
}
