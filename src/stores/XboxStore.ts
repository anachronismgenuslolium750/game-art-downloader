import { WebStore } from "./WebStore";

export class XboxStore extends WebStore {
    protected override readonly MATCH_URL = /https:\/\/www\.xbox\.com\/\w{2}-\w{2}\/\games\/store\/[\w\-]+\/(\w+)/;

    public override async extractImages(): Promise<GameArt[]> {
        const match = this.MATCH_URL.exec(window.location.href);
        if (!match) {
            return [];
        }

        const gameId = match[1];
        const url = `https://displaycatalog.mp.microsoft.com/v7.0/products?bigIds=${gameId}&market=${this.storeOptions.market}&languages=${this.storeOptions.language}`;
        const options = {
            method: 'GET',
            headers: {
                'User-Agent': this.USER_AGENT,
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

        return [];
    }

    private processData(data: XboxProductsResponse): GameArt[] {
        const gameArts: GameArt[] = [];
        for (const product of data.Products) {
            const props = product.LocalizedProperties[0];
            props.Images.forEach(img => {
                const purpose = img.ImagePurpose;
                if (['Screenshot'].indexOf(purpose) > -1) {
                    return;
                }

                gameArts.push({
                    purpose: img.ImagePurpose,
                    thumb: this.generateImageUrl(img.Uri, img.Width, img.Width),
                    images: [{
                        src: this.generateImageUrl(img.Uri, img.Width, img.Height),
                        name: `${img.Width}x${img.Height}.png`,
                        width: img.Width,
                        height: img.Height,
                    }],
                });
            });
        }

        return gameArts;
    }

    public override generateImageUrl(url: string, width: number, height: number): string {
        return `https:${url}?format=png&w=${width}&h=${height}`;
    }
}
