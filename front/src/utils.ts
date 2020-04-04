import {AxiosResponse} from 'axios';

export function handleError(response: AxiosResponse) {
  if (response.status === 404) {
    alert('페이지를 찾을 수 없습니다.');
  }
  return;
}
