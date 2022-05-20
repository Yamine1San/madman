/* jshint strict: true */
/* eslint-disable import/first */

import React, {useState} from 'react';
import {MadmenService, MadmenVolume} from "../service/MadmenService";
import {number_format, YmdHis} from "../lib/functions";
import {globalState, stateNameCard} from "../config/appConfig";
import {renderDetail} from "../indexDetail";

function Card(Props: any) {
    const r = Props.r;
    const [succcessMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [cnt_agree, setAgreeCount] = useState(r.cnt_agree);
    const [cnt_disagree, setDisAgreeCount] = useState(r.cnt_disagree);

    const doVote = (id: any, app_kb: any, app_id: any, vote_kb: number) => {
        setSuccessMessage('');
        setErrorMessage('');
        const vo = new MadmenVolume();
        vo.id = id;
        vo.app_kb = app_kb;
        vo.app_id = app_id;
        vo.vote_kb = vote_kb;
        const madmen = new MadmenService();
        madmen.doVote(vo).then((newData: any) => {
            setSuccessMessage(madmen.getSuccessString());
            setErrorMessage(madmen.getErrorString());
            if (! newData) {
                return;
            }
            if (1 === vote_kb) {
                setAgreeCount(newData.cnt_agree);
            }
            else {
                setDisAgreeCount(newData.cnt_disagree);
            }
        });
    };

    const handleAgreeButtonClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        doVote(
            e.currentTarget.dataset.id,
            e.currentTarget.dataset.app_kb,
            e.currentTarget.dataset.app_id,
            1
        );
    };

    const handleDisagreeButtonClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        doVote(
            e.currentTarget.dataset.id,
            e.currentTarget.dataset.app_kb,
            e.currentTarget.dataset.app_id,
            2
        );
    };

    const handleDetailButtonClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        localStorage.setItem(stateNameCard+r.id, JSON.stringify({'page':globalState.page}));
        window.history.pushState({
            'stateName': stateNameCard,
            'r': r,
            'history_back': 1,
            'page':globalState.page
        }, '', '/d/'+r.id);
        renderDetail(r, 1, globalState.page);
    };

    return (
        <React.StrictMode>

            {1 === r.app_kb ? '@' : null}{r.screen_name}
            <br/>{r.user_name}
            <br/>キチガイランク <b>{r.cnt_point}</b>
            <br/><img src={r.image_url} style={{width: '90px'}} alt={r.screen_name}/>
            <br/>登録日時:{YmdHis(r.add_date.seconds)}

            <div style={{color: 'blue'}} dangerouslySetInnerHTML={{__html: succcessMessage}}></div>
            <div style={{color: 'red'}} dangerouslySetInnerHTML={{__html: errorMessage}}></div>

            <button onClick={handleAgreeButtonClick}
                    data-id={r.id}
                    data-app_kb={r.app_kb}
                    data-app_id={r.app_id}>▲キチガイに投票({number_format(cnt_agree)})
            </button>

            <button onClick={handleDisagreeButtonClick}
                    data-id={r.id}
                    data-app_kb={r.app_kb}
                    data-app_id={r.app_id}>▼まともに投票({number_format(cnt_disagree)})
            </button>

            <button onClick={handleDetailButtonClick} data-id={r.id}>コメントを見る({number_format(r.comments.length)})</button>
        </React.StrictMode>
    );
}


export default Card;
