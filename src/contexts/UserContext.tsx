import React, { createContext, useEffect, useReducer } from 'react';

// action - state management
import { LOGIN, LOGOUT } from 'store/actions';
import accountReducer from 'store/accountReducer';

// project imports
import Loader from 'ui-component/Loader';
// import config from 'config';
import { initialLoginContextProps } from 'types';
import { UserContextType } from 'types/user';

// const
const initialState: initialLoginContextProps = {
    isLoggedIn: false,
    isInitialized: false,
    user: null
};

// ==============================|| FIREBASE CONTEXT & PROVIDER ||============================== //

const UserContext = createContext<UserContextType | null>(null);

export const UserProvider = ({ children }: { children: React.ReactElement }) => {
    const [state, dispatch] = useReducer(accountReducer, initialState);

    useEffect(
        () => {
            const userSessionStorage = sessionStorage.getItem('user');
            if (userSessionStorage) {
                const userJson = JSON.parse(userSessionStorage);
                dispatch({
                    type: LOGIN,
                    payload: {
                        isLoggedIn: true,
                        user: {
                            id: userJson.id,
                            email: userJson.email,
                            name: userJson.name || 'Betty'
                        }
                    }
                });
            } else {
                dispatch({
                    type: LOGOUT
                });
            }
        },
        // eslint-disable-next-line react-hooks/exhaustive-deps
        [dispatch]
    );

    const logout = () => {
        console.log('로그아웃');
        sessionStorage.removeItem('user');
        dispatch({
            type: LOGOUT
        });
    };

    if (state.isInitialized !== undefined && !state.isInitialized) {
        return <Loader />;
    }

    return (
        <UserContext.Provider
            value={{
                ...state,
                login: () => {},
                logout,
                resetPassword: (email: string) => {},
                dispatch
            }}
        >
            {children}
        </UserContext.Provider>
    );
};

export default UserContext;
