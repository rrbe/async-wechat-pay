const assert = require('power-assert');
const util = require('./util');
const Config = require('./config');

class WechatPay {
    constructor(options = {}) {
        assert(options.appid);
        assert(options.mchId);
        assert(options.secretKey);

        this.appid = options.appid;
        this.mch_id = options.mchId;
        this.secretKey = options.secretKey;
    }

    createAppOrder(appParams) {
        const basicParams = {
            appid: this.appid,
            mch_id: this.mch_id,
            nonce_str: util.rand(),
            trade_type: 'APP',
        };
        const mergeParams = Object.assign({}, appParams, basicParams);
        const sign = util.makeSign(this.secretKey, mergeParams);
        mergeParams.sign = sign;

        return util.makeRequest(Config.UNIFIED_ORDER, mergeParams);
    }

    verifyNotifyResponse(params) {
        const { sign } = params;
        delete params.sign;

        const signResult = util.makeSign(this.secretKey, params);
        if (signResult === sign) {
            return { code: CODE.SUCEESS, msg: MSG.SUCCESS };
        } else {
            return { code: CODE.FAIL, msg: MSG.SIGN_ERROR };
        }
    }

    queryorder(appParams) {
        const basicParams = {
            appid: this.addid,
            mch_id: this.mch_id,
            nonce_str: util.rand(),
        }
        const mergeParams = Object.assign({}, appParams, basicParams);
        const sign = util.makeSign(this.secretKey, mergeParams);
        mergeParams.sign = sign;

        return util.makeRequest(Config.QUERY_ORDER, mergeParams);
    }
}

module.exports = WechatPay;
