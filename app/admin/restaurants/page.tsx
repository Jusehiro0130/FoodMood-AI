import { AppShell } from "@/components/app-shell";
import { getRestaurantsForApp } from "@/lib/data/restaurants-service";
import { AdminRestaurantsClient } from "@/app/admin/restaurants/restaurants-admin-client";

export default async function AdminRestaurantsPage() {
  const data = await getRestaurantsForApp();

  return (
    <AppShell>
      <AdminRestaurantsClient restaurants={data.restaurants} source={data.source} />
    </AppShell>
  );
}

