export type NotificationPriority = "low" | "medium" | "high" | "urgent";

export interface Notification {
  id: string;
  title: string;
  message: string;
  priority: NotificationPriority;
  read: boolean;
  createdAt: string;
  module?: string;
}
