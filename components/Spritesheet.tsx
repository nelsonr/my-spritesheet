import { useState, createRef, FormEvent } from 'react';
import Image from 'next/image';

type Preview = {
    image: Blob | null;
    css: string | null;
    width: number;
    height: number;
};

export default function Spritesheet() {
    const [fileInput, setFileInput] = useState('');
    const [preview, setPreview] = useState<Preview>({
        css: null,
        image: null,
        width: 0,
        height: 0
    });

    const fileInputRef = createRef<HTMLInputElement>();
    const endpoint = '/api/spritesheet';

    const onSubmit = async (ev: FormEvent<HTMLFormElement>) => {
        ev.preventDefault();
        
        if (fileInputRef && fileInputRef.current) {
            const files = fileInputRef.current.files;

            if (files && files.length > 0) {
                const formData = new FormData();

                for (const file of files) {
                    formData.append('images', file);
                }

                const sendFile = fetch(endpoint, {
                    method: 'POST',
                    body: formData,
                });

                sendFile
                    .then((resp) => resp.json())
                    .then((data) => {
                        const image = new Blob([new Uint8Array(data.image.data)], { type: 'image/png' });
                        
                        const preview: Preview = {
                            image: image,
                            width: data.properties.width,
                            height: data.properties.height,
                            css: data.css,
                        };

                        setPreview(preview);
                    });
            }
        }
    };

    const ImagePreview = () => {
        if (preview.image) {
            const imageURL = URL.createObjectURL(preview.image);

            return <Image width={preview.width} height={preview.height} alt="spritesheet" src={imageURL} />;
        }

        return null;
    };

    return (
        <div className='section'>
            <div className="container is-flex is-flex-direction-column">
                <div className="block">
                    <form onSubmit={onSubmit}>
                        <div className="field is-horizontal">
                            <div className="field-body">
                                <div className="field is-flex-grow-1">
                                    <div className="file has-name is-fullwidth">
                                        <label className='file-label' htmlFor="image">
                                            <input className='file-input' ref={fileInputRef} onChange={(ev) => setFileInput(ev.target.value)} type="file" name="image" id="image" multiple />
                                    
                                            <span className="file-cta">
                                                <span className="file-icon">
                                                    <i className="fas fa-upload"></i>
                                                </span>
                                    
                                                <span className="file-label">Choose a file…</span>
                                            </span>

                                            <span className="file-name">{fileInput}</span>
                                        </label>
                                    </div>
                                </div>

                                <div className="field is-flex-grow-0">
                                    <div className="control">
                                        <button className='button is-link' type="submit">Create Spritesheet</button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>

                <div className="block is-flex is-flex-direction-column is-flex-grow-1">
                    <div className='is-flex-grow-1 is-flex is-flex-direction-column'>
                        <pre className='is-flex-grow-1'>{preview.css}</pre>
                    </div>
                    <div className='is-flex-grow-1'>
                        <ImagePreview />
                    </div>
                </div>
            </div>
        </div>
    );
}
