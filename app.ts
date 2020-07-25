import fetch from 'node-fetch';
import dotenv from 'dotenv';
import fs from 'fs';

dotenv.config();

const baseUrl: string = process.env.FIGMA_API_BASE_URL || '';
const fileKey: string = process.env.FIGMA_API_FILE_KEY || '';
const figmaAccessKey: string = process.env.FIGMA_API_ACCESS_KEY || '';

async function getFile() {
    const response = await fetch(`${baseUrl}/v1/files/${fileKey}`, {
        method: 'GET',
        headers: {
            'X-Figma-Token': figmaAccessKey,
        },
    });

    return response.json();
}

async function getComponent(): Promise<any> {
    const component = await getFile();
    return component.document.children[0].children[0];
}

function createTemplate() {
    fs.readFile('./src/templates/ReactFile.jsx', 'utf-8', async (err, data: string) => {
        if (!err) {
            const fileInfo = await getComponent();
            const component = data
                .replace(/COMPONENT_NAME/g, `${fileInfo.name}`)
                .replace(/COMPONENT_TAG/g, `${fileInfo.name}`)
                .replace(/COMPONENT_TEXT/g, `${fileInfo.children[0].name}`);
            const dirName = `./src/examples/${fileInfo.name}`;

            if (!fs.existsSync(dirName)) {
                fs.mkdirSync(dirName);
            }

            fs.writeFile(`${dirName}/${fileInfo.name}.jsx`, component, () => {});
        }
        return err;
    });
}

createTemplate();
