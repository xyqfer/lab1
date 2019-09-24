const ytdl = require('ytdl-core');
const request = require('request');

(async () => {
    const { formats } = await ytdl.getInfo('Sbwc4HQg42Y');
    const url = formats.filter((item) => {
        return item.container === "mp4";
    })[0].url;

    request(url, (err, response) => {
        if (err) {
            console.log('err');
            console.log(err);
        } else {
            console.log('resp');
            console.log(response.statusCode);
        }
    });
})();