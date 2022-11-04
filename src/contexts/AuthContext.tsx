import { createContext, ReactNode, useEffect, useState } from "react";
import * as Google from 'expo-auth-session/providers/google';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';

WebBrowser.maybeCompleteAuthSession()

interface UserProps {
	name: string;
	avatarUrl: string;
}

export interface AuthContextDataProps {
	user: UserProps;
	isUserLoading: boolean;
	signIn: () => Promise<void>
}

interface AuthProviderProps {
	children: ReactNode;
}

export const AuthContext = createContext({} as AuthContextDataProps);

export const AuthContextProvider = ({ children }: AuthProviderProps) => {
	const [ user, setUser ] = useState<UserProps>({} as UserProps);
	const [ isUserLoading, setIsUserLoading ] = useState(false);

	const [request, response, promptAsync] = Google.useAuthRequest({
		clientId: '562566444506-9hbnfs8lu64dojt9hure1jrj9aqpgao5.apps.googleusercontent.com',
		redirectUri: AuthSession.makeRedirectUri({ useProxy: true }),
		scopes: ['profile', 'email']
	});

	const signIn = async (): Promise<void> => {
		try {
			setIsUserLoading(true);
			await promptAsync();

		} catch (error) {
			console.log(error);
			throw error;
		} finally {
			setIsUserLoading(false);
		}
	};

	const signInWithGoogle = async (access_token: string) => {
		console.log('TOKEN DE AUTENTICAÇÃO ===> ', access_token)
	};

	useEffect(() => {
		if (response?.type === 'success' && response.authentication?.accessToken) {
			signInWithGoogle(response.authentication.accessToken);
		}
	}, [response]);

	return (
		<AuthContext.Provider value={{
			user,
			isUserLoading,
			signIn
		}}>
			{children}
		</AuthContext.Provider>
	)
};
