import dotenv from 'dotenv';
import FB from 'fb';
import url from 'url';

dotenv.config({ silent: true });
const pageId = process.env.FB_PAGE_ID;
const accessToken = process.env.FB_ACCESS_TOKEN;

const fields = `
  message,
  created_time,
  reactions,
  comments {
    like_count,
    message,
    from,
    created_time,
    comments {
      like_count,
      message,
      from,
      created_time
    }
  }
`;

FB.options({ version: 'v2.8' });
FB.setAccessToken(accessToken);

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

export async function fetchPosts(options) {
  const res = await FB.apiP(`${pageId}/feed`, Object.assign({ fields }, options));
  const paging = res.paging ? url.parse(res.paging.next, true).query : null;
  return Object.assign(res, { paging });
}

