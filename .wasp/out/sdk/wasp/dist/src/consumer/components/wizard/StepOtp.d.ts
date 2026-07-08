import type { WizardState } from '../../GuestRequestWizardPage';
type Props = {
    state: WizardState;
    onBack: () => void;
    onVerified: () => void;
    /** External error from the parent (e.g. submitServiceRequest failure). */
    externalError: string | null;
    /** Email collected earlier in the wizard (used for email-based OTP). */
    email: string;
};
/**
 * Step 4 of the wizard. Sends a 6-digit code via /api/auth/request-otp,
 * verifies it via /api/auth/verify-otp using EMAIL, then hands control back
 * to the parent to call submitServiceRequest.
 */
export default function StepOtp({ state, onBack, onVerified, externalError, email }: Props): import("react").JSX.Element;
export {};
//# sourceMappingURL=StepOtp.d.ts.map