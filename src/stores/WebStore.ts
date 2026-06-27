export abstract class WebStore {
    protected readonly USER_AGENT = 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10.15; rv:153.0) Gecko/20100101 Firefox/153.0';
    public abstract readonly STORE_ID: string;
    protected abstract readonly MATCH_URL: RegExp;

    public abstract extractImages(): Promise<GameArt[]>;
    public abstract generateImageUrl(url: string, width?: number, height?: number): string;

    constructor(
        protected storeOptions: WebStoreOptions,
        protected thumbnailOptions: ThumbnailOptions,
    ) {};

    public isValid(): boolean {
        return !!this.MATCH_URL.exec(window.location.href);
    }
}
