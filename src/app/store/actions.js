import { LOGIN, LOGOUT, SETPREFERENCE } from "app/store/types";

export function login(provider, id, name, email) {
  return {
    type: LOGIN,
    provider: provider,
    id: id,
    name: name,
    email: email 
  };
}

export function logout(){
	return {
		type: LOGOUT
	};
}

export function setPreference(key, value) {
	return {
		type: SETPREFERENCE,
		key: key,
		value: value
	}
}