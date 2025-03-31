import {
  Button,
  Col,
  Input,
  message,
  Modal,
  Popconfirm,
  Row,
  Space,
  Tooltip,
} from 'antd';
import React, { useEffect, useState } from 'react';
import { dispatchCustomEvent } from '../../../util/dom';
import { DomainUser } from '../../Options/types';
import ImportUser from '../ImportUser';
import { saveCookieByTabAndName } from '../util';
import './index.css';
import { clearTabCookies } from '../../../util/cookie';

const SaveCookie = ({ curTab }: { curTab: chrome.tabs.Tab }) => {
  const [showSaveOpt, setShowSaveOpt] = useState(false);
  const [name, setName] = useState<string>('');
  const [showImport, setShowImport] = useState(false);

  const onSave = async function () {
    try {
      await saveCookieByTabAndName(curTab, name);
      setShowSaveOpt(false);

      dispatchCustomEvent('refresh-users');
    } catch (err: any) {
      message.error(`保存失败: ${err?.message}`);
    }
  };

  const onImportSuccess = () => {
    message.success('添加成功');
    setShowImport(false);
  };

  const onCancel = function () {
    setShowSaveOpt(false);
  };

  const onGoOptionsPage = () => {
    chrome.runtime.openOptionsPage();
  };

  const onClearTabCookies = async () => {
    try {
      await clearTabCookies(curTab);
      message.success('清除完毕');
      // window.location.reload();
      if (!curTab.id) return;
      chrome.tabs.reload(curTab.id);
    } catch (err: any) {
      message.error(`保存失败: ${err?.message}`);
    }
  };

  const renderSaveOptions = function () {
    if (!showSaveOpt) {
      return null;
    }

    return (
      <div className="save-options">
        <Row style={{ width: '100%' }}>
          <Col span={2} className="label">
            名字
          </Col>
          <Col className="field" span={9}>
            <Input
              maxLength={50}
              placeholder="输入名字, 名字存在会覆盖！"
              onChange={(ev) => setName(ev.target.value)}
              value={name}
            ></Input>
          </Col>
          <Col className="action" span={8}>
            <Button type="primary" className="btn-save" onClick={onSave}>
              保存
            </Button>
            <Button
              onClick={onCancel}
              style={{
                marginLeft: '6px',
              }}
            >
              取消
            </Button>
          </Col>
        </Row>
      </div>
    );
  };

  if (!curTab) {
    return null;
  }

  return (
    <div className="save-container">
      <Space>
        <Button
          type="primary"
          onClick={() => setShowSaveOpt(true)}
          title="保存当前Tab的cookie"
        >
          保存
        </Button>
        <Button
          type="primary"
          onClick={() => setShowImport(true)}
          title="导入用户的cookie"
        >
          导入
        </Button>
        <Button
          onClick={onGoOptionsPage}
          type="primary"
          title="管理全部的cookie"
        >
          管理
        </Button>
        <Popconfirm
          okText="确认"
          cancelText="取消"
          title="确认清理当前Tab的cookie嘛？"
          onConfirm={onClearTabCookies}
        >
          <Button danger type="primary" title="清理当前Tab的cookie">
            清理
          </Button>
        </Popconfirm>
      </Space>

      {renderSaveOptions()}
      {showImport ? (
        <Modal
          open
          footer={null}
          onCancel={() => setShowImport(false)}
          style={{
            top: '12px',
          }}
        >
          <ImportUser onSuccess={onImportSuccess} url={curTab.url!} />
        </Modal>
      ) : null}
    </div>
  );
};

export default SaveCookie;
