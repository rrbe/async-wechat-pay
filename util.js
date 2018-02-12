const crypto = require('crypto');
const urllib = require('urllib');
const xml2js = require('xml2js');

const { CODE, MSG } = require('./constant');

const makeSignStr = (params) => {
    return Object.keys(params)
        .sort()
        .filter(item => params[item] && item !== 'sign')
        .reduce((acc, item) => {
            const value = typeof params[item] === 'object'
                ? JSON.stringify(params[item])
                : params[item];

            return `${acc}${item}=${value}&`;
        }, '')
        .slice(0, -1);;
}

const makeSign = (secretKey, params) => {
    const signTempStr = makeSignStr(params) + `&key=${secretKey}`;
    const md5 = crypto.createHash('md5');
    return md5.update(signTempStr).digest('hex').toUpperCase();
}

const handleResponseData = data => {
    return toJSON(data)
        .then(result => {
            if (result.return_code === 'SUCCESS' && result.result_code === 'SUCCESS') {
                return { code: CODE.SUCCESS, msg: MSG.SUCCESS, data: result }
            }
            return { code: CODE.FAIL, msg: MSG.REQUEST_FAIL, data: result.return_msg };
        })
        .catch(err => {
            return { code: CODE.FAIL, msg: MSG.XML_FORMAT_ERROR };
        });
}

const makeRequest = (url, params, options = {}) => {
    const data = toXML(params);
    const baseOptions = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/xml',
        },
        data,
    };
    const realOptions = Object.assign({}, baseOptions, options);

    return urllib.request(url, realOptions)
        .then(res => {
            return res.status === 200
                ? handleResponseData(res.data)
                : { code: CODE.FAIL, msg: MSG.BAD_REQUEST };
        })
        .catch(err => ({ code: CODE.FAIL, msg: err.message }));
}

const rand = (num = 24, isDigit = false) => {
    let ret = '';
    const seed = isDigit
        ? '1234567890'
        : '1234567890abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

    for (let i = 0; i < num; i++) {
        ret += seed.charAt(Math.floor(Math.random() * seed.length));
    }

    return ret;
}

const toXML = json => {
    const builder = new xml2js.Builder();
    return builder.buildObject({
        xml: json,
    });
}

const toJSON = xml => {
    const parser = new xml2js.Parser({
        trim: true,
        explicitArray: false,
        explicitRoot: false
    });
    return new Promise((resolve, reject) => {
        parser.parseString(xml, (err, result) => {
            if (err) reject(err);
            resolve(result);
        });
    });
};

const getUnixSeconds = () => {
    return parseInt(Date.now() / 1000).toString();
};

module.exports = {
    makeSign,
    rand,
    makeRequest,
    toXML,
    toJSON,
    getUnixSeconds,
}
