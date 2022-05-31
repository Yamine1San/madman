import React from "react";
import AddForm from "./AddForm";
import List from "./List";
import Title from "./Title";
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
