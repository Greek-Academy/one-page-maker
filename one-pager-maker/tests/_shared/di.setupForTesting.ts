import {setupDIService} from "../../src/di.setup";
import {container, Lifecycle} from "tsyringe";
import {MockUserRepository} from "./mock/mockUserRepository";
import {DI} from "../../src/di";
import {MockAuthRepository} from "./mock/mockAuthRepository";

const setupDIMockRepository = () => {
    container.register(DI.UserRepository, {useClass: MockUserRepository}, {lifecycle: Lifecycle.Singleton});
    container.register(DI.AuthRepository, {useClass: MockAuthRepository}, {lifecycle: Lifecycle.Singleton});
}

export const setupDIForTesting = () => {
    setupDIMockRepository();
    setupDIService();
}