import React, { useCallback, useState } from 'react';
import './index.css';
import { getCookiesByTab } from '../../../util/cookie';
import { addUser } from '../util';
import { getDomainFromUrl } from '../../../util';
import { dispatchCustomEvent } from '../../../util/dom';
import { Button, Input, Col, Row, message, Modal } from 'antd';
import ImportUser from '../ImportUser';

const SaveCookie = ({ curTab }) => {
  const [showSaveOpt, setShowSaveOpt] = useState(false);
  const [name, setName] = useState('');
  const [showImport, setShowImport] = useState(false);

  const onSave = async function () {
    try {
      // 获取当前页面的cookies
      const cookies = await getCookiesByTab(curTab);
      if (!cookies || !Array.isArray(cookies)) {
        return message.error('保存失败');
      }
      const domain = getDomainFromUrl(curTab.url);
      if (!domain) {
        return message.error('获取域名失败');
      }
      const user = {
        name: name.trim(),
        // cookies: cookies.filter((ck) => !!ck.expirationDate),
        cookies,
        updateTime: Date.now(),
      };
      // 保存
      await addUser(user, domain);

      console.log('cookies:', cookies);
      setShowSaveOpt(false);

      dispatchCustomEvent('add-user-success');
    } catch (err) {
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
        <Row>
          <Col span={4} className="label">
            名字
          </Col>
          <Col className="field" span={10}>
            <Input
              maxLength={10}
              type="name"
              onChange={(ev) => setName(ev.target.value)}
              value={name}
            ></Input>
          </Col>
          <Col className="action" span={10}>
            <Button type="primary" className="btn-save" onClick={onSave}>
              保存
            </Button>
            <Button onClick={onCancel}>取消</Button>
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
        <Modal open footer={null} onCancel={() => setShowImport(false)}>
          <ImportUser onSuccess={onImportSuccess} url={curTab.url} />
        </Modal>
      ) : null}
    </div>
  );
};

export default SaveCookie;
