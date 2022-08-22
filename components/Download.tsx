import FileSaver from 'file-saver';
import JSZip from 'jszip';

export default function Download ({ css, image }) {
    const onClick = () => {
        const zip = new JSZip();

        const imageBase64 = image.replace('data:image/png;base64, ', '');

        zip.file('sprite.css', css);
        zip.file('sprite.png', imageBase64, {base64: true});

        zip.generateAsync({ type:'blob' })
            .then((content) => FileSaver.saveAs(content, 'sprites.zip'));
    };

    return (
        <button className='button' onClick={onClick}>Download</button>
    );
}