import Notification, { INotification } from "../models/Notification";
import notificationService from "../services/Notification";
import { getUserIdFromHeaders } from "../utils/UserInfo";

const read = (req, res) => {
  const { notification_id } = req.params;
  const user_id = getUserIdFromHeaders(res);

  const result = notificationService.readNotification(notification_id, user_id);
  return result;
};

const create = (req, res) => {
  const result = notificationService.createNotification(req.body);
  return result;
};

const getAll = (req, res) => {
  const { limit, page } = req.query;

  const result = notificationService.getAllNotifications(limit, page);
  return result;
};

export { create, getAll, read };
