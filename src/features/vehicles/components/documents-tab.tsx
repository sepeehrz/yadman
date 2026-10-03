"use client";

import { InsuranceSection } from "./insurance-section";
import { TollSection } from "./toll-section";

interface IProps {
  vehicleId: string;
}

export function DocumentsTab({ vehicleId }: IProps) {
  return (
    <div className="space-y-5">
      <InsuranceSection vehicleId={vehicleId} />
      <TollSection vehicleId={vehicleId} />
    </div>
  );
}
