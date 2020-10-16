import { AxiosError } from 'axios';

export function axiosAdapter(response: AxiosError) {
	response.code
}
