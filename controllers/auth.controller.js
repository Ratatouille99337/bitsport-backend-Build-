"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshUserInfo = exports.removeUser = exports.getAllUser = exports.getEarnedMoney = exports.getReferalInfo = exports.resetPassword = exports.forgotPassword = exports.SignIn = exports.getBoostedTweet = exports.saveScore = exports.followUs = exports.getUserScore = exports.getTwitInfo = exports.SignupTwit = exports.getRanking = exports.GetUser = exports.GetTwitAuth = exports.updateUserState = exports.setRefPoint = exports.getRefPoint = exports.getReferralCount = exports.setRefreshTime = exports.getRefreshTime = exports.SignUp = exports.sendMail = exports.sendEmail = void 0;
const bcrypt_1 = __importDefault(require("bcrypt"));
const ejs_1 = __importDefault(require("ejs"));
const User_1 = __importDefault(require("../models/User"));
const Token_1 = __importDefault(require("../models/Token"));
const crypto_1 = __importDefault(require("crypto"));
const mailgun_js_1 = __importDefault(require("mailgun-js"));
const needle_1 = __importDefault(require("needle"));
const axios_1 = __importDefault(require("axios"));
const helpers_1 = require("../service/helpers");
const config_1 = require("../config");
const ethers_1 = require("../service/wallet/ethers");
const tron_1 = require("../service/wallet/tron");
const FarmEarn_1 = __importDefault(require("../models/FarmEarn"));
const RefreshTime_1 = __importDefault(require("../models/RefreshTime"));
const RefPoint_1 = __importDefault(require("../models/RefPoint"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const nodemailer_smtp_transport_1 = __importDefault(require("nodemailer-smtp-transport"));
const mg = (0, mailgun_js_1.default)({
    apiKey: config_1.Mailgun_API_KEY,
    domain: "bitpool.gg",
});
const sendEmail = (email, subject, content) => __awaiter(void 0, void 0, void 0, function* () {
    const data = {
        from: "hello@bitpool.gg",
        to: email,
        subject: subject,
        html: content,
    };
    try {
        const result = yield mg.messages().send(data);
        console.log("Email sent successfully:", result);
    }
    catch (error) {
        console.error("Error sending email:", error);
    }
});
exports.sendEmail = sendEmail;
const sendMail = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(req.body.useremail);
    var transport = nodemailer_1.default.createTransport((0, nodemailer_smtp_transport_1.default)({
        service: "Gmail",
        auth: {
            user: "stanislav.kogutstt2@gmail.com",
            pass: "phlbvyefyuiddptp",
        },
    }));
    var mailOptions = {
        from: "stanislav.kogutstt2@gmail.com",
        to: req.body.useremail,
        subject: "Verify Code",
        html: `<html>
      <body>
        <div
          style="
            width: 600px;
            height: 800px;
            background-color: #191c25;
            margin: auto;
            color: white;
            padding: 50px;
          "
        >
          <h1>You are invited from Bitpool Game!</h1>
          <hr style="width: 100%; background-color: white" />
          <h3>Opponent:</h3>
          <h3>stanislav.kogutstt2@gmail.com</h3>
          <hr style="width: 100%; background-color: white" />
          <h4>You are invited from Bitpool Game.</h4>
          <h4>Please contact the game.</h4>
        </div>
      </body>
    </html>`,
    };
    transport.sendMail(mailOptions, function (error, response) {
        if (error) {
            res.send({ error: "Something wrong!" });
            console.log(error);
        }
        else {
            console.log("Suceess");
        }
    });
});
exports.sendMail = sendMail;
/**
 * User registration function
 * @param req
 * @param res
 * @returns
 */
