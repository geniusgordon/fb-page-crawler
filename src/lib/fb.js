import FB from 'fb';
import url from 'url';

FB.options({ version: 'v2.8' });

FB.apiP = (...args) =>
  new Promise((resolve, reject) => {
    FB.api(...args, res => {
      if(!res || res.error) {
        reject(!res ? new Error(args.toString()) : res.error);
        return;
      }
      const paging = res.paging ? url.parse(res.paging.next, true).query : null;
      resolve(Object.assign(res, { paging });
    });
  });

export default FB;

