/* eslint-disable import/first */
import {AppService, AppVolume} from "./AppService";
import {MadmenVolume} from "./MadmenService";
import {mdApiKey, urlGetTwitterUser} from "../config/appConfig";

export class TwitterService extends AppService {

    async getUserInfo(vo: MadmenVolume) {

        try {
            let result = false;

            const url = new URL(urlGetTwitterUser);
            url.searchParams.append('apikey', mdApiKey);
            url.searchParams.append('screen_name', vo.r.screen_name);

            await fetch(url.toString(), {
                method: 'POST',
                mode: 'cors',
                cache: 'no-cache',
                credentials: 'same-origin',
                headers: {
                    'Content-Type': 'application/json'
                },
            })
            .then((res) => {
                // console.log('TwitterService::getUserInfo res', res);
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
            .catch((e: Error) => {
                this.addError('Twitterアカウントのデータを取得出来ませんでした。');
                this.addError('メッセージ:'+e.message);
                console.log(e);
            });

            if (result) {
                return true;
            }
        }
        catch (e: any) {
            this.addError('メッセージ:'+e.message);
            console.log(e);
        }
        this.addError('Twitterアカウントのデータを取得出来ませんでした。');
        return false;
    }
}

export class TwitterVolume extends AppVolume {
}
