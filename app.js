const fetch = require('node-fetch');
const dotenv = require('dotenv');
const fs = require('fs');

dotenv.config();

const baseUrl = process.env.FIGMA_API_BASE_URL;
const fileKey = process.env.FIGMA_API_FILE_KEY;

async function getFile() {
    const response = await fetch(`${baseUrl}/v1/files/${fileKey}`, {
        method: 'GET',
        headers: {
            'X-Figma-Token': process.env.FIGMA_API_ACCESS_KEY
        }
    });

    return response.json();
}

async function getComponent() {
    const component = await getFile();
    return component.document.children[0].children[0];
}

getComponent().then((res) => {
    const htmlTag = res.name;
    fs.writeFile(`${htmlTag}.html`, `<${htmlTag}>${res.children[0].name}</${htmlTag}>`, function(err, data) {
        if (err) {
            console.log(err);
            return;
        }

        console.log(data);
    });
});
