/* jshint strict: true */
/* eslint-disable import/first */

import React, {useEffect, useState} from 'react';
import {MadmenService, MadmenVolume} from "../service/MadmenService";
import List from './List';
import {globalState, sortOrderMap, stateNameListWrapper} from "../config/appConfig";

function ListWrapper(Props: any) {

    const vo: MadmenVolume = Props.vo;
    const [madmenList, setMadmenList] = useState([]);
    const [page, setPage] = useState(vo.page());
    const [last_page, setLastPage] = useState(vo.last_page());
    const [limit, setLimit] = useState(vo.limit());
    const [sort_key, setSortKey] = useState(vo.sort_key());
    const [sort_ud, setSortUd] = useState(vo.sort_ud());
    const [startRow, setStartRow] = useState(vo.offset()+1);
    const tmpEndRow = vo.offset()+vo.limit();
    const [endRow, setEndRow] = useState((vo.total() < tmpEndRow) ? vo.total() : tmpEndRow);
    const [totalRow, setTotalRow] = useState(vo.total());

    const changeState = (vo: MadmenVolume) => {
        // @ts-ignore
        setMadmenList(vo.rs);
        setPage(vo.page());
        setLastPage(vo.last_page());
        setLimit(vo.limit());
        setSortKey(vo.sort_key());
        setSortUd(vo.sort_ud());
        setStartRow(vo.offset()+1);
        const tmpEndRow = vo.offset()+vo.limit();
        setEndRow((vo.total() < tmpEndRow) ? vo.total() : tmpEndRow);
        setTotalRow(vo.total());
        globalState.limit = vo.limit();
        globalState.page = vo.page();
    };

    const changeList = (vo: MadmenVolume) => {
        const madmen = new MadmenService();
        madmen.paging(vo).then(() => {
            changeState(vo);
            if (vo.page() !== page
                || vo.sort_key() !== sort_key
                || vo.sort_ud() !== sort_ud
                || 1 === vo.add_history) {
                vo.add_history = 0;
                vo.set('stateName', stateNameListWrapper);
                window.history.pushState(vo, '', '/l/'+vo.page());
            }
            localStorage.setItem(stateNameListWrapper, JSON.stringify(vo));
        });
    };

    useEffect(() => {
        window.addEventListener('popstate', (event) => {
            if (stateNameListWrapper === event.state.stateName) {
                const vo = new MadmenVolume(event.state);
                changeState(vo);
            }
        });

        // 初期表示
        changeList(vo);
    }, []);

    // ページ変更
    const changePage = (new_page: number) => {
        const vo = new MadmenVolume();
        vo.set_page(new_page);
        vo.set_limit(limit);
        vo.set_sort_key(sort_key);
        vo.set_sort_ud(sort_ud);
        changeList(vo);
    };

    // 前のページ
    const previousPage = (e: React.MouseEvent<HTMLButtonElement>) => {
        changePage(page-1);
    };

    // 次のページ
    const nextPage = (e: React.MouseEvent<HTMLButtonElement>) => {
        changePage(page+1);
    };

    // 並び順 項目変更
    const handleSortKeyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const vo = new MadmenVolume();
        vo.set_page(1);
        vo.set_limit(limit);
        vo.set_sort_key(e.target.value);
        vo.set_sort_ud(sort_ud);
        changeList(vo);
    };

    // 並び順 昇順降順変更
    const handleSortOrderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const vo = new MadmenVolume();
        vo.set_page(1);
        vo.set_limit(limit);
        vo.set_sort_key(sort_key);
        vo.set_sort_ud(e.target.value);
        changeList(vo);
    };

    const pager_div = (
        <div>
            登録件数{totalRow}人 {page}ページ目 {startRow}～{endRow}件表示中<br/>
            並び順：
            <select value={sort_key} onChange={handleSortKeyChange}>
                {(() => Object.entries(vo.sort_key_allows()).map(([key, obj]: any) =>
                    <option key={key} value={key}>{obj.label}</option>
                ))()}
            </select>
            <select value={sort_ud} onChange={handleSortOrderChange}>
                {(() => [...sortOrderMap.entries()].map(([key, label]) =>
                    <option key={key} value={key}>{label}</option>
                ))()}
            </select>
            <br/>
            {1 < page ? (
                <button type="button" onClick={previousPage}>前ページ</button>
            ) : (
                <button type="button" disabled={true}>前ページ</button>
            )}
            {page < last_page ? (
                <button type="button" onClick={nextPage}>次ページ</button>
            ) : (
                <button type="button" disabled={true}>次ページ</button>
            )}
        </div>
    );

    // @ts-ignore
    return (
        <div>
            {madmenList.length ? pager_div : null}
            {madmenList.length ? <List madmenList={madmenList}/> : 'データがありません。'}
            {madmenList.length ? pager_div : null}
        </div>
    );
}

export default ListWrapper;
