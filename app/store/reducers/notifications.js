import produce from "immer";
import shortid from "shortid";

export const NOTIFICATION_ADD = "notification/NOTIFICATION_ADD";
export const NOTIFICATION_REMOVE = "notification/NOTIFICATION_REMOVE";
export const NOTIFICATION_LEAVE = "notification/NOTIFICATION_LEAVE";

const initialState = {
  items: [],
  leaving: []
};

const types = {
  ALERT: "notification/ALERT",
  DEFAULT: "notification/DEFAULT",
  WARNING: "notification/WARNING",
  SUCCESS: "notification/SUCCESS"
};

const cancelMap = new WeakMap();

const selectNotifications = state => state.notifications.items;
const selectNotificationsLeaving = state => state.notifications.leaving;

const doAddNotification = notification => dispatch =>
  dispatch({
    type: NOTIFICATION_ADD,
    payload: notification
  });

const doRemoveNotification = item => dispatch =>
  dispatch({
    type: NOTIFICATION_REMOVE,
    payload: item
  });

const doCancelNotification = (cancelMap, item, secondPass = false) => {
  console.log("doCancelNotification");
  if (cancelMap.has(item)) {
    console.log("doCancelNotification has item");
    const fn = cancelMap.get(item);
    fn();
    if (secondPass) fn();
  }
};
const doLeaveNotification = item => dispatch => {
  dispatch({
    type: NOTIFICATION_LEAVE,
    payload: item
  });
};

const doNotify = (notif, type = types.DEFAULT) => dispatch =>
  dispatch({
    type: NOTIFICATION_ADD,
    payload: {
      ...notif,
      type
    }
  });

const doNotifyAlert = (notif, type = types.ALERT) => dispatch =>
  dispatch({
    type: NOTIFICATION_ADD,
    payload: {
      ...notif,
      type
    }
  });
const doNotifyWarning = (notif, type = types.WARNING) => dispatch =>
  dispatch({
    type: NOTIFICATION_ADD,
    payload: {
      ...notif,
      type
    }
  });

const doNotifySuccess = (notif, type = types.SUCCESS) => dispatch =>
  dispatch({
    type: NOTIFICATION_ADD,
    payload: {
      ...notif,
      type
    }
  });

export default function reducer(state = initialState, { type, payload }) {
  return produce(state, draft => {
    switch (type) {
      case NOTIFICATION_ADD:
        draft.items.push({ key: shortid.generate(), ...payload });
        break;
      case NOTIFICATION_REMOVE:
        draft.items.splice(
          draft.items.findIndex(i => i.key === payload.key),
          1
        );
        break;
      case NOTIFICATION_LEAVE:
        draft.leaving.splice(
          draft.leaving.findIndex(i => i.key === payload.key),
          1
        );
        break;
    }
  });
}

export {
  selectNotifications,
  selectNotificationsLeaving,
  doAddNotification,
  doRemoveNotification,
  doCancelNotification,
  doLeaveNotification,
  doNotify,
  doNotifyAlert,
  doNotifyWarning,
  doNotifySuccess
};
