import { container } from "tsyringe";
import { UserService } from "../service/userService.ts";
import { DI } from "../di.ts";
import { UserDomainService } from "../domain_service/userDomainService.ts";
import { setupDI } from "../di.setup.ts";
import { ViewHistoryService } from "../service/viewHistoryService.ts";
import { DocumentService } from "../service/documentService.ts";

setupDI();

export const userService = container.resolve<UserService>(DI.UserService);
export const userDomainService = container.resolve<UserDomainService>(
  DI.UserDomainService
);
export const viewHistoryService = container.resolve<ViewHistoryService>(
  DI.ViewHistoryService
);
export const documentService = container.resolve<DocumentService>(
  DI.DocumentService
);
