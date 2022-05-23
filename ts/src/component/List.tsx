/* eslint-disable import/first */

import React, {useEffect, useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../redux/store";
import {nextPage, previousPage, setLastPage, setLimit, setPage, setSortKey, setSortUd} from "../redux/listSlice";
import {MadmenCols, MadmenService, MadmenVolume} from "../service/MadmenService";
import Card from './Card';
import {IndexController} from "../controller/IndexController";
import {globalState, sortOrderMap, stateNameIndex} from "../config/appConfig";

function List(Props: any) {
    const dispatch = useDispatch();

    const page = useSelector((state: RootState) => state.list.page);
    const last_page = useSelector((state: RootState) => state.list.last_page);
    const sort_key = useSelector((state: RootState) => state.list.sort_key);
    const sort_ud = useSelector((state: RootState) => state.list.sort_ud);
    const limit = useSelector((state: RootState) => state.list.limit);
    const [madmenList, setMadmenList] = useState([]);
    const [total, setTotal] = useState(0);
    const [page_rowno_start, setPageRowNoStart] = useState(0);
    const [page_rowno_end, setPageRowNoEnd] = useState(0);

    const changeState = (vo: MadmenVolume) => {
        dispatch(setPage(vo.page()));
        dispatch(setLastPage(vo.last_page()));
        dispatch(setSortKey(vo.sort_key()));
        dispatch(setSortUd(vo.sort_ud()));
        dispatch(setLimit(vo.limit()));
        globalState.limit = vo.limit();
        setTotal(vo.total());
        setPageRowNoStart(vo.page_rowno_start());
        setPageRowNoEnd(vo.page_rowno_end());
        if (JSON.stringify(madmenList) !== JSON.stringify(vo.rs)) {
            // @ts-ignore
            setMadmenList(vo.rs);
        }
    };

    const vo = new MadmenVolume();
    vo.set_page((0 < page) ? page : Props.page);
    vo.set_limit((0 < limit) ? limit : Props.limit);
    vo.set_sort_key((sort_key) ? sort_key : Props.sort_key);
    vo.set_sort_ud((sort_ud) ? sort_ud : Props.sort_ud);

    useEffect(() => {
        const vo = new MadmenVolume();
        vo.set_page((0 < page) ? page : Props.page);
        vo.set_limit((0 < limit) ? limit : Props.limit);
        vo.set_sort_key((sort_key) ? sort_key : Props.sort_key);
        vo.set_sort_ud((sort_ud) ? sort_ud : Props.sort_ud);
        const madmen = new MadmenService();
        madmen.paging(vo).then(() => {
            changeState(vo);
        });
    });

    if (! globalState.list_add_popstate) {
        globalState.list_add_popstate = true;
        window.addEventListener('popstate', (event) => {
            if (! event.state) {
                return;
            }

            if (! event.state.hasOwnProperty('stateName')) {
                return;
            }

            if (stateNameIndex !== event.state.stateName) {
                return;
            }

            const vo = new MadmenVolume(event.state);
            IndexController.render(vo);

            dispatch(setPage(vo.page()));
            dispatch(setLastPage(vo.last_page()));
            dispatch(setSortKey(vo.sort_key()));
            dispatch(setSortUd(vo.sort_ud()));
            dispatch(setLimit(vo.limit()));
        });
    }

    const handlePreviousPage = () => {
        dispatch(previousPage());
        // 履歴保存
        vo.set_page(page-1);
        IndexController.saveLocationData(vo);
    };

    const handleNextPage = () => {
        dispatch(nextPage());
        // 履歴保存
        vo.set_page(page+1);
        IndexController.saveLocationData(vo);
    };

    // 並び順 項目変更
    const handleSortKeyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        dispatch(setPage(1));
        dispatch(setSortKey(e.target.value));
        // 履歴保存
        vo.set_page(1);
        vo.set_sort_key(e.target.value);
        IndexController.saveLocationData(vo);
    };

    // 並び順 昇順降順変更
    const handleSortOrderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        dispatch(setPage(1));
        dispatch(setSortUd(e.target.value));
        // 履歴保存
        vo.set_page(1);
        vo.set_sort_ud(e.target.value);
        IndexController.saveLocationData(vo);
    };

    const pager_div = (
        <React.StrictMode>
            登録件数{total}人 {page}ページ目 {page_rowno_start}～{page_rowno_end}件表示中<br/>
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
                <button type="button" onClick={handlePreviousPage}>前ページ</button>
            ) : (
                <button type="button" disabled={true}>前ページ</button>
            )}
            {page < last_page ? (
                <button type="button" onClick={handleNextPage}>次ページ</button>
            ) : (
                <button type="button" disabled={true}>次ページ</button>
            )}
        </React.StrictMode>
    );

    return (
        <React.StrictMode>
            {madmenList.length ? pager_div : null}
            {madmenList.length ? '' : 'データがありません。'}
            {madmenList.map((r: MadmenCols) => (
                <div key={'div-card-'+r.id} id={'card-'+r.id} className={"card"}>
                    <Card key={'card-'+r.id} r={r}/>
                </div>
            ))}
            {madmenList.length ? pager_div : null}
        </React.StrictMode>
    );
}

export default List;