const increaseReferralCnt = (referralId) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("referral twitter id ====> ", referralId);
    if (!referralId || referralId == "")
        return;
    const user = yield User_1.default.findOne({ "twitter.twitterScreenName": referralId });
    let tempCnt = user === null || user === void 0 ? void 0 : user.referralCnt;
    if (user && user.referralCnt !== undefined) {
        console.log("referral counts ====> ", user === null || user === void 0 ? void 0 : user.referralCnt);
        tempCnt++;
        user.referralCnt = tempCnt;
        yield user.save();
    }
});
const SignUp = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.body.email || !req.body.password) {
        return res.json({
            success: false,
            message: "Please, send your email and password.",
        });
    }
    const existingUser = yield User_1.default.findOne({ username: req.body.username });
    if (existingUser) {
        return res.json({ success: false, message: "Username already exists!" });
    }
    const user = yield User_1.default.findOne({ email: req.body.email });
    if (user) {
        return res.json({ success: false, message: "User already exists!" });
    }
    const ether = (0, ethers_1.getEtherPrivateKeyAndWalletAddress)();
    // const btc = getBTCPrivateKeyAndWalletAddress();
    const tron = (0, tron_1.getTronPrivateKeyAndWalletAddress)();
    const buyBitpAddr = (0, ethers_1.getEtherPrivateKeyAndWalletAddress)();
    let length = 0;
    yield User_1.default.find()
        .countDocuments()
        .then((data) => (length = data));
    const payload = {
        username: req.body.username,
        email: req.body.email,
        role: 0,
        password: req.body.password,
        referralCnt: 0,
        money: { busd: 0, usdt: 0, usd: 0, bitp: 0, quest: 3, cake: 0 },
        bonus: { busd: 0, usdt: 0, usd: 0, bitp: 0, quest: 0, cake: 0 },
        earnMoney: { busd: 0, usdt: 0, bitp: 0, cake: 0, usd: 0 },
        buy_BitpAddr: {
            privateKey: buyBitpAddr.privateKey,
            address: buyBitpAddr.address,
        },
        address: {
            ether: { privateKey: ether.privateKey, address: ether.address },
            bitcoin: { privateKey: ether.privateKey, address: ether.address },
            tron: {
                privateKey: (yield tron).privateKey,
                address: (yield tron).address,
            },
        },
        latestEarnAmount: 0,
        latestEarnUnit: "BUSD",
        latestPlayedTotalStreak: 0,
        latestPlayedCurStreak: 0,
        ipAddress: req.body.ipAddress,
        index: length + 1,
    };
    const newUser = new User_1.default(payload);
    const result = yield newUser.save();
    res.json({ success: true, token: (0, helpers_1.generateToken)(result) });
    // const transfer = nodemailer.createTransport({
    //   host: 'email-smtp.us-west-1.amazonaws.com',
    //   port: 587,
    //   auth: {
    //     user: USER_EMAIL,
    //     pass: USER_PASSWORD
    //   },
    //   secure: false,
    //   requireTLS: true,
    //   from: "welcome@bitsport.gg"
    // });
    // const templatePath = path.resolve('../server/template');
    // const templateFile = await fs.readFileSync(templatePath + "/welcome.hbs", "utf8");
    // const template = handlebars.compile(templateFile);
    // let data = { username: req.body.username };
    // let html = template(data);
    // transfer.sendMail({
    //   from: `Bitsports <welcome@bitsport.gg>`,
    //   to: `${req.body.email}`,
    //   subject: `Success to receive from ${newUser.firstname} ${newUser.lastname}!`,
    //   html
    // }, (err, data) => {
    //   if(err) res.json({ success: false, message: 'Sorry! Request has an error!' });
    // else
    // });
});
exports.SignUp = SignUp;
const getRefreshTime = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const refreshTime = yield RefreshTime_1.default.findOne();
        if (refreshTime) {
            res.json({ refreshTime: refreshTime.time });
        }
        else {
            const newTimeSchem = new RefreshTime_1.default({
                time: 24,
            });
            const newTime = yield newTimeSchem.save();
            if (newTime) {
                res.json({ refreshTime: 24 });
            }
        }
    }
    catch (error) {
        console.log("refresh time error ===> ", error);
        res.status(500).json({ err: error });
    }
});
exports.getRefreshTime = getRefreshTime;
const setRefreshTime = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { newTime } = req.body;
        if (!newTime)
            return res.status(500).json({ err: "Please send the newTime!" });
        const refreshTime = yield RefreshTime_1.default.findOne();
        if (refreshTime) {
            const result = yield RefreshTime_1.default.findByIdAndUpdate(refreshTime._id, { time: newTime }, { new: true });
            res.json({ refreshTime: result === null || result === void 0 ? void 0 : result.time });
        }
        else {
            const newTimeSchem = new RefreshTime_1.default({
                time: newTime,
            });
            const newTimeResult = yield newTimeSchem.save();
            if (newTimeResult) {
                res.json({ refreshTime: newTime });
            }
        }
    }
    catch (error) {
        console.log("setting refresh time error ===> ", error);
        res.status(500).json({ err: error });
    }
});
exports.setRefreshTime = setRefreshTime;
const getReferralCount = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        //@ts-ignore
        if (userId || userId != "") {
            const user = yield User_1.default.findById(userId);
            if (user) {
                res.json({ refcount: user.referralCnt });
            }
            else {
                res.status(500).json({ err: "User does not exist!" });
            }
        }
        else {
            res.json({ refcount: 0 });
        }
    }
    catch (error) {
        console.log("getting referral count error ====> ", error);
        res.status(400).json({ err: error });
    }
});
exports.getReferralCount = getReferralCount;
const getRefPoint = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const refPoint = yield RefPoint_1.default.findOne();
        if (refPoint) {
            res.json({ refPoint: refPoint.point });
        }
        else {
            const newTimeSchem = new RefPoint_1.default({
                point: 10,
            });
            const newTime = yield newTimeSchem.save();
            if (newTime) {
                res.json({ refPoint: 10 });
            }
        }
    }
    catch (error) {
        console.log("ref point error ===> ", error);
        res.status(500).json({ err: error });
    }
});
exports.getRefPoint = getRefPoint;
const setRefPoint = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { newPoint } = req.body;
        if (!newPoint)
            return res.status(500).json({ err: "Please send the newPoint!" });
        const point = yield RefPoint_1.default.findOne();
        if (point) {
            const result = yield RefPoint_1.default.findByIdAndUpdate(point._id, { point: newPoint }, { new: true });
            res.json({ newPoint: result === null || result === void 0 ? void 0 : result.point });
        }
        else {
            const newPointSchem = new RefPoint_1.default({
                point: newPoint,
            });
            const newPointResult = yield newPointSchem.save();
            if (newPointResult) {
                res.json({ newPoint: newPoint });
            }
        }
    }
    catch (error) {
        console.log("setting ref poin error ===> ", error);
        res.status(500).json({ err: error });
    }
});
exports.setRefPoint = setRefPoint;
const updateUserState = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const query = req.body;
        if (query.followed) {
            const updatedUser = yield User_1.default.findByIdAndUpdate(userId, {
                "twitter.followed": true,
            });
            if (updatedUser) {
                res.json({ success: true });
            }
        }
        else if (query.tweetedRef) {
            const updatedUser = yield User_1.default.findByIdAndUpdate(userId, {
                "twitter.tweetedRef": true,
            });
            if (updatedUser) {
                res.json({ success: true });
            }
        }
        else {
            const updatedUser = yield User_1.default.findByIdAndUpdate(userId, {
                "twitter.sharedTweet": true,
            });
            if (updatedUser) {
                res.json({ success: true });
            }
        }
    }
    catch (error) {
        console.log("updating user error ===> ", error);
        res.status(500).json({ err: error });
    }
});
exports.updateUserState = updateUserState;
const GetTwitAuth = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.body.userId) {
        return res.json({
            success: false,
            message: "Please, send your id.",
        });
    }
    const result = yield User_1.default.findOne({ _id: req.body.userId });
    if (result) {
        if (result.twitter.twitterName !== "" &&
            result.twitter.followed == true &&
            result.twitter.sharedTweet == true) {
            return res.json({ success: true, message: "Check" });
        }
        else {
            return res.json({ success: false, message: "Check" });
        }
    }
});
exports.GetTwitAuth = GetTwitAuth;
const GetUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { userId } = req.body;
    if (!userId) {
        return res.json({
            success: false,
            message: "Please, send your id.",
        });
    }
    try {
        const result = yield User_1.default.findById(userId);
        return res.json({
            success: true,
            data: result,
        });
    }
    catch (error) {
        console.error("Error updating user:", error);
        throw error;
    }
});
exports.GetUser = GetUser;
const getRanking = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield User_1.default.find({ "twitter.twitterScore": { $gte: 50 } })
            .sort({ "twitter.twitterScore": -1 })
            .limit(10)
            .select("twitter.twitterScore twitter.twitterName")
            .lean()
            .exec();
        const formattedUsers = users.map((user) => ({
            userId: user._id.toString(),
            Score: user.twitter.twitterScore,
            userName: user.twitter.twitterName,
        }));
        res.status(200).json(formattedUsers);
    }
    catch (error) { }
});
exports.getRanking = getRanking;
const SignupTwit = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    // console.log("signup twit", req.body)
    const { userId, twitterName, twitterId, twitterAvatar, twitterScreenName, refId, } = req.body;
    if (!userId || !twitterName || !twitterId || !twitterAvatar) {
        return res.json({
            success: false,
            message: "Please, send your id.",
        });
    }
    const user = yield User_1.default.findById(userId);
    // Check the account is correct for sign up.
    const url = `https://api.twitter.com/2/users/${twitterId}`;
    const params = {
        "user.fields": "created_at,public_metrics",
    };
    const options = {
        headers: {
            Authorization: `Bearer ${process.env.TWITTER_TOKEN}`,
        },
    };
    try {
        const response = yield (0, needle_1.default)("get", url, params, options);
        const period = new Date().getTime() - new Date(response.body.data.created_at).getTime();
        if (period / 1000 / 60 / 60 / 24 > 0 &&
            response.body.data.public_metrics.followers_count >= 0) {
            try {
                const result = yield User_1.default.findByIdAndUpdate(userId, {
                    $set: {
                        "twitter.twitterId": twitterId,
                        "twitter.twitterAvatar": twitterAvatar,
                        "twitter.twitterName": twitterName,
                        "twitter.twitterScreenName": twitterScreenName,
                        referralId: refId && refId != "" && (user === null || user === void 0 ? void 0 : user.referralId) == ""
                            ? refId
                            : user === null || user === void 0 ? void 0 : user.referralId,
                    },
                }, { new: true });
                console.log("referral 1 twitter name ====> ", user === null || user === void 0 ? void 0 : user.twitter.twitterName);
                if (refId && refId != "" && !(user === null || user === void 0 ? void 0 : user.twitter.twitterName)) {
                    console.log("referral 2 twitter name ====> ", user === null || user === void 0 ? void 0 : user.twitter.twitterName);
                    const refUser = yield User_1.default.findOne({
                        "twitter.twitterScreenName": refId,
                    });
                    if (refUser) {
                        yield increaseReferralCnt(refId);
                    }
                }
                if (result) {
                    return res.json({
                        success: true,
                        data: (0, helpers_1.generateToken)(result),
                    });
                }
                else {
                    return res.json({
                        success: true,
                    });
                }
            }
            catch (error) {
                console.error("Error updating user:", error);
                throw error;
            }
        }
        else {
            console.log("Your account age or count of followers less than standard.");
            return res.json({
                success: false,
                message: "Your account age or count of followers less than standard.",
            });
        }
    }
    catch (error) {
        console.log("twitter athenticate error", error);
        res.status(500).json({ err: error });
    }
});
exports.SignupTwit = SignupTwit;
const getTwitInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { twitterId } = req.params;
    try {
        // Construct the query parameters
        const hashtag1 = '"@bitsportgaming"';
        // const hashtag2 = '"$BITP"';
        const query = `${hashtag1} from:${twitterId}`;
        let allLikes = 0;
        let allTweets = 0;
        let allReplys = 0;
        let allQuotes = 0;
        console.log("twitter query", query);
        // Make a GET request to Twitter API's search endpoint
        const response = yield axios_1.default.get("https://api.twitter.com/2/tweets/search/recent", {
            headers: {
                Authorization: `Bearer ${process.env.TWITTER_TOKEN}`,
            },
            params: {
                query: query,
            },
        });
        console.log("response.data", response.data);
        if (response &&
            response.data &&
            response.data.data &&
            response.data.data.length != 0) {
            for (let i = 0; i < response.data.data.length; i++) {
                console.log("post number ===> ", i, " post id ", response.data.data[i].id);
                if (response.data.data[i].text.indexOf("RT @bitsportgaming") > -1) {
                    if (i === response.data.data.length - 1) {
                        console.log("result ========> ");
                        setTimeout(() => __awaiter(void 0, void 0, void 0, function* () {
                            res.json([
                                { farm: allLikes, booster: 0 },
                                { farm: allTweets, booster: 0 },
                                { farm: allReplys, booster: 0 },
                                { farm: allQuotes, booster: 0 },
                            ]);
                        }), 4000);
                        break;
                    }
                    else {
                        continue;
                    }
                }
                const options = {
                    method: "GET",
                    url: `https://twitter-api45.p.rapidapi.com/tweet.php`,
                    params: {
                        id: response.data.data[i].id,
                    },
                    headers: {
                        "X-RapidAPI-Key": "9eff990904msh4a7cd179bf2f5cep1e7f81jsn622cfe2e70a0",
                        "X-RapidAPI-Host": "twitter-api45.p.rapidapi.com",
                    },
                };
                try {
                    setTimeout(() => __awaiter(void 0, void 0, void 0, function* () {
                        const response2 = yield axios_1.default.request(options);
                        // console.log('response.data =====> ', response2.data)
                        const likes = response2.data.likes;
                        const retweets = response2.data.retweets;
                        const replies = response2.data.replies;
                        const quotes = response2.data.quotes;
                        allLikes += likes ? likes : 0;
                        console.log("tweet number =====> ", i, " likes ==========>", likes);
                        allTweets += retweets ? retweets : 0;
                        console.log("tweet number =====> ", i, " retweets ==========>", retweets);
                        allReplys += replies ? replies : 0;
                        console.log("tweet number =====> ", i, " replies ==========>", replies);
                        allQuotes += quotes ? quotes : 0;
                        console.log("tweet number =====> ", i, " quotes ==========>", quotes);
                        if (i === response.data.data.length - 1) {
                            console.log("result ===========> ", i);
                            setTimeout(() => __awaiter(void 0, void 0, void 0, function* () {
                                res.json([
                                    { farm: allLikes, booster: 0 },
                                    { farm: allTweets, booster: 0 },
                                    { farm: allReplys, booster: 0 },
                                    { farm: allQuotes, booster: 0 },
                                ]);
                            }), 4000);
                        }
                    }), 2000);
                }
                catch (error) {
                    console.error("error ===> too many request");
                }
            }
        }
        else {
            const updatedUser = yield User_1.default.findOneAndUpdate({ "twitter.twitterId": twitterId }, {
                tweetStatus: [
                    { farm: 0, booster: 0 },
                    { farm: 0, booster: 0 },
                    { farm: 0, booster: 0 },
                    { farm: 0, booster: 0 },
                ],
            });
            if (updatedUser) {
                res.json([
                    { farm: 0, booster: 0 },
                    { farm: 0, booster: 0 },
                    { farm: 0, booster: 0 },
                    { farm: 0, booster: 0 },
                ]);
            }
        }
        // Send the tweets back to the client
    }
    catch (error) {
        console.error("Error fetching tweets:", error);
        res.status(500).json({ error: "Error fetching tweets" });
    }
});
exports.getTwitInfo = getTwitInfo;
const getUserScore = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { userId } = req.params;
        const user = yield User_1.default.findById(userId);
        if (user) {
            if (user.tweetStatus.length == 0) {
                res.json([
                    { farm: 0, booster: 0 },
                    { farm: 0, booster: 0 },
                    { farm: 0, booster: 0 },
                    { farm: 0, booster: 0 },
                ]);
            }
            else {
                res.json(user.tweetStatus);
            }
        }
        else {
            res.json({ err: "User does not exist!" });
        }
    }
    catch (error) {
        console.log("get tweet user info ===> ", error);
        res.status(400).json({ err: "Unexpected error!" });
    }
});
exports.getUserScore = getUserScore;
const followUs = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { accessToken, accessSecret, userId } = req.body;
        console.log("accesstoken =>>> ", accessToken);
        console.log("accessSecret =>>> ", accessSecret);
        console.log("userId =>>> ", userId);
        // if (accessSecret && accessToken !== "") {
        //   const second_client = new Twitter({
        //     consumer_key: 'X3lCNWJYUW5rMTUyQWtWNElkQUY6MTpjaQ',
        //     consumer_secret: 'FYoPeqFZlDvzUGZnyAoH80JfUeqb6Bg7g1L6MS0-9KBXgJKkgi',
        //     access_token_key: accessToken,
        //     access_token_secret: accessSecret,
        //     version: "2.0"
        //   })
        //   const results = await second_client.post(`users/${userId}/following`, {
        //     "target_user_id": "1092146379353452551"
        //   });
        //   console.log("following result ===> ", results)
        // request.post({
        //   url: `https://api.twitter.com/2/users/${userId}/following`,
        //   oauth: {
        //     consumer_key: 'X3lCNWJYUW5rMTUyQWtWNElkQUY6MTpjaQ',
        //     consumer_secret: 'FYoPeqFZlDvzUGZnyAoH80JfUeqb6Bg7g1L6MS0-9KBXgJKkgi',
        //     access_token_key: accessToken,
        //     access_token_secret: accessSecret,
        //   },
        //   json: true,
        //   // form: { oauth_verifier: req.query.oauth_verifier },
        //   body: {
        //     "target_user_id": "1092146379353452551"
        //   }
        // }, function (err1, r1, body1) {
        //   if (err1) {
        //     console.log("There was an error through following");
        //     res.status(404).json({ msg: "There was an error through following" })
        //   } else {
        //     res.json("Success")
        //   }
        // })
        //   // const results = await client.post("friendships/create", {
        //   //   screen_name: twitter_name,
        //   // });
        //   const twitter = second_client.readWrite
        //   const rest = await twitter.v2.usersByUsernames('bitsportgaming');
        //   await twitter.v2.follow(userId, rest.data[0].id)
        //   console.log("finished")
        // const response = await client.post("friendships/create", {
        //   screen_name: 'bitsportgaming'
        // })
        // if (response) {
        //   res.json({success: true})
        // } else {
        //   res.json({success: false})
        // }
    }
    catch (error) {
        console.log("follow us error ===> ", error);
        res.status(400).json({ err: error });
    }
});
exports.followUs = followUs;
const saveScore = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { tweetStatus, score, userId } = req.body;
        const nowDate = new Date(Date.now());
        const updatedUser = yield User_1.default.findByIdAndUpdate(userId, {
            tweetStatus: tweetStatus,
            "twitter.twitterScore": score,
            refresh: nowDate,
        }, { new: true });
        if (updatedUser) {
            res.json({ success: true, token: (0, helpers_1.generateToken)(updatedUser) });
        }
        else {
            res.json({ success: false });
        }
    }
    catch (error) { }
});
exports.saveScore = saveScore;
const getBoostedTweet = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const boostTweets = yield FarmEarn_1.default.find({ tweetType: "Booster" });
        res.json(boostTweets);
    }
    catch (error) {
        console.log("getting boosted tweet error", error);
        res.status(500).json({ err: error });
    }
});
exports.getBoostedTweet = getBoostedTweet;
/**
 * User login function
 * @param req
 * @param res
 * @returns
 */
