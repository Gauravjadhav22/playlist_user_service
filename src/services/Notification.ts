import Notification, { INotification } from "../models/Notification";

const readNotification = async (notification_id: string,user_id:string) => {
    try {
      const result = await Notification.updateOne(
        { _id: notification_id },
        {
          $addToSet: {
            readBy: user_id 
          }
        }
      );
      return result;
    } catch (error) {
      throw new Error("Failed to update notification");
    }
  };
  

const getAllNotifications = async (limit: number, page: number) => {
  try {
    const notifications = await Notification.find()
      .skip(page * limit)
      .limit(limit);
    return notifications;
  } catch (error) {
    throw new Error("Failed to fetch notifications");
  }
};

const createNotification = async (payload: INotification) => {
  try {
    const result = await Notification.create(payload);
    return result;
  } catch (error) {
    throw new Error("Failed to create notification");
  }
};


const notificationService= { readNotification, createNotification, getAllNotifications };

export default notificationService
