type StepCredentialsProps = {
    selectedCategoryIds: string[];
    licenceNumber: string;
    insuranceInfo: string;
    wsibClearanceNumber: string;
    onChange: (field: 'licenceNumber' | 'insuranceInfo' | 'wsibClearanceNumber', value: string) => void;
};
export default function StepCredentials({ selectedCategoryIds, licenceNumber, insuranceInfo, wsibClearanceNumber, onChange, }: StepCredentialsProps): import("react").JSX.Element;
export {};
//# sourceMappingURL=StepCredentials.d.ts.map