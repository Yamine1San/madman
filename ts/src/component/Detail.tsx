/* eslint-disable import/first */

import React, {useEffect, useState} from "react";
import {MadmenCols, MadmenService, MadmenVolume} from "../service/MadmenService";
import {number_format} from "../lib/functions";
import {useNavigate, useParams, useSearchParams} from "react-router-dom";
import {limitDefaultValue, sortKeyDefaultValue, sortUdDefaultValue} from "../config/appConfig";

function Detail(Props: any) {
    const params = useParams();
    const navigate = useNavigate();

    // eslint-disable-next-line
    const [searchParams, setSearchParams] = useSearchParams();

    const [succcessMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [succcessMessageAddComment, setSuccessMessageAddComment] = useState('');
    const [errorMessageAddComment, setErrorMessageAddComment] = useState('');

    const defaultR = new MadmenCols();
    defaultR.add_date = {seconds: 0};
    const [r, setR] = useState(defaultR);
    const [cnt_agree, setCntAgree] = useState(0);
    const [cnt_disagree, setCntDisAgree] = useState(0);
    const [comment, setComment] = useState('');

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
                setCntAgree(newData.cnt_agree);
            }
            else {
                setCntDisAgree(newData.cnt_disagree);
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
            r.comments = newData.comments;
            setR(r);
        });
    };

    const handleGotoListLinkClick = (e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
        e.preventDefault();

        const vo = new MadmenVolume();
        vo.set_page(searchParams.get('page'));
        vo.set_sort_key(searchParams.get('sort_key') ? searchParams.get('sort_key') : sortKeyDefaultValue);
        vo.set_sort_ud(searchParams.get('sort_ud') ? searchParams.get('sort_ud') : sortUdDefaultValue);
        vo.set_limit(searchParams.get('limit') ? searchParams.get('limit') : limitDefaultValue);

        navigate(`/l/${vo.page()}/${vo.sort_key()}/${vo.sort_ud()}/${vo.limit()}`);
    };

    const handleCommentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
        setComment(e.target.value);
    };

    useEffect(() => {
        const madmen = new MadmenService();
        madmen.find_by_id(params.id).then((r) => {
            if (undefined === r) {
                navigate('/l/');
                return;
            }
            setR(r);
            setCntAgree(r.cnt_agree);
            setCntDisAgree(r.cnt_disagree);
        });
    });

    return (
        <React.StrictMode>

            <a href="/" onClick={handleGotoListLinkClick}>戻る</a>
            <br/>

            {1 === r.app_kb ? '@' : null}{r.screen_name}
            <br/>{r.user_name}
            <br/>キチガイランク <b>{r.cnt_point}</b>
            <br/><img src={r.image_url} style={{width: '90px'}} alt={r.screen_name}/>
            {/*<br/>登録日時:{YmdHis(r.add_date.seconds)}*/}

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
                {(() => r.comments.map((label: string, i: number) =>
                    <li key={i}>{label}</li>
                ))()}
                <li>{comment}</li>
            </ul>

            <form onSubmit={handleSubmit}>

                <div style={{color: 'blue'}} dangerouslySetInnerHTML={{__html: succcessMessageAddComment}}></div>
                <div style={{color: 'red'}} dangerouslySetInnerHTML={{__html: errorMessageAddComment}}></div>

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
