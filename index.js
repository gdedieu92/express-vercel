const express = require("express");
var { RtcTokenBuilder, RtcRole } = require('agora-access-token');
const app = express();
const product = require("./api/product");

app.use(express.json({ extended: false }));

app.use("/api/product", product);


var APP_ID = process.env.APP_ID;
var APP_CERTIFICATE = process.env.APP_CERTIFICATE;

function nocache(req, res, next) {
    res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
    res.header('Expires', '-1');
    res.header('Pragma', 'no-cache');
    next();
}

var generateAccessToken = function (req, resp) {
    resp.header('Access-Control-Allow-Origin', "*")

    var channel = req.query.channel;
    if (!channel) return resp.status(500).json({ 'error': 'channel name is required' });
    var uid = req.query.uid;
    if (!uid) uid = 0;
    var expiredTs = req.query.expiredTs;
    if (!expiredTs) expiredTs = 0;

    var token = RtcTokenBuilder.buildTokenWithUid(APP_ID, APP_CERTIFICATE, channel, uid, RtcRole.PUBLISHER, expiredTs);
    return resp.json({ 'token': token });
};

app.get('/access_token', nocache, generateAccessToken);


const PORT = process.env.PORT || 8080;
app.listen(PORT, function () {
    console.log('Service URL http://127.0.0.1:' + PORT + "/");
    console.log('Channel Key request, /access_token?uid=[user id]&channel=[channel name]');
    console.log('Channel Key with expiring time request, /access_token?uid=[user id]&channel=[channel name]&expiredTs=[expire ts]');
});

