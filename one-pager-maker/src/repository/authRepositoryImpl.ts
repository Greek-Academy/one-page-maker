import { AuthRepository } from "./authRepository.ts";
import { auth } from "../firebase.ts";
import { User } from "@firebase/auth";
import { injectable } from "tsyringe";

@injectable()
export class AuthRepositoryImpl implements AuthRepository {
  currentUser(): User | null {
    return auth.currentUser;
  }
}
