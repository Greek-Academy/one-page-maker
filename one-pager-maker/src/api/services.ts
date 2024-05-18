import {container} from "tsyringe";
import {UserService} from "../service/userService.ts";
import {DI} from "../di.ts";
import {UserDomainService} from "../domain_service/userDomainService.ts";
import {setupDI} from "../di.setup.ts";

setupDI();

export const userService = container.resolve<UserService>(DI.UserService);
export const userDomainService = container.resolve<UserDomainService>(DI.UserDomainService);
