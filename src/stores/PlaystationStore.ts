import { WebStore } from "./WebStore";

export class PlaystationStore extends WebStore {
    // https://store.playstation.com/en-us/concept/10020020
    protected override readonly MATCH_URL = /https:\/\/store\.playstation\.com\/\w{2}-\w{2}\/(product|concept)\/([\w\-\_]+)/;

    public override async extractImages(): Promise<GameArt[]> {
        const match = this.MATCH_URL.exec(window.location.href);
        if (!match) {
            return [];
        }

        // const productType = match[1];
        const productId = match[2];

        const scriptTags = document.querySelectorAll('script[type="application/json"]');
        for (const scriptTag of scriptTags) {
            let media;
            try {
                const data: PlaystationPreloadData = JSON.parse(scriptTag.innerHTML);
                const cacheData = data.cache['Concept:' + productId] || data.cache['Product:' + productId];
                media = cacheData.media;
            } catch(e) {
                continue;
            }

            return this.mediaToGameArts(media);
        }

        return [];
    }

    public override generateImageUrl(url: string, width?: number): string {
        url = url + '?thumb=false';
        if (width) {
            url += '&w=' + width;
        }
        return url;
    }

    private mediaToGameArts(media: PlaystationMediaItem[]) {
        const gameArts: GameArt[] = [];

        media.forEach(item => {
            if (item.role === 'SCREENSHOT' || item.role === 'PREVIEW') {
                return;
            }

            gameArts.push({
                purpose: item.role,
                thumb: this.generateImageUrl(item.url, this.thumbnailOptions.width),
                images: [{
                    src: this.generateImageUrl(item.url, 5000),
                    name: `full`,
                }],
            });
        });

        return gameArts;
    }
}
