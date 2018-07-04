// some external parameters like language
class Page {
    private _lang: string = 'en';

    constructor() {
        this.lang = document.documentElement.getAttribute('lang') || this._lang;
    }

    get lang(): string {
        return this._lang;
    }

    set lang(value: string) {
        this._lang = value;
        document.documentElement.setAttribute('lang', this._lang);
    }
}

export default new Page();
