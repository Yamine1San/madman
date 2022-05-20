import React from 'react';
import ReactDOM from 'react-dom/client';
import {MadmenVolume} from "../service/MadmenService";
import {globalRoot, limitDefaultValue, sortKeyDefaultValue, sortUdDefaultValue} from "../config/appConfig";
import ListWrapper from "../component/ListWrapper";

export class ListController {

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

        if (undefined === globalRoot.rootMadmenList) {
            const container = document.getElementById('madman_list');
            if (container) {
                globalRoot.rootMadmenList = ReactDOM.createRoot(container);
            }
        }

        // 闇の力(setTimeout)でリセット

        if (undefined !== globalRoot.rootMadmenList) {
            globalRoot.rootMadmenList.render(
                <React.StrictMode>
                </React.StrictMode>
            );
            setTimeout(() => {
                // @ts-ignore
                globalRoot.rootMadmenList.render(
                    <React.StrictMode>
                        <ListWrapper vo={vo}/>
                    </React.StrictMode>
                );
            }, 100);
        }
    }
}
