import { useState } from 'react';
import If from './If';
import UploadForm from './UploadForm';
import SpritesPreview from './SpritesPreview';
import Download from './Download';

type Preview = {
    image: string | null;
    css: string | null;
    width: number;
    height: number;
};

export default function Spritesheet() {
    const [preview, setPreview] = useState<Preview>({
        css: null,
        image: null,
        width: 0,
        height: 0
    });
    
    const onSubmit = (files: File[]) => {
        if (files.length > 0) {
            const endpoint = '/api/spritesheet';
            const formData = new FormData();

            for (const file of files) {
                formData.append('images', file);
            }

            const upload = fetch(endpoint, {
                method: 'POST',
                body: formData,
            });

            upload
                .then((resp) => resp.json())
                .then((data: Preview) => setPreview(data));
        }
    };

    return (
        <div className='section'>
            <div className="container is-flex is-flex-direction-column">
                {/* Form */}
                <div className="block">
                    <h2 className='title'>Sprite Sheet Maker</h2>
                    <UploadForm onSubmit={onSubmit} />
                </div>

                {/* Preview */}
                <div className="block is-flex-grow-1 columns is-scrollable">
                    <div className='column'>
                        <pre className='is-flex-grow-1 is-scrollable'>{preview.css}</pre>
                    </div>
                    <div className='column'>
                        <div className="block is-scrollable">
                            <SpritesPreview css={preview.css} bg={preview.image} />
                        </div>
                    </div>
                </div>

                {/* Donwload */}
                <div className="block is-flex is-justify-content-center">
                    <If condition={preview.image && preview.css}>
                        <Download image={preview.image} css={preview.css} />
                    </If>                    
                </div>
            </div>
        </div>
    );
}
