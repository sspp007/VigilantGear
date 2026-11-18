import { Button } from '@/components/common/Button';
import { Modal } from '@/components/common/Modal';

const LEGAL_DOCUMENTS = {
    terms: {
        title: 'Terms of Service',
        paragraphs: [
            'This is a demonstration build of VigilantGear. No real agreement is formed by creating a demo account.',
            'Final terms of service will be published before any production release.',
        ],
    },
    privacy: {
        title: 'Privacy Policy',
        paragraphs: [
            'In this demonstration build, all data stays in your browser and is never sent to a server.',
            'A full privacy policy will be published before any production release.',
        ],
    },
};

export function LegalModal({ documentId, onClose }) {
    const legalDocument = LEGAL_DOCUMENTS[documentId];

    return (
        <Modal
            isOpen={Boolean(legalDocument)}
            onClose={onClose}
            title={legalDocument?.title ?? ''}
            footer={<Button onClick={onClose}>Close</Button>}
        >
            <div className="space-y-3 text-sm text-ink-muted">
                {legalDocument?.paragraphs.map((paragraph) => (
                    <p key={paragraph}>{paragraph}</p>
                ))}
            </div>
        </Modal>
    );
}