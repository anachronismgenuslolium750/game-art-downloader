import { WebStore } from "./WebStore";

export class NintendoStore extends WebStore {
    protected override readonly MATCH_URL = /https:\/\/www\.nintendo\.com\/[a-z]{2}\/store\/products\/[\w\-]+/;

    public async extractImages(): Promise<GameArt[]> {
        const scriptTags = document.querySelectorAll('script[type="application/ld+json"]');

        for (const scriptTag of scriptTags) {
            let sku: string;
            try {
                const data = JSON.parse(scriptTag.innerHTML) as NintendoGameData;
                sku = data['@graph'][0].sku;
            } catch (e) {
                continue;
            }

            const variables = {
                personalized: false,
                sku: sku,
            };
            const extensions = {
                persistedQuery: {
                    version: 1,
                    sha256Hash: '369a9c8cc97fb66d134f9aa89741166665dfdf5d82d23ce1b3fd61962482c181',
                },
            };

            const url = new URL('https://graph.nintendo.com/');
            url.searchParams.append('operationName', 'ProductBySku');
            url.searchParams.append('variables', JSON.stringify(variables));
            url.searchParams.append('extensions', JSON.stringify(extensions));

            const options = {
                method: 'GET',
                headers: {
                    'User-Agent': this.USER_AGENT,
                    'apollographql-client-name': 'ncom',
                    'apollographql-client-version': '1.0.0',
                    'content-type': 'application/json',
                    'x-nintendo-graph': 'true',
                },
            };

            try {
                const response = await fetch(url, options);
                const data = await response.json();

                if (response.status === 200) {
                    return this.processData(data);
                }
            } catch (error) {
                console.error(error);
            }
        }

        return [];
    }

    private processData(data: NintendoGraphResponse): GameArt[] {
        const gameArts: GameArt[] = [];

        try {
            const product = data.data.product;
            if (product.productImage) {
                gameArts.push({
                    purpose: 'HeroArt',
                    thumb: this.generateImageUrl(product.productImage.publicId, this.thumbnailOptions.width),
                    images: [{
                        name: 'full.png',
                        src: this.generateImageUrl(product.productImage.publicId),
                    }],
                });
            }

            if (product.productImageSquare) {
                // Extract publicId
                let url = product.productImageSquare.url;
                const publicId = url.substring(url.indexOf('/store/'));

                gameArts.push({
                    purpose: 'SquareArt',
                    thumb: this.generateImageUrl(publicId, this.thumbnailOptions.width),
                    images: [{
                        name: 'full.png',
                        src: this.generateImageUrl(publicId),
                    }],
                });
            }
        } catch (e) {
            console.error(e);
        }

        return gameArts;
    }

    public override generateImageUrl(url: string, width?: number, height?: number): string {
        let fullUrl = 'https://assets.nintendo.com/image/upload/q_auto:best/f_png';
        if (width) {
            fullUrl += `/w_${width}`;
        }
        fullUrl += '/' + url;

        return fullUrl;
    }
}
