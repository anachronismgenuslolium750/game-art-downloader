declare module '*?raw' {
    const content: string;
    export = content;
}

type WebStoreOptions = {
    market: string;
    language: string;
};

type ThumbnailOptions = {
    width: number;
};

type GameArt = {
    purpose: string;
    thumb: string;
    images: Array<{
        src: string;
        name: string;
        width?: number;
        height?: number;
    }>;
};

type XboxProductsResponse = {
    Products: Array<{
        LocalizedProperties: Array<{
            Images: Array<{
                Uri: string;
                Width: number;
                Height: number;
                ImagePurpose: string;
            }>;
        }>;
    }>;
};

type PlaystationMediaItem = {
    role: string;
    type: string;
    url: string;
};

type PlaystationGraphResponse = {
    data: {
        productRetrieve: {
            concept: {
                id: string;
                media: PlaystationMediaItem[];
            };
        };
    };
};

type PlaystationPreloadData = {
    cache: Record<string, {
        media: PlaystationMediaItem[];
    }>;
};

type NintendoGameData = {
    '@graph': [{
        sku: string;
    }];
};

type NintendoGraphResponse = {
    data: {
        product: {
            productImage: {
                publicId: string;
            };
            productImageSquare: {
                url: string;
            };
        };
    };
};

type GogProductData = {
    cardProduct: {
        galaxyBackgroundImage: string;
        backgroundImage: string;
        image: string;
        boxArtImage: string;
        logo: string;
    };
};
