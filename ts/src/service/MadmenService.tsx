/* eslint-disable import/first */
import {db} from '../config/firebase';
import {
    addDoc,
    collection,
    doc,
    getDoc,
    getDocs,
    query,
    runTransaction,
    serverTimestamp,
    where
} from 'firebase/firestore';
import {AppService, AppVolume} from "./AppService";
import {TwitterService} from "./TwitterService";
import {mdApiKey, urlGetIpAddress} from "../config/appConfig";
import {validate} from "validate.js";

/**
 *
 */
export class MadmenService extends AppService {

    table: string = 'madmen';

    static dataList: MadmenCols[] = [];
    static dataListSortOrder: string = '';
    static dataListSortColumn: string = '';

    async paging(vo: MadmenVolume) {

        // データを全件取得する
        if (0 === MadmenService.dataList.length || 1 === vo.data_reload) {
            const madmenCollection = collection(db, this.table);
            const madmenQuery = query(madmenCollection);

            // await getDocsを実行するとなぜかpage_noが1になるので対応
            const page_no = vo.page();
            const madmenDocs = await getDocs(madmenQuery);
            vo.set_page(page_no);

            MadmenService.dataList = [];
            madmenDocs.forEach((cols) => {
                const r = new MadmenCols({...cols.data(), id: cols.id});
                if (null === r.account_upd_date) {
                    r['account_upd_date'] = {seconds: 0};
                }
                MadmenService.dataList.push(r);
            });

            this.sort(vo);
        }
        else {
            // ソートキーや並び順が変更時は並び替えを行う
            const sort_key_allows = vo.sort_key_allows();
            const col = (sort_key_allows.hasOwnProperty(vo.sort_key())) ? sort_key_allows[vo.sort_key()].sort_key : 'cnt_point';
            if (col !== MadmenService.dataListSortColumn || vo.sort_ud() !== MadmenService.dataListSortOrder) {
                this.sort(vo);
            }
        }

        // ページ表示分のデータ取得
        vo.set_total(MadmenService.dataList.length);
        vo.rs = MadmenService.dataList.slice(vo.offset(), vo.offset()+vo.limit());
    }

    sort(vo: MadmenVolume) {
        const sort_key_allows = vo.sort_key_allows();
        const col = (sort_key_allows.hasOwnProperty(vo.sort_key())) ? sort_key_allows[vo.sort_key()].sort_key : 'cnt_point';
        MadmenService.dataList.sort((a: any, b: any) => {
            if ('asc' === vo.sort_ud()) {
                return (a[col] > b[col]) ? 1 : (a[col] < b[col]) ? -1 : 0;
            }
            else {
                return (a[col] > b[col]) ? -1 : (a[col] < b[col]) ? 1 : 0;
            }
        });
        MadmenService.dataListSortColumn = col;
        MadmenService.dataListSortOrder = vo.sort_ud();
    }

    async find_by_id(id: string) {
        const madmenDoc = await getDoc(doc(db, this.table, id));
        if (! madmenDoc.exists()) {
            return false;
        }
        return new MadmenCols({...madmenDoc.data(), id: madmenDoc.id});
    }

    /**
     *
     * @param vo
     */
    async add(vo: MadmenVolume) {
        vo.result = false;

        vo.r.screen_name = vo.r.screen_name.trim();

        const constraints1 = {
            app_kb: {
                presence: {
                    allowEmpty: false,
                    message: "^アプリ区分は必須です。",
                },
                exclusion: {
                    within: {
                        2: 'Instagram',
                        3: 'Facebook',
                        4: 'YouTube',
                        5: 'Line',
                    },
                    message: "^%{value}は未対応です。"
                },
                numericality: {
                    onlyInteger: true,
                    greaterThanOrEqualTo: 1,
                    lessThanOrEqualTo: 5,
                    message: "^アプリ区分は1～5でなければなりません。",
                }
            },
            screen_name: {
                presence: {
                    allowEmpty: false,
                    message: "^ユーザー名は必須です。",
                },
            },
        };

        const errors1 = validate(vo.r, constraints1);
        if (undefined !== errors1) {
            this.addError(errors1);
            return;
        }

        if (1 === vo.r.app_kb) {
            const twitter = new TwitterService();
            const getUserInfoResult = await twitter.getUserInfo(vo);
            this.addError(twitter.getErrorMessage());
            this.addSuccess(twitter.getSuccessMessage());
            if (! getUserInfoResult) {
                return;
            }
        }

        const constraints2 = {
            app_id: {
                presence: {
                    allowEmpty: false,
                    message: "^アプリIDは必須です。",
                },
            },
            user_name: {
                presence: {
                    allowEmpty: false,
                    message: "^表示名は必須です。",
                },
            },
            image_url: {
                presence: {
                    allowEmpty: false,
                    message: "^画像URLは必須です。",
                },
            },
        };

        const errors2 = validate(vo.r, constraints2);
        if (undefined !== errors2) {
            this.addError(errors2);
            return;
        }

        if (! await this.duplicateCheck(vo)) {
            return;
        }

        if (! await this.addFirebase(vo)) {
            return;
        }

        vo.result = true;
    }

