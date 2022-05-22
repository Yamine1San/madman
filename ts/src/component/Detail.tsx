/* eslint-disable import/first */

import React, {useState} from "react";
import {useDispatch, useSelector} from "react-redux";
import {RootState} from "../redux/store";
import {setLimit, setPage, setSortKey, setSortUd} from "../redux/listSlice";
import {MadmenService, MadmenVolume} from "../service/MadmenService";
import {number_format, YmdHis} from "../lib/functions";
import {IndexController} from "../controller/IndexController";
import {globalState, sortKeyDefaultValue, sortUdDefaultValue} from "../config/appConfig";

function Detail(Props: any) {
    const dispatch = useDispatch();

    const r = Props.r;
    const [succcessMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [succcessMessageAddComment, setSuccessMessageAddComment] = useState('');
    const [errorMessageAddComment, setErrorMessageAddComment] = useState('');
    const [cnt_agree, setAgreeCount] = useState(r.cnt_agree);
    const [cnt_disagree, setDisAgreeCount] = useState(r.cnt_disagree);
    const [comment, setComment] = useState('');
    const [comments, setComments] = useState(r.comments);

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

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setSuccessMessageAddComment('');
        setErrorMessageAddComment('');
        const vo = new MadmenVolume();
        vo.comment = comment;
        vo.id = r.id;
        const madmen = new MadmenService();
        madmen.addComment(vo).then((newData: any) => {
            setSuccessMessageAddComment(madmen.getSuccessString());
            setErrorMessageAddComment(madmen.getErrorString());
            if (! newData) {
                return;
            }
            setComment('');
            setComments(newData.comments);
        });
    };

    const handleHistoryBackLinkClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        e.preventDefault();
        window.history.back();
    };

    const handleGotoListLinkClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        e.preventDefault();

        const vo = new MadmenVolume();
        vo.set_page(e.currentTarget.dataset.page ? Number(e.currentTarget.dataset.page) : 1);
        vo.set_sort_key(sortKeyDefaultValue);
        vo.set_sort_ud(sortUdDefaultValue);
        vo.set_limit(globalState.limit);

        IndexController.render(vo);

        dispatch(setPage(vo.page()));
        dispatch(setSortKey(vo.sort_key()));
        dispatch(setSortUd(vo.sort_ud()));
        dispatch(setLimit(vo.limit()));

        // 履歴保存
        IndexController.saveLocationData(vo);
    };

    const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setComment(e.target.value);
    };

    return (
        <React.StrictMode>

            {Props.history_back ? (
                <a href="/" onClick={handleHistoryBackLinkClick}>戻る</a>
            ) : Props.page ? (
                <a href="/" onClick={handleGotoListLinkClick} data-page={Props.page}>戻る</a>
            ) : (
                <a href="/" onClick={handleGotoListLinkClick} data-page={1}>一覧へ</a>
            )}
            <br/>

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

            <h3>コメント一覧</h3>
            <ul>
                {(() => comments.map((label: string, i: number) =>
                    <li key={i}>{label}</li>
                ))()}
                <li>{comment}</li>
            </ul>

            <form onSubmit={handleSubmit}>
                <textarea name="comment"
                          value={comment}
                          onChange={handleCommentChange}
                          cols={30}
                          rows={6}
                ></textarea>

                <div style={{color: 'blue'}} dangerouslySetInnerHTML={{__html: succcessMessageAddComment}}></div>
                <div style={{color: 'red'}} dangerouslySetInnerHTML={{__html: errorMessageAddComment}}></div>

                <input type="submit" value="確定する"/>
            </form>

        </React.StrictMode>
    );
}

export default Detail;
