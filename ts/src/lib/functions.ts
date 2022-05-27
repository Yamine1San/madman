/**
 * 数値にカンマを付ける処理
 *
 * @param num
 * @returns {string}
 * @private
 */
export function number_format(num: any): string {
  if (undefined === num || null === num) {
    return '';
  }
  let str: string = String(num).replace(/\xA5/g, '').replace(/\\/g, '').replace(/,/g, '');
  if (! is_numeric(str)) {
    return '';
  }

  // tslint:disable-next-line:no-conditional-assignment
  while (str !== (str = str.replace(/^(-?\d+)(\d{3})/, "$1,$2"))) {
  }

  return str;
}

/**
 * 全角から半角への変換関数
 *
 * @see https://webllica.com/change-double-byte-to-half-width/
 * @param str 半角へ変換する文字列
 * @param pt 半角へ変換する文字列の正規表現パターン
 * @returns {string} 半角変換された文字列
 */
export function toHalfWidth(str: any, pt?: string): string {

  if ('string' !== typeof pt || '' === pt.toString()) {
    pt = '！-～';
  }

  const reg = new RegExp('['+pt+']', 'g');
  let ret = str.replace(reg, function (s: string) {
    return String.fromCharCode(s.charCodeAt(0)-0xFEE0);
  });

  // 文字コードシフトで対応できない文字の変換
  ret = ret
  .replace(/”/g, "\"")
  .replace(/’/g, "'")
  .replace(/‘/g, "`")
  .replace(/￥/g, "\\")
  .replace(/　/g, " ")
  .replace(/〜/g, "~");

  return ret;
}

/**
 * 0埋め
 *
 * @param pstrNum
 * @param pnumCnt
 */
export function _lpad(pstrNum: string, pnumCnt: number) {
  if (pstrNum != null && pnumCnt != null) {
    if (pnumCnt > 15) {
      pnumCnt = 15;
    }
    return _rstr("000000000000000"+pstrNum, pnumCnt);
  }
  return null;
}

/**
 * 右から切り出し
 *
 * @param pstrMsg
 * @param pnumCnt
 */
export function _rstr(pstrMsg: string, pnumCnt: number) {
  let lnumLen = 0;
  let lnumPos = 0;
  if (pstrMsg != null && pnumCnt != null) {
    lnumLen = pstrMsg.length;
    lnumPos = lnumLen-pnumCnt;
    if (lnumPos < 0) {
      lnumPos = 0;
    }
    return pstrMsg.substr(lnumPos);
  }
  return null;
}

/**
 * 日時取得 2020-05-01 23:59:00
 *
 * @param timestamp
 * @constructor
 */
export function YmdHis(timestamp: number): string {
  const date = new Date(timestamp * 1000);
  const year = date.getFullYear();
  const month = _lpad('00'+(date.getMonth()+1).toString(), 2);
  const day = date.getDate();
  const hours = _lpad('00'+date.getHours().toString(), 2);
  const minutes = _lpad('00'+date.getMinutes().toString(), 2);
  const seconds = _lpad('00'+date.getSeconds().toString(), 2);
  return (year+"-"+month+"-"+day+" "+hours+":"+minutes+":"+seconds);
}

/**
 * 数値かどうか判定
 *
 * @param val
 * @returns {boolean}
 */
export function is_numeric(val: any): boolean {
  const regexp = new RegExp(/^[-+]?\d*\.?\d+$/);
  return regexp.test(String(val));
}
