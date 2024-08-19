export interface InitialUserState {
  displayName: string;
  user: null | {
    uid: string;
    email: string;
    displayName: string;
    photoUrl: null | string;
  };
}
