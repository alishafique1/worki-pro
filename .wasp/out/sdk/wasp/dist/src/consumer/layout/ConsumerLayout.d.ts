import { ReactNode } from 'react';
import type { AuthUser } from 'wasp/auth';
interface Props {
    children: ReactNode;
    user?: AuthUser | null;
}
export default function ConsumerLayout({ children, user }: Props): import("react").JSX.Element;
export {};
//# sourceMappingURL=ConsumerLayout.d.ts.map