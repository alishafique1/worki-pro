type CategoryCardGridProps = {
    title: string;
    subtitle: string;
    selectedIds: string[];
    onToggle: (id: string) => void;
    max?: number;
};
export default function CategoryCardGrid({ title, subtitle, selectedIds, onToggle, max }: CategoryCardGridProps): import("react").JSX.Element;
export {};
