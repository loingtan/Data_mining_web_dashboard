import { DashboardContent } from 'src/layouts/dashboard/content';

import { ModelHubView } from 'src/sections/model-hub/view/model-hub-view';

// ----------------------------------------------------------------------

export default function ModelHubPage() {
  return (
    <DashboardContent>
      <ModelHubView />
    </DashboardContent>
  );
}
