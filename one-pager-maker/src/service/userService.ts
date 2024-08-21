import { User } from "../entity/user/userType.ts";
import { Result } from "result-type-ts";

export interface UserService {
  /**
   * ユーザーを作成する.
   * @param args
   * @throws UserServiceError invalid-url, duplicated-id, invalid-id, empty-id, permission-denied, unknown,
   */
  createUser(args: {
    id: string;
    uid: string;
    photoUrl: string;
  }): Promise<Result<User, UserServiceError>>;

  /**
   * クエリに一致するユーザーを検索する.
   * @param query id は前方一致で検索する.
   */
  searchUsers(query: { id: string }): Promise<Result<User[], UserServiceError>>;

  /**
   * ユーザーを取得する
   * @param id
   */
  findUserByID(id: string): Promise<Result<User, UserServiceError>>;

  /**
   * ユーザーを UID で取得する. ログインしているユーザーのものしか取得できない
   * @param uid
   */
  findUserByUID(uid: string): Promise<Result<User, UserServiceError>>;
}

export class UserServiceError extends Error {
  constructor(
    message: string,
    public readonly code: UserServiceErrorCode
  ) {
    super(message);
    this.name = "UserServiceError";
  }
}

type UserServiceErrorCode =
  | "invalid-url"
  | "duplicated-id"
  | "invalid-id"
  | "too-long-id"
  | "empty-id"
  | "user-not-found"
  | "permission-denied"
  | "unknown";
