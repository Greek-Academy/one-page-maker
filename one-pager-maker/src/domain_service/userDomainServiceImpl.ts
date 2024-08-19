import { UserDomainService } from "./userDomainService.ts";
import { UserRepository } from "../repository/userRepository.ts";
import { inject, injectable } from "tsyringe";
import { DI } from "../di.ts";

@injectable()
export class UserDomainServiceImpl implements UserDomainService {
  constructor(
    @inject(DI.UserRepository) private readonly userRepository: UserRepository
  ) {}

  async exists(id: string): Promise<boolean> {
    const user = await this.userRepository.findUnique(id);
    return user !== undefined;
  }
}
