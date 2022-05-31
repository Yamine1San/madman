import React, {useState} from "react";
import {appKbDefaultValue, appKbMap, limitDefaultValue} from "../config/appConfig";
import {MadmenService, MadmenVolume} from "../services/MadmenService";
import {toHalfWidth} from "../libs/functions";
import {useNavigate, useParams} from "react-router-dom";
import {AppMessage} from "../types/app.json";
import Message from "./Message";

/**
 *
 */
export default function AddForm() {
  const params = useParams();
  const navigate = useNavigate();

  const [appMessage, setAppMessage] = useState(new AppMessage());
  const [app_kb, setAppkb] = useState(appKbDefaultValue);
  const [screen_name, setScreenName] = useState('');

  const handleAppkbChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setAppMessage(new AppMessage());
    setAppkb(e.target.value);
  };

  const handleScreenNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setAppMessage(new AppMessage());
    setScreenName(toHalfWidth(e.target.value));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const vo = new MadmenVolume();
    // @ts-ignore
    vo.r.app_kb = (app_kb) ? Number(app_kb) : '';
    vo.r.screen_name = screen_name;

    // 追加実行
    const madmen = new MadmenService();
    madmen.add(vo).then(() => {
      setAppMessage(madmen.message);
      if (vo.result) {
        // 初期化
        setAppkb('1');
        setScreenName('');

        // データの更新
        const vo = new MadmenVolume();
        vo.data_reload = 1;
        vo.set_page(1);
        vo.set_limit(params.limit ? params.limit : limitDefaultValue);
        vo.set_sort_key('2'); // 登録日時順
        vo.set_sort_ud('desc');
        const madmen = new MadmenService();
        // 一覧更新
        madmen.paging(vo).then(() => {
          navigate(`/l/${vo.page()}/${vo.sort_key()}/${vo.sort_ud()}/${vo.limit()}`);
        });
      }
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <Message appMessage={appMessage}/>

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
