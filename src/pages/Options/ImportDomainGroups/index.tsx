import React, { ChangeEvent, useRef } from 'react';
import './index.scss';
import * as util from "../util";
import { readFileAsJSON } from '../../../util/file';
import { dispatchCustomEvent } from '../../../util/dom';
import { Button, message } from "antd"

interface Props {
}

const ExportConfig: React.FC<Props> = ({ }: Props) => {

    const refFile = useRef<HTMLInputElement>(null);


    const onExport = async function () {
        try {

            if (refFile.current) {
                refFile.current.click();
            }

        } catch (err: any) {
            message.error(`导出失败: ${err?.message}`);
        }
    }


    const onFileChange = async (ev: ChangeEvent) => {
        const files = (ev.target as HTMLInputElement).files;
        if (!files || files.length === 0) {
            return
        }
        try {
            const file = files[0];
            const domainGroups = await readFileAsJSON(file);

            await util.importDomainGroups(domainGroups);
            dispatchCustomEvent("refresh-cookie-groups", {})

            message.success("导入成功");

        } catch (err: any) {
            message.error(`导出失败: ${err?.message}`);
        }
    }
    return <div className="import-x">
        <Button type="primary" onClick={onExport}>导入配置</Button>
        <input style={{
            visibility: 'hidden'
        }} type="file" ref={refFile} onChange={onFileChange}></input>
    </div>;
};

export default ExportConfig;
