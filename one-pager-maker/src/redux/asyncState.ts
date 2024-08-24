export type AsyncState<T> = {
  status: "pending" | "success" | "error";
  data: T;
  error?: Error;
};
