type Role = 'CONSUMER' | 'PROVIDER';
type StepRoleProps = {
    selected: Role | null;
    onSelect: (role: Role) => void;
};
export default function StepRole({ selected, onSelect }: StepRoleProps): import("react").JSX.Element;
export {};
//# sourceMappingURL=StepRole.d.ts.map