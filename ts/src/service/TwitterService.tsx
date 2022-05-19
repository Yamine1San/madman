/* jshint strict: true */
/* eslint-disable import/first */
import {AppService, AppVolume} from "./AppService";
import {MadmenVolume} from "./MadmenService";
import {mdApiKey, urlGetTwitterUser} from "../config/appConfig";

export class TwitterService extends AppService {

    async getUserInfo(vo: MadmenVolume) {

        try {
            let result = false;

            // @ts-ignore
            const url: any = new URL(urlGetTwitterUser);
            // @ts-ignore
            url.searchParams.append('apikey', mdApiKey);
            url.searchParams.append('screen_name', vo.r.screen_name);

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
                // TwitterAPI
                if (json.data.hasOwnProperty('errors')) {
                    json.data.errors.forEach((error: any) => {
                        this.addError('twitter', 'TwitterAPI '+error.code+':'+error.message);
                    });
                    return;
                }
                vo.r.app_id = json.data.id_str;
                vo.r.screen_name = json.data.screen_name;
                vo.r.user_name = json.data.name;
                vo.r.image_url = json.data.profile_image_url_https.replace('_normal.', '.');
                result = true;
            })
            .catch(e => {
                this.addError('Twitterアカウントのデータを取得出来ませんでした。');
                this.addError('メッセージ:'+e.message);
            });

            if (result) {
                return true;
            }
        }
        catch (e: any) {
            console.log(e);
        }
        this.addError('Twitterアカウントのデータを取得出来ませんでした。');
        return false;
    }
}

export class TwitterVolume extends AppVolume {
}
