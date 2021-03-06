/**
 *
 */
import {AppMessage, InterfaceAppJson} from '../types/app.json';
import {addMessage, getMessageString} from '../libs/message.functions';

export class AppService {

  message: AppMessage;

  constructor() {
    this.message = new AppMessage();
  }

  addMessage = (key: any, msg?: any) => {
    addMessage(this.message.messages, key, msg);
  };

  addWarningMessage = (key: any, msg?: any) => {
    addMessage(this.message.warnings, key, msg);
  };

  addErrorMessage = (key: any, msg?: any) => {
    addMessage(this.message.errors, key, msg);
  };

  getMessage = (key?: any) => {
    return this._getMessage(this.message.messages, key);
  };

  getWarningMessage = (key?: any) => {
    return this._getMessage(this.message.warnings, key);
  };

  getErrorMessage = (key?: any) => {
    return this._getMessage(this.message.errors, key);
  };

  private _getMessage = (list: any, key?: any) => {
    if (undefined === key) {
      return list;
    }
    return list[key];
  };

  getMessageString = (separator = '<br>') => {
    return getMessageString(this.message.messages, separator);
  };

  getWarningMessageString = (separator = '<br>') => {
    return getMessageString(this.message.warnings, separator);
  };

  getErrorMessageString = (separator = '<br>') => {
    return getMessageString(this.message.errors, separator);
  };

  setJsonMessage = (json: InterfaceAppJson) => {
    if (! json.hasOwnProperty('message')) {
      return;
    }

    if (json.message.hasOwnProperty('messages')) {
      this.addMessage(json.message.messages);
    }

    if (json.message.hasOwnProperty('warnings')) {
      this.addWarningMessage(json.message.warnings);
    }

    if (json.message.hasOwnProperty('errors')) {
      this.addErrorMessage(json.message.errors);
    }
  };
}

/**
 *
 */
export class AppVolume {

  protected _page = 1;
  protected _limit = 100;
  protected _max_limit = 1000;
  protected _total = 0;

  protected _sort_key_allows: any = {};
  protected _sort_key: string|any = '1';
  protected _sort_ud = 'asc';


  rs: any[] = [];
  r: any;
  result = false;
  update_cols: string[] = [];

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
  set(params: any, value?: any): AppVolume {

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
   * @param page ?????????????????????????????????????????????
   */
  set_page(page: number|string|undefined|null): AppVolume {
    if (undefined === page || null === page || '' === page) {
      return this;
    }
    else if ('string' === typeof page) {
      this._page = parseInt(page, 10);
    }
    else {
      this._page = page;
    }
    if (page < 1) {
      this._page = 1;
    }
    return this;
  }

  /**
   * @return int
   */
  page() {
    if (undefined === this._page) {
      return 0;
    }
    return this._page;
  }

  /**
   * @param limit ???????????????????????????????????????
   */
  set_limit(limit: number|string|undefined|null): AppVolume {
    if (undefined === limit || null === limit || '' === limit) {
      return this;
    }
    else if ('string' === typeof limit) {
      this._limit = parseInt(limit, 10);
    }
    else {
      this._limit = limit;
    }
    if (this._max_limit < this._limit) {
      this._limit = this._max_limit;
    }
    return this;
  }

  /**
   * @return int
   */
  limit() {
    if (undefined === this._limit) {
      return 0;
    }
    return this._limit;
  }

  /**
   * @param max_limit ?????????????????????????????????????????????
   */
  set_max_limit(max_limit: number): AppVolume {
    this._max_limit = max_limit;
    if (this._max_limit < this._limit) {
      this._limit = this._max_limit;
    }
    return this;
  }

  /**
   * @param total ?????????
   */
  set_total(total: number): AppVolume {
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

  page_rowno_start() {
    return this.offset()+1;
  }

  page_rowno_end() {
    const tmpEndRow = this.offset()+this.limit();
    return (this.total() < tmpEndRow) ? this.total() : tmpEndRow;
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
  set_sort_key_allows(allows = {}): AppVolume {
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
  set_sort_key(sort_key: string|undefined|null): AppVolume {
    if (undefined === sort_key || null === sort_key || '' === sort_key) {
      return this;
    }
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
  set_sort_ud(sort_ud: string|undefined|null): AppVolume {
    if (undefined === sort_ud || null === sort_ud || '' === sort_ud) {
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
  add_sort_key(sort_key: string|object, sort_ud?: string): AppVolume {
    this._add_sort_key(sort_key, sort_ud);
    return this;
  }

  /**
   * @param sort_key
   * @param sort_ud 'asc' OR 'desc'
   */
  private _add_sort_key(sort_key: string|object, sort_ud?: string) {

    if ('object' === typeof sort_key) {
      for (const tmp of Object.keys(sort_key)) {
        this._add_sort_key(tmp, sort_ud);
      }
      return this;
    }

    if (! this.is_allowed_key(sort_key)) {
      return;
    }

    if ('object' !== typeof this._sort_key) {
      this._sort_key = {};
    }

    // ????????????????????????????????????
    delete (this._sort_key[sort_key]);
    this._sort_key[sort_key] = this._get_sort_ud(sort_ud);
  }

  private _get_sort_ud(sort_ud: string|undefined) {
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
