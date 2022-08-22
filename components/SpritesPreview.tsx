import { getSpriteClasses } from '../libs/utils';

export default function SpritesPreview({ css, bg }) {
    if (css && bg) {
        const size = { '--size': 64 } as React.CSSProperties;
        const spriteClasses = getSpriteClasses(css || '');
        const bgURL = `data:image/png;base64, ${bg}`;
        const finalCSS = css.replace('sprite.png', bgURL);
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
