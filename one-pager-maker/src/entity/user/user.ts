import { idSchema, photoUrlSchema, User } from "./userType.ts";
import { Result } from "result-type-ts";
import { ForCreate } from "../utils.ts";

export const createUser = (args: {
  id: string;
  uid: string;
  photoUrl: string;
}): Result<ForCreate<User>, CreateUserError> => {
  if (args.id === "") {
    return Result.failure(new CreateUserError("User ID is empty", "empty-id"));
  }

  if (args.id.length > 20) {
    return Result.failure(
      new CreateUserError("User ID is too long", "too-long-id")
    );
  }

  const parsedId = idSchema.safeParse(args.id);

  if (!parsedId.success) {
    return Result.failure(
      new CreateUserError("User ID must be alphanumeric", "invalid-id")
    );
  }

  const parsedPhotoUrl = photoUrlSchema.safeParse(args.photoUrl);

  if (args.photoUrl === "" || !parsedPhotoUrl.success) {
    return Result.failure(
      new CreateUserError("Photo URL is invalid", "invalid-url")
    );
  }

  return Result.success({
    id: args.id,
    uid: args.uid,
    photoUrl: args.photoUrl
  });
};

type CreateUserErrorCode =
  | "invalid-id"
  | "empty-id"
  | "too-long-id"
  | "invalid-url";

class CreateUserError extends Error {
  constructor(
    message: string,
    public readonly code: CreateUserErrorCode
  ) {
    super(message);
    this.name = "CreateUserError";
  }
}
