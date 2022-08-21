export type SpritesmithCoordinates = {
    [filePath: string]: {
        x: number;
        y: number;
        width: number;
        height: number;
    };
};

export type SpritesmithResult = {
    image: Buffer;
    coordinates: SpritesmithCoordinates;
    properties: {
        width: number;
        height: number;
    };
};

export type SpriteSheet = {
    image: Buffer;
    css: string;
    width: number;
    height: number;
};
