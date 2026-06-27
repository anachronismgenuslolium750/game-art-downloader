import { WebStore } from "./WebStore";

export class GogStore extends WebStore {
    public override readonly STORE_ID = 'gog';
    protected override readonly MATCH_URL = /https:\/\/www\.gog\.com\/[a-z]{2}\/game\/([\w\W\-\_]+)/;

    public override async extractImages(): Promise<GameArt[]> {
        const match = this.MATCH_URL.exec(window.location.href);
        if (!match) {
            return [];
        }

        const gameArts: GameArt[] = [];
        try {
            const productData = ((window as any).productcardData as GogProductData).cardProduct;
            const images: Array<keyof GogProductData['cardProduct']> = [
                'galaxyBackgroundImage',
                'backgroundImage',
                'image',
                'boxArtImage',
                'logo',
            ];

            images.forEach(key => {
                let url = productData[key];
                if (!url) {
                    return;
                }

                if (!url.endsWith('.jpg') && !url.endsWith('.png')) {
                    url += '.jpg';
                }

                gameArts.push({
                    purpose: key.replace('Image', ''),
                    thumb: url.replace('.jpg', '_product_tile_256.jpg'),
                    images: [{
                        src: this.generateImageUrl(url),
                        name: `full.png`,
                    }],
                });
            });

        } catch (e) {
            console.error(e);
        }

        return gameArts;
    }

    public override generateImageUrl(url: string, width?: number): string {
        return url.replace('.jpg', '.png');
    }
}
