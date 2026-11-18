import { useEffect } from 'react';

const APP_NAME = 'VigilantGear';

export function useDocumentTitle(title) {
    useEffect(() => {
        document.title = title ? `${title} | ${APP_NAME}` : `${APP_NAME} – AI-Powered PPE Compliance Monitoring`;
    }, [title]);
}