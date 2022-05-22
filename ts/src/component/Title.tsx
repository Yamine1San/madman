/* eslint-disable import/first */

import React from "react";
import {useDispatch} from "react-redux";
import {setLimit, setPage, setSortKey, setSortUd} from "../redux/listSlice";
import {IndexController} from "../controller/IndexController";
import {globalState, sortKeyDefaultValue, sortUdDefaultValue} from "../config/appConfig";
import {MadmenVolume} from "../service/MadmenService";

const Title = () => {
    const dispatch = useDispatch();

    const handleGotoTopLinkClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        e.preventDefault();

        const vo = new MadmenVolume();
        vo.set_page(1);
        vo.set_sort_key(sortKeyDefaultValue);
        vo.set_sort_ud(sortUdDefaultValue);
        vo.set_limit(globalState.limit);

        IndexController.render(vo);

        dispatch(setPage(1));
        dispatch(setSortKey(sortKeyDefaultValue));
        dispatch(setSortUd(sortUdDefaultValue));
        dispatch(setLimit(globalState.limit));

        // 履歴保存
        IndexController.saveLocationData(vo);
    };

    return (
        <h1><a href="/" onClick={handleGotoTopLinkClick}>キチガイデータベース</a></h1>
    );
};
export default Title;
