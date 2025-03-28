import React, { Fragment } from 'react';
import './index.scss';
import * as util from "../util";
import { downloadFile } from '../../../util';
import { Button, message } from "antd"

interface Props {
}

const ExportConfig: React.FC<Props> = ({ }: Props) => {
    const onExport = async function () {
        try {
            const list = await util.groupCookies();

            downloadFile(JSON.stringify(list, undefined, "\t"), "config.json");

            message.success("导出成功");

        } catch (err: any) {
            message.error(`导出失败:: ${err?.message}`);
        }
    }
    return <Fragment>
        <Button type="primary" onClick={onExport}>导出配置</Button>
    </Fragment>

};

export default ExportConfig;
