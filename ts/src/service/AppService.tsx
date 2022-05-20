
/**
 *
 */
export class AppService {
    private _messages: any = {
        successes: {},
        errors: {},
    };

    addSuccess = (key: any, msg?: any) => {
        this._addMessage('successes', key, msg);
    }

    addError = (key: any, msg?: any) => {
        this._addMessage('errors', key, msg);
    }

    private _addMessage = (message_type: string, key: any, msg?: any) => {
        if ('object' === typeof key) {
            for (const k of Object.keys(key)) {
                if ('object' === typeof key[k]) {
                    let key_only = 1;
                    for (const l of Object.keys(key[k])) {
                        key_only = 0;
                        this.__addMessage(message_type, l, key[k][l]);
                    }
                    if (key_only) {
                        this.__addMessage(message_type, k);
                    }
                    continue;
                }
                this.__addMessage(message_type, k, key[k]);
            }
            return;
        }
        this.__addMessage(message_type, key, msg);
    }

    private __addMessage = (message_type: string, key: any, msg?: any) => {

        if (! this._messages[message_type].hasOwnProperty(key)) {
            this._messages[message_type][key] = {};
        }

        if (undefined !== msg && null !== msg) {
            this._messages[message_type][key][msg] = null;
        }
    }

    getErrorMessage = (key?: any) => {
        return this.getMessage(this._messages.errors, key);
    }

    getSuccessMessage = (key?: any) => {
        return this.getMessage(this._messages.successes, key);
    }

    getMessage = (list: any, key?: any) => {
        if (undefined === key) {
            return list;
        }
        return list[key];
    }

    getErrorString = (separator = '<br>') => {
        return this.getMessageString(this._messages.errors, separator);
    }

    getSuccessString = (separator = '<br>') => {
        return this.getMessageString(this._messages.successes, separator);
    }

    getMessageString = (list: any, separator = '<br>') => {
        const messages: any = {};
        for (const key of Object.keys(list)) {
            let key_only = 1;
            if ('object' === typeof list[key]) {
                for (const k of Object.keys(list[key])) {
                    key_only = 0;
                    if (null === (list[key][k])) {
                        messages[k] = null;
                        continue;
                    }
                    messages[k+':'+list[key][k]] = null;
                }
                if (key_only) {
                    messages[key] = null;
                }
                continue;
            }
            for (const msg of Object.keys(list[key])) {
                key_only = 0;
                messages[key+':'+msg] = null;
            }
            if (key_only) {
                messages[key] = null;
            }
        }
        return Object.keys(messages).join(separator).replace("\n", separator);
    }

    setJsonMessage = (json: any) => {
        if (! json.hasOwnProperty('message')) {
            return;
        }

        if (json.message.hasOwnProperty('messages')) {
            this.addSuccess(json.message.messages);
        }

        if (json.message.hasOwnProperty('errors')) {
            this.addError(json.message.errors);
        }
    }
}

/**
 *
 */
export class AppVolume {

    protected _page: number = 1;
    protected _limit: number = 100;
    protected _max_limit: number = 1000;
    protected _total: number = 0;

    protected _sort_key_allows: any = {};
    protected _sort_key: string | any = '1';
    protected _sort_ud: string = 'asc';


    rs: any[] = [];
    r: any;
    result: boolean = false;
    update_cols:string[] = [];

    constructor(params?: any) {
        this.r = {};
        this.result = false;
        if ('object' === typeof params) {
            this.set(params);
        }
    }

    /**
     * @param params
     * @param value
     */
    set(params: any, value?: any):AppVolume {

        if ('object' === typeof params) {
            for (const key of Object.keys(params)) {

                if ('_result' === key || '_sort_key_allows' === key) {
                    continue;
                }

                if ('_page' === key) {
                    this.set_page(params[key]);
                    continue;
                }

                if ('_limit' === key) {
                    this.set_limit(params[key]);
                    continue;
                }

                if ('_max_limit' === key) {
                    this.set_max_limit(params[key]);
                    continue;
                }

                if ('_total' === key) {
                    this.set_total(params[key]);
                    continue;
                }

                if ('_sort_key' === key) {
                    this.set_sort_key(params[key]);
                    continue;
                }

                if ('_sort_ud' === key) {
                    this.set_sort_ud(params[key]);
                    continue;
                }

                // @ts-ignore
                this[key] = params[key];
            }
        }
        else {
            // @ts-ignore
            this[params] = value;
        }
        return this;
    }


