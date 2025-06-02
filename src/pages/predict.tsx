import { DashboardContent } from 'src/layouts/dashboard/content';

import { PredictNewView } from 'src/sections/predict/view/predict-new-view';

// Only render PredictNewView directly, no tab or navigation logic
export default function PredictPage() {
  return (
    <DashboardContent>
      <PredictNewView />
    </DashboardContent>
  );
}
