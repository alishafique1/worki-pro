import type { WizardState } from '../../GuestRequestWizardPage';
type Props = {
    state: WizardState;
    onBack: () => void;
    onVerified: () => void;
    /** External error from the parent (e.g. submitServiceRequest failure). */
    externalError: string | null;
};
/**
 * Step 4 of the wizard. Only reached when the user supplied a phone number.
 * Sends a 6-digit code via the /api/auth/request-otp endpoint, verifies it
 * via /api/auth/verify-otp, then hands control back to the parent to call
 * the submitServiceRequest action.
 */
export default function StepOtp({ state, onBack, onVerified, externalError }: Props): import("react").JSX.Element;
export {};
//# sourceMappingURL=StepOtp.d.ts.map