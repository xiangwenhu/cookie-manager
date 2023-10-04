import React from 'react';
import { render } from 'react-dom';
import zhCN from 'antd/locale/zh_CN';

import Popup from './Popup';
import 'antd/dist/reset.css';
import { ConfigProvider } from 'antd';

import './index.css';

render(
  <ConfigProvider locale={zhCN}>
    <Popup />,
  </ConfigProvider>,
  window.document.querySelector('#app-container')
);

if (module.hot) module.hot.accept();
