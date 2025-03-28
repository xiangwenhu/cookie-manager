import React, { useCallback, useState } from 'react';
import './index.css';
import { getCookiesByTab } from '../../../util/cookie';
import { addOrUpdateUser } from '../util';
import { getDomainFromUrl } from '../../../util';
import { dispatchCustomEvent } from '../../../util/dom';
import { Button, Input, Col, Row, message, Modal } from 'antd';
import ImportUser from '../ImportUser';

const SaveCookie = ({ curTab }: { curTab: chrome.tabs.Tab }) => {
  const [showSaveOpt, setShowSaveOpt] = useState(false);
  const [name, setName] = useState<string>('');
  const [showImport, setShowImport] = useState(false);

  const onSave = async function () {
    try {
      // 获取当前页面的cookies
      const cookies = await getCookiesByTab(curTab);
      if (!cookies || !Array.isArray(cookies)) {
        return message.error('获取cookies失败');
      }
      const domain = getDomainFromUrl(curTab.url!);
      if (!domain) {
        return message.error('获取域名失败');
      }

      const rName = name.trim();
      if (rName.length === 0) return message.error('用户名不能为空');

      const user = {
        name: rName,
        // cookies: cookies.filter((ck) => !!ck.expirationDate),
        cookies,
        updateTime: Date.now(),
      };
      // 保存
      await addOrUpdateUser(user, domain);

      console.log('cookies:', cookies);
      setShowSaveOpt(false);

      dispatchCustomEvent('add-user-success');
    } catch (err: any) {
      message.error('保存失败，' + err.message);
    }
  };

  const onImportSuccess = () => {
    message.success('添加成功');
    setShowImport(false);
  };

  const onCancel = function () {
    setShowSaveOpt(false);
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
              type="name"
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
      <Button type="primary" onClick={() => setShowSaveOpt(true)}>
        保存当前cookie
      </Button>
      <Button
        type="primary"
        onClick={() => setShowImport(true)}
        style={{
          marginLeft: '10px',
        }}
      >
        导入用户cookie
      </Button>
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
