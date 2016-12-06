require('dotenv').config();
import FB from 'fb';
import url from 'url';
const pageId = process.env.FB_PAGE_ID;
const accessToken = process.env.FB_ACCESS_TOKEN;

FB.setAccessToken(accessToken)

FB.apiP = (...args) =>
  new Promise((resolve, reject) => {
    FB.api(...args, res => {
      if(!res || res.error) {
        reject(!res ? new Error(args.toString()) : res.error);
        return;
      }
      resolve(res);
    });
  });

export function checkPageIdAndAccessToken() {
  return FB.apiP(`${pageId}`);
}

export async function getPageFeed(options) {
  const res = await FB.apiP(`${pageId}/feed`, Object.assign({}, options));
  const paging = res.paging ? url.parse(res.paging.next, true).query : null;
  return Object.assign(res, { paging });
}

