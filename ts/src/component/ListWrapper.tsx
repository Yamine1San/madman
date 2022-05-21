/* eslint-disable import/first */
import React, {useEffect} from "react";
import {useDispatch} from "react-redux";
import {setLastPage, setLimit, setPage, setSortKey, setSortUd} from "../redux/listSlice";
import {MadmenVolume} from "../service/MadmenService";
import {globalState, stateNameIndex} from "../config/appConfig";
import List from "./List";
import {IndexController} from "../controller/IndexController";

const ListWrapper = (Props: any) => {
    const dispatch = useDispatch();

    const vo: MadmenVolume = Props.vo;

    dispatch(setPage(vo.page()));
    dispatch(setLastPage(vo.last_page()));
    dispatch(setSortKey(vo.sort_key()));
    dispatch(setSortUd(vo.sort_ud()));
    dispatch(setLimit(vo.limit()));
    globalState.limit = vo.limit();

    useEffect(() => {
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

            if (null === document.getElementById('madman_list')) {
                IndexController.render(vo);
            }

            dispatch(setPage(vo.page()));
            dispatch(setLastPage(vo.last_page()));
            dispatch(setSortKey(vo.sort_key()));
            dispatch(setSortUd(vo.sort_ud()));
            dispatch(setLimit(vo.limit()));
        });
    }, []);

    return (
        <React.StrictMode>
            <List vo={vo}/>
        </React.StrictMode>
    );
};

export default ListWrapper;
