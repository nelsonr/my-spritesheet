import { useState, createRef, FormEvent, ChangeEvent } from 'react';

export default function UploadForm({ onSubmit }) {
    const fileInputRef = createRef<HTMLInputElement>();
    const fileInputPlaceholder = 'Add images to create a new sprite sheet...';
    const [fileInputText, setFileInputText] = useState(fileInputPlaceholder);

    const onFileInputChange = (ev: ChangeEvent<HTMLInputElement>) => {
        if (ev.target.files.length > 1) {
            setFileInputText(`${ev.target.files.length} files selected...`);
        } else if (ev.target.files.length > 0) {
            setFileInputText(ev.target.files[0].name);
        } else {
            setFileInputText(fileInputPlaceholder);
        }
    };

    const onSubmitHandler = (ev: FormEvent) => {
        ev.preventDefault();
        onSubmit(fileInputRef.current.files);
    };

    return (
        <form onSubmit={onSubmitHandler}>
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
                                    multiple />

                                <span className="file-cta">
                                    <span className="file-icon">
                                        <i className="fas fa-upload"></i>
                                    </span>

                                    <span className="file-label">Choose a file…</span>
                                </span>

                                <span className="file-name">{fileInputText}</span>
                            </label>
                        </div>
                    </div>

                    <div className="field is-flex-grow-0">
                        <div className="control">
                            <button
                                type="submit"
                                className='button is-link'
                                disabled={fileInputText.length < 1}
                            >Create Spritesheet</button>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    );
}
