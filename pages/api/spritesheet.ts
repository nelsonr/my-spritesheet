import { NextApiRequest, NextApiResponse } from 'next';
import formidable from 'formidable';
import { generateSpriteSheet } from '../../lib/spritesheet/spritesheet';
import type { SpriteSheet } from '../../lib/spritesheet/types';
import Spritesheet from '../../components/Spritesheet';

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
    // const formData = new FormData();
    let spritesheet: SpriteSheet;
    
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
        spritesheet = await generateSpriteSheet(imageFilePaths, 'sprite');

        // formData.append('css', spritesheet.css);
        // formData.append('image', new Blob([spritesheet.image.buffer]));
    } catch (error) {
        console.log(error);
    }
    
    res.status(200).json(spritesheet);
}