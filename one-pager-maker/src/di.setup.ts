import {container} from "tsyringe";
import {UserRepositoryImpl} from "./repository/userRepositoryImpl.ts";
import {UserDomainServiceImpl} from "./domain_service/userDomainServiceImpl.ts";
import {UserServiceImpl} from "./service/userServiceImpl.ts";
import {DI} from "./di.ts";
import {AuthRepositoryImpl} from "./repository/authRepositoryImpl.ts";
import {ViewHistoryRepositoryImpl} from "./repository/viewHistoryRepositoryImpl.ts";
import {ViewHistoryServiceImpl} from "./service/viewHistoryServiceImpl.ts";

export const setupDIRepository = () => {
    container.register(DI.UserRepository, {useClass: UserRepositoryImpl});

    container.register(DI.AuthRepository, {useClass: AuthRepositoryImpl});

    container.register(DI.ViewHistoryRepository, {useClass: ViewHistoryRepositoryImpl});
}

export const setupDIService = () => {
    container.register(DI.UserDomainService, {useClass: UserDomainServiceImpl});

    container.register(DI.UserService, {useClass: UserServiceImpl})

    container.register(DI.ViewHistoryService, {useClass: ViewHistoryServiceImpl});
}

export const setupDI = () => {
    console.log("test");
    setupDIRepository();
    setupDIService();
}
