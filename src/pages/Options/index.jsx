import React from 'react';
import { render } from 'react-dom';
import { ConfigProvider } from 'antd';

import Options from './Options';
import './index.css';

import dayjs from 'dayjs';
import 'dayjs/locale/zh-cn'; // 根据语言引入对应的 locale 文件
import zhCN from 'antd/locale/zh_CN'; // 中文包

dayjs.locale('zh-cn'); // 全局设置语言

render(
  <ConfigProvider locale={zhCN}>
    <Options title={'Settings'} />
  </ConfigProvider>,
  window.document.querySelector('#app-container')
);

if (module.hot) module.hot.accept();
