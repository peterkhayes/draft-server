// @flow

const defaultOptions = {
  mode: "cors",
  cache: "no-cache",
  credentials: "same-origin",
  headers: {
    "Content-Type": "application/json; charset=utf-8",
  },
}

export type ReqWithoutPlayer = {
  method: 'GET' | 'POST',
  url: string,
  body?: Object,
}

export type ReqWithPlayer = ReqWithoutPlayer & {
  player: string,
}

// $FlowFixMe
export default function fetch({url, body, method, player}: ReqWithPlayer): Promise<any> {
  const mergedOptions = {
    ...defaultOptions,
    method,
    headers: {
      ...defaultOptions.headers,
      player,
    }
  }

  if (method !== 'GET') {
    mergedOptions.body = JSON.stringify(body);
  }

  return window.fetch(url, mergedOptions).then((res) => res.json());
}
