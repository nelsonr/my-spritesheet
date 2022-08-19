// import path from 'path';
// import os from 'os';
// import { mkdtemp, writeFile } from 'fs/promises';
import { NextApiRequest, NextApiResponse } from 'next';
import { Blob, Buffer } from 'buffer';
import formidable from 'formidable';
import FormData from 'form-data';
import { generateSpriteSheet } from '../../lib/spritesheet/spritesheet';
import type { SpriteSheet } from '../../lib/spritesheet/types';

// type FilePath = string;

type FormidableFormData = {
    fields: formidable.Fields;
    files: formidable.Files;
};

export const config = {
    api: {
        bodyParser: false,
    },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const formData = new FormData();
    
    try {
        const { files }: FormidableFormData = await new Promise((resolve, reject) => { 
            const form = formidable({
                keepExtensions: true
            });

            form.parse(req, async (err, fields, files) => {
                if (err) {
                    return reject(err);
                }
    
                resolve({ fields, files });
            });
        });

        const imagesList: formidable.File[] = Array.isArray(files.images) ? files.images : [files.images];
        const imageFilePaths = imagesList.map((file) => file.filepath);
        const spritesheet: SpriteSheet = await generateSpriteSheet(imageFilePaths, 'sprite');
        
        formData.append('css', spritesheet.css);
        // formData.append('image', Buffer.from(spritesheet.image.buffer));
    } catch (error) {
        console.log(error);
    }
    
    res.status(200).send({ result: formData });
}

// async function createTempFiles(files: formidable.File | formidable.File[]): Promise<FilePath[]> {
//     const tempFilePaths: string[] = [];
//     const tempDirPath = await mkdtemp(path.join(os.tmpdir(), 'sprite-'));
//     const fileList: formidable.File[] = Array.isArray(files) ? files : [files];

//     for (const file of fileList) {
//         const fileBuffer = await file.arrayBuffer();
//         const tempFilePath = path.join(tempDirPath, file.name);

//         await writeFile(tempFilePath, new Uint8Array(fileBuffer));
//         tempFilePaths.push(tempFilePath);
//     }

//     return tempFilePaths;
// }
