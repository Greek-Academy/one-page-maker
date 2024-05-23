import {useMutation, useQuery} from "@tanstack/react-query";
import {queryClient} from "../queryClient.ts";
import {userDomainService, userService} from "./services.ts";

const queryKeys = {
    userId: (id: string) => `user-id-${id}`,
    userUId: (uid: string) => `user-uid-${uid}`,
    users: 'users',
    searchUsers: 'searchUsers',
    findUserByID: 'findUserByID',
    findUserByUID: 'findUserByUID',
    isDuplicatedId: 'isDuplicatedId'
}

/**
 * ユーザー関連のエンドポイント
 *
 * @example
 * ```TypeScript
 * import {userEndpoint} from "./api/userEndpoint.ts";
 *
 * const ExampleComponent = () => {
 *   // Check if id is duplicated
 *   const [id, setID] = useState('');
 *   const result = userEndpoint.useIsDuplicatedIdQuery(id);
 *
 *   // Create user
 *   const mutation = userEndpoint.useCreateUserMutation();
 *   const handleCreateUser = (user: { id: string, uid: string, photoUrl: string }) => {
 *     mutation.mutate(user);
 *   }
 *
 *   return (
 *       // ..
 *   )
 * }
 * ```
 */
export const userApi = {
    useCreateUserMutation: () => useMutation({
        mutationFn: async (user: { id: string, uid: string, photoUrl: string }) => {
            const result = await userService.createUser(user);
            return result.value;
        },
        onSuccess: (user) => {
            if (user === undefined) return;
            queryClient.invalidateQueries({queryKey: [queryKeys.userId(user.id), queryKeys.users]})
        }
    }),
    useSearchUsersQuery: (id: string) => useQuery({
        queryKey: [queryKeys.searchUsers, queryKeys.userId(id)],
        queryFn: async () => {
            const result = await userService.searchUsers({id});
            return result.value;
        }
    }),
    useFindUserByIDQuery: (id: string) => useQuery({
        queryKey: [queryKeys.findUserByID, queryKeys.userId(id)],
        queryFn: async () => {
            const result = await userService.findUserByID(id);
            return result.value;
        }
    }),
    useFindUserByUIDQuery: (uid: string) => useQuery({
        queryKey: [queryKeys.findUserByUID, queryKeys.userUId(uid)],
        queryFn: async () => {
            const result = await userService.findUserByUID(uid);
            if (result && result.value !== undefined) {
                return result.value;
            }
            return null;
        }
    }),
    useIsDuplicatedIdQuery: (id: string) => useQuery({
        queryKey: [queryKeys.isDuplicatedId, queryKeys.userId(id)],
        queryFn: async () => {
            return await userDomainService.isDuplicatedId(id);
        }
    })
}
