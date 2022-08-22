import { useState, createRef, FormEvent } from 'react';
import Download from './Download';

type Preview = {
    image: string | null;
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

    const onFileInputChange = (ev) => {
        if (ev.target.files.length > 1) {
            setFileInput(`${ev.target.files.length} files selected...`);
        } else if (ev.target.files.length > 0) {
            setFileInput(ev.target.files[0].name);
        } else {
            setFileInput('');
        }
    };

    const getSpriteClasses = (css: string) => {
        const spriteClassRegex = /^\.(sprite--.*):after {/gm;
        const matches = css.matchAll(spriteClassRegex);
        const classes = Array.from(matches).map((match) => match[1]);

        return classes;
    }

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
                    .then((data: Preview) => {
                        getSpriteClasses(data.css);
                        setPreview(data);
                    });
            }
        }
    };

    const SpritesPreview = ({ css, bg }) => {
        if (css && bg) {
            const size = { '--size': 64 } as React.CSSProperties;
            const spriteClasses = getSpriteClasses(css || '');
            const finalCSS = css.replace('sprite.png', bg);
            const sprites = spriteClasses.map((spriteClass, index) => {
                const className = `sprite ${spriteClass}`;

                return (<div key={index} className={className} style={size}></div>);
            });
        
            return (
                <>
                    <style>{finalCSS}</style>
                    <div className='sprites'>{sprites}</div> 
                </>
            );
        }

        return null;
    }

    return (
        <div className='section'>
            <div className="container is-flex is-flex-direction-column">
                <div className="block">
                    <h2 className='title'>Sprite Sheet Maker</h2>
                    <form onSubmit={onSubmit}>
                        <div className="field is-horizontal">
                            <div className="field-body">
                                <div className="field is-flex-grow-1">
                                    <div className="file has-name is-fullwidth">
                                        <label className='file-label' htmlFor="image">
                                            <input 
                                                ref={fileInputRef} 
                                                className='file-input' 
                                                onChange={onFileInputChange} 
                                                type="file" 
                                                name="image" 
                                                id="image" 
                                                multiple
                                            />
                                    
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
                                        <button 
                                            type="submit"
                                            className='button is-link' 
                                            disabled={fileInput.length < 1}
                                        >
                                            Create Spritesheet
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>

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

                <div className="block is-flex is-justify-content-center">
                    <Download css={preview.css} image={preview.image} />
                </div>
            </div>
        </div>
    );
}
