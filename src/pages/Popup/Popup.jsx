import React, { useState, useEffect } from 'react';
import './Popup.css';
import SaveCookie from "./SaveCookie"
import UserList from "./UserList"
import { getCurrentActiveTab } from "../../util/tab";

const Popup = () => {

  const [curTab, setCurTab] = useState(null);


  useEffect(() => {
    async function init() {
      const tab = await getCurrentActiveTab();
      setCurTab(tab);
    };
    init();
  }, [])


  return (
    <div className="App">
      <SaveCookie curTab={curTab} />
      <UserList curTab={curTab} />
    </div>
  );
};

export default Popup;
