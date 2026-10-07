import fs from "node:fs";

const f = "src/features/loans/views/loans-view.tsx";
let text = fs.readFileSync(f, "utf8");

// banner -> component
const bannerStart = text.indexOf("      {/* بنر خلاصه مالی");
const bannerEndMarker = "\n\n      {/* فیلترها */}";
const bannerEnd = text.indexOf(bannerEndMarker, bannerStart);
if (bannerStart === -1 || bannerEnd === -1) throw new Error("banner block not found");
const bannerComponent = `      <LoanSummaryBanner
        totalRemaining={model.totalRemaining}
        totalPaid={model.totalPaid}
        monthlyOutflow={model.monthlyOutflow}
        donePercent={model.donePercent}
        activeLoanCount={model.loans.length}
      />`;
text = text.slice(0, bannerStart) + bannerComponent + text.slice(bannerEnd);

// schedule dialog -> component
const dlgStart = text.indexOf("      <BaseDialog");
const dlgEndMarker = "      </BaseDialog>\n";
const dlgEnd = text.indexOf(dlgEndMarker, dlgStart);
if (dlgStart === -1 || dlgEnd === -1) throw new Error("dialog block not found");
const dlgComponent = `      <LoanScheduleDialog loan={model.scheduleModalLoan} onClose={model.closeSchedule} />\n`;
text = text.slice(0, dlgStart) + dlgComponent + text.slice(dlgEnd + dlgEndMarker.length);

// imports
text = text.replace('import { BaseDialog } from "@/components/ui/dialog";\n', "");
text = text.replace(
  'import { LOAN_FILTERS, useLoansView } from "@/features/loans/hooks/use-loans-view";',
  'import { LOAN_FILTERS, useLoansView } from "@/features/loans/hooks/use-loans-view";\nimport { LoanScheduleDialog } from "@/features/loans/components/loan-schedule-dialog";\nimport { LoanSummaryBanner } from "@/features/loans/components/loan-summary-banner";',
);

fs.writeFileSync(f, text);
console.log("done");
