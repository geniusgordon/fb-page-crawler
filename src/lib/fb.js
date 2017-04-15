const FB = require('fb');
const url = require('url');

FB.options({ version: 'v2.8' });

FB.apiP = (...args) =>
  new Promise((resolve, reject) => {
    FB.api(...args, res => {
      if (!res || res.error) {
        reject(!res ? new Error(args.toString()) : res.error);
        return;
      }
      let paging = null;
      if (res.paging && res.paging.next) {
        paging = url.parse(res.paging.next, true).query;
      }
      resolve(Object.assign(res, { paging }));
    });
  });

module.exports = FB;
