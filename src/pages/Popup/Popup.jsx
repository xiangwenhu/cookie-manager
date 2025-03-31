import React, { useState, useEffect, createContext } from 'react';
import './Popup.css';
import ManageCookie from './ManageCookie';
import UserList from './UserList';
import { getPageTab } from './util';

const Popup = () => {
  const [curTab, setCurTab] = useState(null);

  // const context = createContext < {} > {};

  useEffect(() => {
    async function init() {
      const tab = await getPageTab();
      setCurTab(tab);
    }
    init();
  }, []);

  if (!curTab) {
    return <div className="App"></div>;
  }

  return (
    <div className="App">
      <ManageCookie curTab={curTab} />
      {/* <Divider /> */}
      <UserList curTab={curTab} />
    </div>
  );
};

export default Popup;
