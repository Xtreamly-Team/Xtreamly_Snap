import {
  copyable,
  divider,
  heading,
  panel,
  spinner,
  text,
} from "@metamask/snaps-ui";

// When ui functions are called without await, they are shown but are not
// awaited to get results back to go to next step. Use it for things like
// waitingDialog.

export const userDataPromptDialog = async (title, body, placeholder) => {
  const res = await snap.request({
    method: "snap_dialog",
    params: {
      type: "prompt",
      placeholder: placeholder,
      content: panel([heading(title), text(body), divider()]),
    },
  });

  return res;
};

export const announcementDialog = async (title, body) => {
  const res = await snap.request({
    method: "snap_dialog",
    params: {
      type: "alert",
      content: panel([heading(title), divider(), text(body)]),
    },
  });

  return res;
};

export const waitingDialog = async (title, body) => {
  const res = await snap.request({
    method: "snap_dialog",
    params: {
      type: "alert",
      content: panel([heading(title), divider(), text(body), spinner()]),
    },
  });

  return res;
};

export const copyableResultDialog = async (title, body, result) => {
  const d_dialog = await snap.request({
    method: "snap_dialog",
    params: {
      type: "alert",
      content: panel([heading(title), divider(), text(body), copyable(result)]),
    },
  });
};

export const copyableDoubleResultDialog = async (
  title,
  body,
  result1Label,
  result1,
  result2Label,
  result2
) => {
  const d_dialog = await snap.request({
    method: "snap_dialog",
    params: {
      type: "alert",
      content: panel([
        heading(title),
        divider(),
        text(body),
        text(result1Label),
        copyable(result1),
        text(result2Label),
        copyable(result2),
      ]),
    },
  });
};
