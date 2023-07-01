// project imports
import { UserProfile } from '_mockApis/user-profile/types';
import { AccountReducerActionProps } from 'store/accountReducer';

export type UserContextType = {
    isLoggedIn: boolean;
    isInitialized?: boolean;
    user?: UserProfile | null | undefined;
    login: () => void;
    logout: () => void;
    resetPassword: (email: string) => void;
    dispatch: React.Dispatch<AccountReducerActionProps>;
}