    /**
     *
     * @param vo
     */
    async duplicateCheck(vo: MadmenVolume) {

        const constraints1 = {
            app_kb: {
                presence: {
                    allowEmpty: false,
                    message: "^アプリ区分は必須です。",
                },
                numericality: {
                    onlyInteger: true,
                    greaterThanOrEqualTo: 1,
                    lessThanOrEqualTo: 5,
                    message: "^アプリ区分は1～5でなければなりません。",
                }
            },
            app_id: {
                presence: {
                    allowEmpty: false,
                    message: "^アプリIDは必須です。",
                },
            },
        };

        const errors1 = validate(vo.r, constraints1);
        if (undefined !== errors1) {
            this.addError(errors1);
            return false;
        }

        const madmenDocs = await getDocs(query(collection(db, this.table)
            , where('app_kb', '==', vo.r.app_kb)
            , where('app_id', '==', vo.r.app_id)
        ));

        if (madmenDocs.docs.length) {
            this.addError('app_kb', `Twitterにいるそのキチガイは既に登録済みです。`);
            this.addError('screen_name', `Twitterにいるそのキチガイは既に登録済みです。`);
            return false;
        }

        return true;
    }

    /**
     *
     * @param vo
     */
    async addFirebase(vo: MadmenVolume) {
        try {
            await addDoc(collection(db, this.table), {
                app_kb: vo.r.app_kb,
                app_id: vo.r.app_id,
                screen_name: vo.r.screen_name,
                user_name: vo.r.user_name,
                image_url: vo.r.image_url,
                cnt_agree: vo.r.cnt_agree,
                cnt_disagree: vo.r.cnt_disagree,
                cnt_point: vo.r.cnt_point,
                voted_ip: vo.r.voted_ip,
                comments: vo.r.comments,
                account_upd_date: serverTimestamp(),
                add_date: serverTimestamp(),
                upd_date: serverTimestamp(),
            });

            this.addSuccess(`${vo.r.user_name}がキチガイデータベースに登録されました。`);
            return true;
        }
        catch (e: any) {
            this.addError('Firebaseキチガイドキュメント登録処理でエラーが発生しました。');
            this.addError('メッセージ:'+e.getMessage());
            return false;
        }
    }

    /**
     *
     * @param vo
     */
    async update(vo: MadmenVolume) {
        const constraints1 = {
            id: {
                presence: {
                    allowEmpty: false,
                    message: "^キチガイIDは必須です。",
                },
            },
            app_kb: {
                numericality: {
                    onlyInteger: true,
                    greaterThanOrEqualTo: 1,
                    lessThanOrEqualTo: 2,
                    message: "^アプリ区分は1～5でなければなりません。",
                }
            },
        };

        const errors1 = validate(vo.r, constraints1);
        if (undefined !== errors1) {
            this.addError(errors1);
            return false;
        }

        // 読み込んでトランザクションかけて更新
        const newData: any = {};
        vo.update_cols.forEach((column_name) => {
            // @ts-ignore
            newData[column_name] = vo.r[column_name];
        });

        const madmenDocRef = doc(db, this.table, vo.r.id);
        await runTransaction(db, async (transaction) => {
            const madmenDoc = await getDoc(madmenDocRef);
            if (! madmenDoc.exists()) {
                throw new Error("Document does not exist!");
            }
            newData['upd_date'] = serverTimestamp();
            transaction.update(madmenDocRef, newData);
        });

        if (! vo.none_update_message) {
            this.addSuccess(`${vo.r.user_name}のデータを更新しました。`);
        }

        if (newData.hasOwnProperty('account_upd_date')) {
            const date = new Date();
            newData.account_upd_date['seconds'] = Math.floor(date.getTime()/1000);
        }

        this.updateDataListRow(vo.r.id, newData);

        return true;
    }

