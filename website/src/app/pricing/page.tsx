import { redirect } from "next/navigation";

export default function PricingPage() {
  // The user requested to point all pricing navigations to the join page.
  // We'll redirect the legacy pricing route to the join route.
  redirect("/join");
}
