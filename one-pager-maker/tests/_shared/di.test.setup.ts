import {setupDIService} from "../../src/di.setup";
import {container, Lifecycle} from "tsyringe";
import {MockUserRepository} from "./mock/mockUserRepository";
import {DI} from "../../src/di";

const setupDIMockRepository = () => {
    container.register(DI.UserRepository, {useClass: MockUserRepository}, {lifecycle: Lifecycle.Singleton});
}

export const setupDIForTesting = () => {
    setupDIMockRepository();
    setupDIService();
}