    /**
     *
     * @param page 明細ページング処理のページ番号
     */
    set_page(page: number):AppVolume {
        this._page = page;
        if (page < 1) {
            this._page = 1;
        }
        return this;
    }

    /**
     * @return int
     */
    page() {
        return this._page;
    }

    /**
     * @param limit 明細ページング処理の明細数
     */
    set_limit(limit: number):AppVolume {
        this._limit = limit;
        if (this._max_limit < this._limit) {
            this._limit = this._max_limit;
        }
        return this;
    }

    /**
     * @return int
     */
    limit() {
        return this._limit;
    }

    /**
     * @param max_limit 明細ページング処理の最大明細数
     */
    set_max_limit(max_limit: number):AppVolume {
        this._max_limit = max_limit;
        if (this._max_limit < this._limit) {
            this._limit = this._max_limit;
        }
        return this;
    }

    /**
     * @param total 総件数
     */
    set_total(total: number):AppVolume {
        this._total = total;
        return this;
    }

    /**
     * @return int
     */
    total() {
        return this._total;
    }

    /**
     * @return int
     */
    offset() {
        const offset = (this._page-1) * this._limit;
        if (this._total <= offset) {
            this.set_page(Math.ceil(this._total / this._limit));
        }
        return (this._page-1) * this._limit;
    }

    /**
     * @return int
     */
    last_page() {
        return Math.ceil(this._total / this._limit);
    }

    /**
     * @param allows
     */
    set_sort_key_allows(allows = {}):AppVolume {
        this._sort_key_allows = allows;
        return this;
    }

    /**
     *
     */
    sort_key_allows() {
        return this._sort_key_allows;
    }

    /**
     *
     * @param sort_key
     */
    is_allowed_key(sort_key: string): boolean {

        for (const key of Object.keys(this._sort_key_allows)) {
            if (sort_key === key) {
                return true;
            }
            if (sort_key === this._sort_key_allows[key]) {
                return true;
            }
        }

        return false;
    }

    /**
     * @param sort_key
     */
    set_sort_key(sort_key: string):AppVolume {
        if (! this.is_allowed_key(sort_key)) {
            return this;
        }
        this._sort_key = sort_key;
        return this;
    }

    /**
     * @return string
     */
    sort_key() {
        return this._sort_key;
    }

    /**
     * @param sort_ud 'asc' OR 'desc'
     */
    set_sort_ud(sort_ud: string | undefined):AppVolume {
        if ('' === sort_ud) {
            return this;
        }
        this._sort_ud = this._get_sort_ud(sort_ud);
        return this;
    }

    /**
     * @return string
     */
    sort_ud() {
        return this._sort_ud;
    }

    /**
     * @param sort_key
     * @param sort_ud 'asc' OR 'desc'
     */
    add_sort_key(sort_key: string | {}, sort_ud?: string):AppVolume {
        if ('object' === typeof sort_key) {
            for (const tmp of Object.keys(sort_key)) {
                this._add_sort_key(tmp, sort_ud);
            }
            return this;
        }
        // @ts-ignore
        this._add_sort_key(sort_key, sort_ud);
        return this;
    }

    /**
     * @param sort_key
     * @param sort_ud 'asc' OR 'desc'
     */
    private _add_sort_key(sort_key: string, sort_ud?: string) {
        if (! this.is_allowed_key(sort_key)) {
            return;
        }

        if ('object' !== typeof this._sort_key) {
            this._sort_key = {};
        }

        // 削除して一番最後に入れる
        delete (this._sort_key[sort_key]);
        this._sort_key[sort_key] = this._get_sort_ud(sort_ud);
    }

    private _get_sort_ud(sort_ud: string | undefined) {
        if (undefined === sort_ud || null === sort_ud || '' === sort_ud) {
            return 'asc';
        }
        if ('{sort_ud}' === sort_ud) {
            return this._sort_ud;
        }

        sort_ud = sort_ud.toLowerCase();
        if ('desc' !== sort_ud && 'asc' !== sort_ud) {
            sort_ud = 'asc';
        }
        return sort_ud;
    }
}
