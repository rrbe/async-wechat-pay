const CODE = {
    SUCCESS: '0',
    FAIL: '-1'
};

const MSG = {
    SUCCESS: 'Request success.',
    BAD_REQUEST: 'Fail to make a http request.',
    REQUEST_FAIL: 'Api return bad result.',
    XML_FORMAT_ERROR: 'XML format is wrong.',
    SIGN_ERROR: 'Sign not match the given params.'
};

module.exports = {
    CODE,
    MSG,
};
