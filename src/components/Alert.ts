import { MessageBuilder, toBold } from "../teleprinter";

export type AlertType = "info" | "success" | "warning" | "error";

const icons: Record<AlertType, string> = {
  info: "💬",
  success: "✅",
  warning: "⚠️",
  error: "❌",
};

type AlertOptions = {
  usernames?: string[];
  timestamp?: Date | string;
  group?: string;
};

export function Alert(
  type: AlertType,
  message: string,
  options: AlertOptions = {}
): MessageBuilder {
  const { usernames = [], timestamp, group } = options;

  const metaParts: string[] = [];

  if (group) metaParts.push(`[${group.toUpperCase()}]`);

  if (usernames.length > 0) {
    const formattedUsernames = usernames.map((name) =>
      name.startsWith("@") ? name : `@${name}`
    );
    metaParts.push(formattedUsernames.join(", "));
  }
  if (timestamp) {
    metaParts.push(new Date(timestamp).toISOString());
  }

  const meta = metaParts.length > 0 ? ` (${metaParts.join(" • ")})` : "";

  return MessageBuilder()
    .row(`${icons[type]} ${toBold(type.toUpperCase())}${meta}`)
    .row(message);
}
