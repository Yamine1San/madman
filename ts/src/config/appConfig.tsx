import {Root} from "react-dom/client";

export const mdApiKey: string =
    (undefined !== process.env.REACT_APP_VL_MD_API_KEY)
        ? process.env.REACT_APP_VL_MD_API_KEY
        : '';

export const urlGetTwitterUser: string =
    (undefined !== process.env.REACT_APP_VL_URL_GET_TITTER_USER)
        ? process.env.REACT_APP_VL_URL_GET_TITTER_USER
        : 'https://yamine1san.ddns.net/madman/get/twitter/user';

export const urlGetIpAddress: string =
    (undefined !== process.env.REACT_APP_VL_URL_GET_IP_ADDRESS)
        ? process.env.REACT_APP_VL_URL_GET_IP_ADDRESS
        : 'https://yamine1san.ddns.net/madman/get/ip-address';

export const appKbDefaultValue = '1';
export const appKbMap: Map<number | string, string> = new Map();
appKbMap.set('', '');
appKbMap.set(1, 'Twitter');
appKbMap.set(2, 'Instagram(そのうち)');
appKbMap.set(3, 'Facebook(いつか)');
appKbMap.set(4, 'YouTube(いつか)');
appKbMap.set(5, 'Line(そのうち)');

export const sortOrderMap: Map<string, string> = new Map();
sortOrderMap.set('asc', '昇順');
sortOrderMap.set('desc', '降順');

export const sortKeyDefaultValue = '1';
export const sortUdDefaultValue = 'desc';
export const limitDefaultValue = 5;
export const globalState = {
    limit: limitDefaultValue,
};

type globalRootType = {
    rootRoot: Root | undefined,
    rootMadmenList: Root | undefined,
};

export const globalRoot: globalRootType = {
    rootRoot: undefined,
    rootMadmenList: undefined,
};

export const stateNameIndex: string = 'Index';
export const stateNameCard: string = 'Card';

// アカウント名や画像URLの更新間隔は6時間
export const updateAccountDataInterval = 60 * 60 * 6;
