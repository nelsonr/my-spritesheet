import FileSaver from 'file-saver';
import JSZip from 'jszip';
import { outdent } from 'outdent';
import { getSpriteClasses } from '../libs/utils';

export default function Download ({ css, image }) {
    const onClick = () => {
        const zip = new JSZip();

        zip.file('preview.html', createHTMLPreview(css));
        zip.file('sprite.css', css);
        zip.file('sprite.png', image, {base64: true});

        zip.generateAsync({ type:'blob' })
            .then((content) => FileSaver.saveAs(content, 'sprites.zip'));
    };

    return (
        <button className='button' onClick={onClick}>Download</button>
    );
}

function createHTMLPreview(css: string): string {
    const spriteClasses = getSpriteClasses(css);
    
    const spritesHTML = spriteClasses.map((spriteClass) => 
        `<div class="sprite ${spriteClass}" style="--size: 48;"></div>`
    ).join('\r\n');

    const html = outdent`
        <!DOCTYPE html>
        <html lang="en">
        <head>
            <meta charset="UTF-8">
            <meta http-equiv="X-UA-Compatible" content="IE=edge">
            <meta name="viewport" content="width=device-width, initial-scale=1.0">
            <title>Spritesheet Preview</title>
            <link rel="stylesheet" href="sprite.css">
            <style>
                .sprites {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    gap: 1em;
                    max-width: 1024px;
                    margin: auto;
                }
            </style>
        </head>
        <body>
            <div class="sprites">
                ${spritesHTML}
            </div>
        </body>
        </html>
    `;

    return html;
}