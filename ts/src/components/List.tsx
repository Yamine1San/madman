import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {MadmenCols, MadmenService, MadmenVolume} from "../services/MadmenService";
import Card from './Card';
import {limitDefaultValue, sortKeyDefaultValue, sortOrderMap, sortUdDefaultValue} from "../config/appConfig";

export default function List() {
  const params = useParams();
  const navigate = useNavigate();

  const [page, setPage] = useState(0);
  const [last_page, setLastPage] = useState(0);
  const [sort_key, setSortKey] = useState('');
  const [sort_ud, setSortUd] = useState('');
  const [total, setTotal] = useState(0);
  const [page_rowno_start, setPageRowNoStart] = useState(0);
  const [page_rowno_end, setPageRowNoEnd] = useState(0);
  const [madmenList, setMadmenList] = useState([]);

  const changeState = (vo: MadmenVolume) => {
    setPage(vo.page());
    setLastPage(vo.last_page());
    setSortKey(vo.sort_key());
    setSortUd(vo.sort_ud());
    setTotal(vo.total());
    setPageRowNoStart(vo.page_rowno_start());
    setPageRowNoEnd(vo.page_rowno_end());
    if (JSON.stringify(madmenList) !== JSON.stringify(vo.rs)) {
      // @ts-ignore
      setMadmenList(vo.rs);
    }
  };

  const vo = new MadmenVolume();
  vo.set_page(params.page_no);
  vo.set_sort_key(params.sort_key ? params.sort_key : sortKeyDefaultValue);
  vo.set_sort_ud(params.sort_ud ? params.sort_ud : sortUdDefaultValue);
  vo.set_limit(params.limit ? params.limit : limitDefaultValue);

  // 前ページ
  const handlePreviousPage = () => {
    vo.set_page(vo.page()-1);
    navigate(`/l/${vo.page()}/${vo.sort_key()}/${vo.sort_ud()}/${vo.limit()}`);
  };

  // 次ページ
  const handleNextPage = () => {
    vo.set_page(vo.page()+1);
    navigate(`/l/${vo.page()}/${vo.sort_key()}/${vo.sort_ud()}/${vo.limit()}`);
  };

  // 並び順 項目変更
  const handleSortKeyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    vo.set_page(1);
    vo.set_sort_key(e.target.value);
    navigate(`/l/${vo.page()}/${vo.sort_key()}/${vo.sort_ud()}/${vo.limit()}`);
  };

  // 並び順 昇順降順変更
  const handleSortOrderChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    vo.set_page(1);
    vo.set_sort_ud(e.target.value);
    navigate(`/l/${vo.page()}/${vo.sort_key()}/${vo.sort_ud()}/${vo.limit()}`);
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

  useEffect(() => {
    const vo = new MadmenVolume();
    vo.set_page(params.page_no);
    vo.set_sort_key(params.sort_key ? params.sort_key : sortKeyDefaultValue);
    vo.set_sort_ud(params.sort_ud ? params.sort_ud : sortUdDefaultValue);
    vo.set_limit(params.limit ? params.limit : limitDefaultValue);
    const madmen = new MadmenService();
    madmen.paging(vo).then(() => {
      changeState(vo);
    });
  });

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
