import {container} from "tsyringe";
import {UserRepositoryImpl} from "./repository/userRepositoryImpl.ts";
import {UserDomainServiceImpl} from "./domain_service/userDomainServiceImpl.ts";
import {UserServiceImpl} from "./service/userServiceImpl.ts";
import {DI} from "./di.ts";
import {AuthRepositoryImpl} from "./repository/authRepositoryImpl.ts";
import {ViewHistoryRepositoryImpl} from "./repository/viewHistoryRepositoryImpl.ts";
import {ViewHistoryServiceImpl} from "./service/viewHistoryServiceImpl.ts";
import {DocumentRepositoryImpl} from "./repository/documentRepositoryImpl.ts";
import {DocumentServiceImpl} from "./service/documentServiceImpl.ts";

export const setupDIRepository = () => {
    container.register(DI.UserRepository, {useClass: UserRepositoryImpl});

    container.register(DI.AuthRepository, {useClass: AuthRepositoryImpl});

    container.register(DI.ViewHistoryRepository, {useClass: ViewHistoryRepositoryImpl});

    container.register(DI.DocumentRepository, {useClass: DocumentRepositoryImpl});
}

export const setupDIService = () => {
    container.register(DI.UserDomainService, {useClass: UserDomainServiceImpl});

    container.register(DI.UserService, {useClass: UserServiceImpl})

    container.register(DI.ViewHistoryService, {useClass: ViewHistoryServiceImpl});

    container.register(DI.DocumentService, {useClass: DocumentServiceImpl});
}

export const setupDI = () => {
    setupDIRepository();
    setupDIService();
}
