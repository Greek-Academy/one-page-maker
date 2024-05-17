export interface UserDomainService {
    isDuplicatedId(id: string): Promise<boolean>;
}