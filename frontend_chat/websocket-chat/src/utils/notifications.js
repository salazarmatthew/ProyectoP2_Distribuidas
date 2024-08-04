// utils/notifications.js

export const requestNotificationPermission = () => {
    if ("Notification" in window) {
      Notification.requestPermission().then(permission => {
        if (permission === "granted") {
          console.log("Notification permission granted.");
        } else {
          console.log("Notification permission denied.");
        }
      });
    } else {
      console.log("This browser does not support notifications.");
    }
  };
  
  export const showNotification = (title, options) => {
    if (Notification.permission === "granted") {
      new Notification(title, options);
    }
  };
  