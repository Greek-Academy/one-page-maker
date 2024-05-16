import {container} from "tsyringe";
import {UserRepositoryImpl} from "./repository/userRepositoryImpl.ts";
import {UserDomainServiceImpl} from "./domain_service/userDomainServiceImpl.ts";
import {UserServiceImpl} from "./service/userServiceImpl.ts";
import {DI} from "./di.ts";

export const setupDIRepository = () => {
    container.register(DI.UserRepository, {useClass: UserRepositoryImpl});
}

export const setupDIService = () => {
    container.register(DI.UserDomainService, {useClass: UserDomainServiceImpl});

    container.register(DI.UserService, {useClass: UserServiceImpl})
}

export const setupDI = () => {
    setupDIRepository();
    setupDIService();
}