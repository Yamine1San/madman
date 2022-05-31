import React, {useEffect, useState} from "react";
import {MadmenService, MadmenVolume} from "../services/MadmenService";
import {number_format, YmdHis} from "../libs/functions";
import {
  limitDefaultValue,
  sortKeyDefaultValue,
  sortUdDefaultValue,
  updateAccountDataInterval
} from "../config/appConfig";
import {createSearchParams, useNavigate, useParams} from "react-router-dom";
import {AppMessage} from "../types/app.json";
import Message from "./Message";

export default function Card(Props: any) {
  const params = useParams();
  const navigate = useNavigate();

  const [r, setR] = useState(Props.r);
  const [appMessage, setAppMessage] = useState(new AppMessage());
  const [cnt_agree, setCntAgree] = useState(r.cnt_agree);
  const [cnt_disagree, setCntDisAgree] = useState(r.cnt_disagree);

  const doVote = (id: any, app_kb: any, app_id: any, vote_kb: number) => {
    setAppMessage(new AppMessage());
    const vo = new MadmenVolume();
    vo.id = id;
    vo.app_kb = app_kb;
    vo.app_id = app_id;
    vo.vote_kb = vote_kb;
    const madmen = new MadmenService();
    madmen.doVote(vo).then((newData: any) => {
      setAppMessage(madmen.message);
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

  const handleDetailButtonClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    const vo = new MadmenVolume();
    vo.set_page(params.page_no);
    vo.set_sort_key(params.sort_key ? params.sort_key : sortKeyDefaultValue);
    vo.set_sort_ud(params.sort_ud ? params.sort_ud : sortUdDefaultValue);
    vo.set_limit(params.limit ? params.limit : limitDefaultValue);

    const searchParams = createSearchParams({
      page: vo.page().toString(),
      sort_key: vo.sort_key(),
      sort_ud: vo.sort_ud(),
      limit: vo.limit().toString(),
    });

    navigate(`/d/${r.id}/?${searchParams.toString()}`);
  };

  useEffect(() => {
    const date = new Date();
    if (r.account_upd_date.seconds < Math.floor(date.getTime() / 1000-updateAccountDataInterval)) {
      const vo = new MadmenVolume();
      vo.r = r;
      const madmen = new MadmenService();
      madmen.updateAccountData(vo).then((result) => {
        setAppMessage(madmen.message);
        if (result) {
          setR(vo.r);
        }
      });
    }
  }, [r]);

  return (
    <React.StrictMode>

      {1 === r.app_kb ? '@' : null}{r.screen_name}
      <br/>{r.user_name}
      <br/>キチガイランク <b>{r.cnt_point}</b>
      <br/><img src={r.image_url} style={{width: '90px'}} alt={r.screen_name}/>
      <br/>登録日時:{YmdHis(r.add_date.seconds)}
      <br/>データ更新日時:{YmdHis(r.account_upd_date.seconds)}

      <Message appMessage={appMessage}/>

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
