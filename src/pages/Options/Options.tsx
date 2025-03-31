import React, { Fragment } from 'react';
import './Options.scss';
import DomainGroupList from './DomainGroupList';
import ExportDomainGroups from './ExportDomainGroups';
import ImportDomainGroups from './ImportDomainGroups';
import { Tabs, Divider, TabPaneProps } from 'antd';
import type { TabsProps } from 'antd';

interface Props {}

const styles: Record<'TabPane', React.CSSProperties> = {
  TabPane: {
    height: `calc(100vh - 60px)`,
    overflow: 'auto',
    minHeight: '600px',
  },
};

const tabItems: TabsProps['items'] = [
  {
    label: '用户管理',
    key: '1',
    children: <DomainGroupList />,
  },
  {
    label: '导入导出',
    key: '2',
    children: (
      <Fragment>
        <div
          style={{
            paddingTop: '60px',
          }}
        ></div>
        <ExportDomainGroups />
        <Divider />
        <ImportDomainGroups />
      </Fragment>
    ),
  },
];

const Options: React.FC<Props> = ({}: Props) => {
  return (
    <Tabs
      tabPosition="top"
      className="OptionsContainer"
      defaultActiveKey="1"
      items={tabItems}
      aria-hidden={false}
    ></Tabs>
  );
};

export default Options;
