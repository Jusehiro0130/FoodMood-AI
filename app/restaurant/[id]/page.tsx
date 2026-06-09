import { RestaurantDetailClient } from "@/app/restaurant/[id]/restaurant-detail-client";

type RestaurantPageProps = {
  params: Promise<{ id: string }>;
};

export default async function RestaurantPage({ params }: RestaurantPageProps) {
  const { id } = await params;
  return <RestaurantDetailClient id={id} />;
}
