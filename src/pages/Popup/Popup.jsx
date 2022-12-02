import React, { useState, useEffect } from 'react';
import './Popup.css';
import SaveCookie from './SaveCookie';
import UserList from './UserList';
import { getPageTab } from './util';

const Popup = () => {
  const [curTab, setCurTab] = useState(null);

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
      <SaveCookie curTab={curTab} />
      {/* <Divider /> */}
      <UserList curTab={curTab} />
    </div>
  );
};

export default Popup;
