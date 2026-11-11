import { useEffect } from 'react';
import { APP_NAME } from './constants';

/** Sets the browser tab title to "<title> | AdminPro" while the calling page is mounted. */
export default function useDocumentTitle(title) {
  useEffect(() => {
    document.title = title ? `${title} | ${APP_NAME}` : APP_NAME;
  }, [title]);
}
