/* jshint strict: true */
/* eslint-disable import/first */

import React, {useState} from 'react';
import ReactDOM from 'react-dom/client';
import {appKbDefaultValue, appKbMap, globalState} from "../config/appConfig";
import {MadmenService, MadmenVolume} from "../service/MadmenService";
import {toHalfWidth} from "../lib/functions";
import ListWrapper from "./ListWrapper";

/**
 *
 */
function AddForm() {

    const [succcessMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [app_kb, setAppkb] = useState(appKbDefaultValue);
    const [screen_name, setScreenName] = useState('');

    const handleAppkbChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        setSuccessMessage('');
        setErrorMessage('');
        setAppkb(e.target.value);
    };

    const handleScreenNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSuccessMessage('');
        setErrorMessage('');
        setScreenName(toHalfWidth(e.target.value));
    };

    const handleSubmit = (e: React.FormEvent) => {
        const vo = new MadmenVolume();
        // @ts-ignore
        vo.r.app_kb = (app_kb) ? Number(app_kb) : '';
        vo.r.screen_name = screen_name;

        // 追加実行
        const madmen = new MadmenService();
        madmen.add(vo).then(() => {
            setSuccessMessage(madmen.getSuccessString());
            setErrorMessage(madmen.getErrorString());
            if (vo.result) {
                // 初期化
                setAppkb('1');
                setScreenName('');

                // 一覧のトップページへ
                if ('/' !== window.location.pathname) {
                    window.history.pushState({}, '', '/');
                }

                const sort_key = '2';
                const sort_ud = 'desc';

                // データの更新
                const vo = new MadmenVolume();
                vo.data_reload = 1;
                vo.set_page(1);
                vo.set_limit(globalState.limit);
                vo.set_sort_key(sort_key); // 登録日時順
                vo.set_sort_ud(sort_ud); // 登録日時順
                const madmen = new MadmenService();
                // 一覧更新
                madmen.paging(vo).then(() => {
                    vo.data_reload = 0;
                    // 更新後に再描画
                    // @ts-ignore
                    const madmen_list = ReactDOM.createRoot(document.getElementById('madmen_list'));
                    madmen_list.render(
                        <React.StrictMode>
                            <ListWrapper vo={vo}/>
                        </React.StrictMode>
                    );
                });
            }
        });
        e.preventDefault();
    };

    return (
        <form onSubmit={handleSubmit}>
            <div style={{color: 'blue'}} dangerouslySetInnerHTML={{__html: succcessMessage}}></div>
            <div style={{color: 'red'}} dangerouslySetInnerHTML={{__html: errorMessage}}></div>
            <label>
                アプリ：
                <select value={app_kb} onChange={handleAppkbChange}>
                    {(() => [...appKbMap.entries()].map(([key, label]) =>
                        <option key={key} value={key}>{label}</option>
                    ))()}
                </select>
            </label>
            <br/>
            <label>
                ユーザーID：
                <input type="text"
                       name="screen_name"
                       value={screen_name}
                       onChange={handleScreenNameChange}
                       placeholder="@screen_name"/>
            </label>
            <br/>
            <input type="submit" value="登録する"/>
        </form>
    );
}

export default AddForm;