    /**
     *
     * @param vo
     */
    async addComment(vo: MadmenVolume) {
        vo.result = false;

        vo.comment = vo.comment.trim();

        const constraints1 = {
            id: {
                presence: {
                    allowEmpty: false,
                    message: "^idは必須です。",
                }
            },
            comment: {
                presence: {
                    allowEmpty: false,
                    message: "^コメントは必須です。",
                },
            },
        };

        const errors1 = validate(vo, constraints1);
        if (undefined !== errors1) {
            this.addError(errors1);
            return;
        }

        // 更新
        const madmenDocRef = doc(db, this.table, vo.id);

        // 同じ内容のコメントチェック
        const madmenCheck = await getDoc(madmenDocRef);
        if (! madmenCheck.exists()) {
            this.addError("Document does not exist!");
            return false;
        }

        const checkData = madmenCheck.data();
        if (checkData.hasOwnProperty('comments') && checkData.comments.includes(vo.comment)) {
            this.addError("既に同じ内容のコメントがあります。\n同じコメントは投稿できません。");
            return false;
        }

        try {

            const newData: any = {
                comments: [],
            };

            await runTransaction(db, async (transaction) => {

                // 更新
                const madmenDoc = await getDoc(madmenDocRef);
                if (! madmenDoc.exists()) {
                    throw new Error("Document does not exist!");
                }

                const oldData: any = madmenDoc.data();
                if (oldData.hasOwnProperty('comments')) {
                    newData.comments = oldData.comments;
                }

                newData.comments.push(vo.comment);

                transaction.update(madmenDocRef, newData);
            });

            this.addSuccess("コメントが正常に投稿されました。");
            this.updateDataListRow(vo.id, newData);
            return newData;
        }
        catch (e: any) {
            // this.addError(e.getMessage());
            console.log(e);
        }

        this.addError('コメント投稿処理でエラーが発生しました。');
        return false;
    }

    /**
     *
     * @param vo
     */
    async doVote(vo: MadmenVolume) {

        const constraints1 = {
            id: {
                presence: {
                    allowEmpty: false,
                    message: "^キチガイIDは必須です。",
                },
            },
            app_kb: {
                presence: {
                    allowEmpty: false,
                    message: "^アプリ区分は必須です。",
                },
                numericality: {
                    onlyInteger: true,
                    greaterThanOrEqualTo: 1,
                    lessThanOrEqualTo: 2,
                    message: "^アプリ区分は1～5でなければなりません。",
                }
            },
            app_id: {
                presence: {
                    allowEmpty: false,
                    message: "^アプリIDは必須です。",
                },
            },
            vote_kb: {
                presence: {
                    allowEmpty: false,
                    message: "^投票区分は必須です。",
                },
                numericality: {
                    onlyInteger: true,
                    greaterThanOrEqualTo: 1,
                    lessThanOrEqualTo: 5,
                    message: "^投票区分は1～2でなければなりません。",
                }
            },
        };

        const errors1 = validate(vo, constraints1);
        if (undefined !== errors1) {
            this.addError(errors1);
            return false;
        }

        // @ts-ignore
        const url: any = new URL(urlGetIpAddress);
        // @ts-ignore
        url.searchParams.append('apikey', mdApiKey);

        let ipv4 = '';
        await fetch(url, {
            method: 'POST',
            mode: 'cors',
            cache: 'no-cache',
            credentials: 'same-origin',
            headers: {
                'Content-Type': 'application/json'
            },
        })
        .then((res) => {
            return res.json();
        })
        .then((json) => {
            this.setJsonMessage(json);
            if (! json.result) {
                return;
            }
            ipv4 = json.data.ipv4;
        })
        .catch(e => {
            this.addError('IPアドレス取得APIでエラーが発生しました。');
            this.addError('メッセージ:'+e.message);
        });

        if ('' === ipv4) {
            return false;
        }

        const madmenDocRef = doc(db, this.table, vo.id);

        // 投票済みチェック
        const madmenCheck = await getDoc(madmenDocRef);
        if (! madmenCheck.exists()) {
            this.addError("Document does not exist!");
            return false;
        }
        if (madmenCheck.data().voted_ip.includes(ipv4)) {
            this.addError("既にあなたと同じIPアドレスからの投票があります。\n同じIPアドレスから同じ人へは一回しか投票できません。");
            return false;
        }

        try {

            const newData: any = {
                cnt_agree: 0,
                cnt_disagree: 0,
                cnt_point: 0,
                voted_ip: []
            };

            await runTransaction(db, async (transaction) => {

                // 更新
                const madmenDoc = await getDoc(madmenDocRef);
                if (! madmenDoc.exists()) {
                    throw new Error("Document does not exist!");
                }

                const oldData: any = madmenDoc.data();

                // 同意カウント
                newData.cnt_agree = oldData.cnt_agree;
                newData.cnt_disagree = oldData.cnt_disagree;
                if (1 === vo.vote_kb) {
                    newData.cnt_agree++;
                }
                else {
                    newData.cnt_disagree++;
                }

                // 合計ポイント
                newData.cnt_point = newData.cnt_agree-newData.cnt_disagree;

                // 投票済みIP
                newData.voted_ip = oldData.voted_ip;
                newData.voted_ip.push(ipv4);

                transaction.update(madmenDocRef, newData);
            });

            if (1 === vo.vote_kb) {
                this.addSuccess("キチガイに投票しました。\n投票ありがとうございました。");
            }
            else {
                this.addSuccess("まともに投票しました。\n投票ありがとうございました。");
            }

            this.updateDataListRow(vo.id, newData);
            return newData;
        }
        catch (e: any) {
            // this.addError(e.getMessage());
            console.log(e);
        }

        this.addError('キチガイ投票処理でエラーが発生しました。');
        return false;
    }

