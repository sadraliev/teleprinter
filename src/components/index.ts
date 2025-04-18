import { Alert } from "./Alert";
export type TComponentFactory = {
  Alert: typeof Alert;
};

export function ComponentFactory(): TComponentFactory {
  return {
    Alert: Alert,
  };
}