const SignIn = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.body.email || !req.body.password) {
        return res.json({ success: false, message: "No Input Data!" });
    }
    const user = yield User_1.default.findOne({ email: req.body.email });
    if (!user) {
        return res.json({ success: false, message: "User does not exists!" });
    }
    const isMatch = yield bcrypt_1.default.compare(req.body.password, user.password);
    if (isMatch) {
        yield (0, exports.refreshUserInfo)(user);
        console.log("sigin in user", user);
        return res.json({ success: true, token: (0, helpers_1.generateToken)(user) });
    }
    return res.json({
        success: false,
        message: "The email or password are incorrect!",
    });
});
exports.SignIn = SignIn;
/**
 * User forgotPassword function
 * @param req
 * @param res
 * @returns
 */
const forgotPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    if (!req.body.email) {
        return res.json({ success: false, message: "No Input Data!" });
    }
    const user = yield User_1.default.findOne({ email: req.body.email });
    if (!user) {
        return res.json({ success: false, message: "User does not exists!" });
    }
    let token = yield Token_1.default.findOne({ userId: user._id });
    if (token) {
        yield token.deleteOne();
    }
    let resetToken = crypto_1.default.randomBytes(32).toString("hex");
    const hash = yield bcrypt_1.default.hash(resetToken, 10);
    yield new Token_1.default({
        userId: user._id,
        token: hash,
        createdAt: Date.now(),
    }).save();
    const link = `${config_1.CLIENT_URI}/passwordReset?token=${resetToken}&id=${user._id}`;
    // sgMail.setApiKey(`${SENDGRID_API_KEY}`);
    // const sendEmail = async (email, subject, content) => {
    //   const msg = {
    //     to: email,
    //     from: '', // Replace with your verified sender email
    //     subject: subject,
    //     html: content,
    //   };
    //   try {
    //     await sgMail.send(msg);
    //     console.log('Email sent successfully');
    //   } catch (error) {
    //     console.error('Error sending email:', error);
    //   }
    // };
    const template = yield ejs_1.default.renderFile("utils/email/template.ejs", {
        link,
    });
    yield (0, exports.sendEmail)(user.email, "Password Reset Request", template);
    return res.json({
        success: true,
        message: "Email sent successfully!",
    });
});
exports.forgotPassword = forgotPassword;
const resetPassword = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    let passwordResetToken = yield Token_1.default.findOne({ userId: req.body.userId });
    if (!passwordResetToken) {
        return res.json({
            success: false,
            message: "Invalid or expired password reset token!",
        });
    }
    const isValid = yield bcrypt_1.default.compare(req.body.token, passwordResetToken.token);
    if (!isValid) {
        return res.json({
            success: false,
            message: "Invalid or expired password reset token!!",
        });
    }
    const hash = yield bcrypt_1.default.hash(req.body.password, 10);
    yield User_1.default.updateOne({ _id: req.body.userId }, { $set: { password: hash } }, { new: true });
    const user = yield User_1.default.findById({ _id: req.body.userId });
    yield passwordResetToken.deleteOne();
    res.json({ success: true, message: "Updated your password successfully!" });
});
exports.resetPassword = resetPassword;
const getReferalInfo = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield User_1.default.findById(req.body.userId);
    const referralFriends = yield User_1.default.find({
        referralId: user === null || user === void 0 ? void 0 : user.twitter.twitterScreenName,
    });
    const data = referralFriends.map((item) => {
        return { username: item.username, earnMoney: item.earnMoney };
    });
    return res.json({
        success: true,
        data: data,
    });
});
exports.getReferalInfo = getReferalInfo;
const getEarnedMoney = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield User_1.default.findById(req.body.userId);
    return res.json({
        success: true,
        latestEarnedAmount: user === null || user === void 0 ? void 0 : user.latestEarnAmount,
        latestEarnedUnit: user === null || user === void 0 ? void 0 : user.latestEarnUnit,
        totalEarnedMoney: user === null || user === void 0 ? void 0 : user.earnMoney,
        totalStreak: user === null || user === void 0 ? void 0 : user.latestPlayedTotalStreak,
        curStreak: user === null || user === void 0 ? void 0 : user.latestPlayedCurStreak,
    });
});
exports.getEarnedMoney = getEarnedMoney;
const getAllUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    User_1.default.find().then((models) => {
        res.json({ models });
    });
});
exports.getAllUser = getAllUser;
const removeUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    User_1.default.findByIdAndDelete(req.body.userId).then((model) => {
        res.json({ success: true, model });
    });
});
exports.removeUser = removeUser;
const refreshUserInfo = (user) => __awaiter(void 0, void 0, void 0, function* () {
    if (user.buy_BitpAddr.address == undefined) {
        user.buy_BitpAddr = (0, ethers_1.getEtherPrivateKeyAndWalletAddress)();
        yield user.save();
    }
});
exports.refreshUserInfo = refreshUserInfo;
// export const edit = async (req: Request, res: Response) => {
//   User.findOne({
//     _id: req.body.userId,
//   }).then(async (model: any) => {
//     if (!model) res.json({ success: false, message: "The Task not exits!" });
//     model.title = req.body.title;
//     model.description = req.body.description;
//     model.reward = req.body.reward;
//     model.unit = req.body.unit;
//     model.status = req.body.status;
//     model.shared = req.body.shared;
//     model.save().then(() => {
//       res.json({ success: true, model });
//     });
//   });
// };
