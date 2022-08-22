export function getSpriteClasses(css: string) {
    const spriteClassRegex = /^\.(sprite--.*):after {/gm;
    const matches = css.matchAll(spriteClassRegex);
    const classes = Array.from(matches).map((match) => match[1]);

    return classes;
}
