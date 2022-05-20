/* jshint strict: true */
/* eslint-disable import/first */

import React, {useState} from 'react';
import {MadmenService, MadmenVolume} from "../service/MadmenService";
import {number_format, YmdHis} from "../lib/functions";

function Detail(Props: any) {
    const r = Props.r;
    const [succcessMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
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
        setSuccessMessage('');
        setErrorMessage('');
        const vo = new MadmenVolume();
        vo.comment = comment;
        vo.id = r.id;
        const madmen = new MadmenService();
        madmen.addComment(vo).then((newData: any) => {
            setSuccessMessage(madmen.getSuccessString());
            setErrorMessage(madmen.getErrorString());
            if (! newData) {
                return;
            }
            setComment('');
            setComments(newData.comments);
        });
    };

    const handleBackLinkClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        window.history.back();
        e.preventDefault();
    };
    const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setComment(e.target.value);
    };

    return (
        <React.StrictMode>

            {Props.history_back ? (
                <a href="/" onClick={handleBackLinkClick}>戻る</a>
            ) : Props.page ? (
                <a href={'/l/'+Props.page} >戻る</a>
            ) : (
                <a href="/">一覧へ</a>
            )}
            <br/>

            {1 === r.app_kb ? '@' : null}{r.screen_name}
            <br/>{r.user_name}
            <br/>キチガイランク <b>{r.cnt_point}</b>
            <br/><img src={r.image_url} style={{width: '90px'}} alt={r.screen_name}/>
            <br/>登録日時:{YmdHis(r.add_date.seconds)}
            <br/>
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

            <div style={{color: 'blue'}} dangerouslySetInnerHTML={{__html: succcessMessage}}></div>
            <div style={{color: 'red'}} dangerouslySetInnerHTML={{__html: errorMessage}}></div>

            <form onSubmit={handleSubmit}>
                <textarea name="comment"
                          value={comment}
                          onChange={handleCommentChange}
                          cols={30}
                          rows={6}
                ></textarea>

                <br/>
                <input type="submit" value="確定する"/>
            </form>

        </React.StrictMode>
    );
}


export default Detail;