    updateDataListRow(id: string, newData: {}) {
        for (const i of Object.keys(MadmenService.dataList)) {
            // @ts-ignore
            const r = MadmenService.dataList[i];
            if (id !== r.id) {
                continue;
            }
            for (const key of Object.keys(newData)) {
                // @ts-ignore
                r[key] = newData[key];
            }
            // @ts-ignore
            MadmenService.dataList[i] = r;
            break;
        }
    }

    async updateAccountData(vo: MadmenVolume) {
        if (1 === vo.r.app_kb) {
            const twitter = new TwitterService();
            if (! await twitter.getUserInfo(vo)) {
                this.addError(twitter.getErrorMessage());
                this.addSuccess(twitter.getSuccessMessage());
                return false;
            }
        }
        else {
            this.addError('Twitter以外は未対応');
            return false;
        }
        vo.none_update_message = true;
        vo.r.account_upd_date = serverTimestamp();
        vo.update_cols = ['screen_name', 'user_name', 'image_url', 'account_upd_date'];
        const result = await this.update(vo);
        if (result) {
            this.addSuccess(`アカウントデータを最新状態に更新しました。`);
        }
        return result;
    }
}

/**
 *
 */
export class MadmenVolume extends AppVolume {

    protected _limit: number = 5;
    data_reload: number = 0;

    id: string = '';
    app_kb: string = '';
    app_id: string = '';
    vote_kb: number = 0;
    comment: string = '';
    none_update_message: boolean = false;

    protected _sort_key_allows: any = {
        '1': {
            label: 'キチガイランク',
            sort_key: 'cnt_point',
        },
        '2': {
            label: '登録日時',
            sort_key: 'add_date',
        },
    };

    rs: MadmenCols[] = [];
    r: MadmenCols;

    constructor(params?: any) {
        super(params);
        if ('object' === typeof params) {
            this.set(params);
        }
        this.r = new MadmenCols();
    }
}

/**
 *
 */
export class MadmenCols {

    constructor(obj?: object) {
        if ('object' === typeof obj) {
            for (const key in this) {
                if (obj.hasOwnProperty(key)) {
                    // @ts-ignore
                    this[key] = obj[key];
                }
            }
        }
    }

    id: string = '';

    /**
     * @var アプリ区分 1:Twitter, 2:Instagram, 3:FaceBook, 4:LINE, 5:YouTube
     */
    app_kb: number = 0;

    /**
     *
     * @var アプリID TwitterのユーザーID, InstagramのユーザーID, FaceBookのユーザーID, LINEのユーザーID, 5:YouTubeのユーザーID
     */
    app_id: string = '';

    /**
     * @var ユーザー名
     */
    screen_name: string = '';

    /**
     * @var 表示名
     */
    user_name: string = '';

    /**
     * @var 画像URL
     */
    image_url: string = '';

    /**
     * @var 上げ
     */
    cnt_agree: number = 0;

    /**
     * @var 下げ
     */
    cnt_disagree: number = 0;

    /**
     * @var ポイント
     */
    cnt_point: number = 0;

    /**
     * @var 投票済みIPアドレス
     */
    voted_ip: string[] = [];

    /**
     * @var コメント
     */
    comments: string[] = [];

    /**
     * @var アカウントデータ更新日時
     */
        // @ts-ignore
    account_upd_date: serverTimestamp = null;

    /**
     * @var 登録日時
     */
        // @ts-ignore
    add_date: serverTimestamp = null;

    /**
     * @var 更新日時
     */
        // @ts-ignore
    upd_date: serverTimestamp = null;
}
