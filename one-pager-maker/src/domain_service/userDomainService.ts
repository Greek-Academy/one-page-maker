export interface UserDomainService {
    exists(id: string): Promise<boolean>;
}
