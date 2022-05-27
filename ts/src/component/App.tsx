/* eslint-disable import/first */

import React from "react";
import AddForm from "../component/AddForm";
import List from "../component/List";
import Title from "../component/Title";
import Detail from "./Detail";

export function App() {
  return (
    <React.StrictMode>
      <Title/>
      <fieldset>
        <legend>登録フォーム</legend>
        <AddForm/>
      </fieldset>
      <fieldset>
        <legend>一覧</legend>
        <div id="madman_list">
          <List/>
        </div>
      </fieldset>
    </React.StrictMode>
  );
}

export function AppDetail() {
  return (
    <React.StrictMode>
      <Title/>
      <Detail/>
    </React.StrictMode>
  );
}
