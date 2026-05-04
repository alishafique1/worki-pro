import type { AuthUser } from "wasp/auth";
import { Card, CardContent, CardHeader, CardTitle } from "../../../client/components/ui/card";
import DefaultLayout from "../../layout/DefaultLayout";
import Breadcrumb from "../../layout/Breadcrumb";

function AdminMessages({ user }: { user: AuthUser }) {
  return (
    <DefaultLayout user={user}>
      <div className="max-w-270 mx-auto">
        <Breadcrumb pageName="Messages" />
        <Card>
          <CardHeader>
            <CardTitle>Admin Messages</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              Message center access is limited during launch stabilization.
              Use provider and consumer profiles for direct outreach.
            </p>
          </CardContent>
        </Card>
      </div>
    </DefaultLayout>
  );
}

export default AdminMessages;
