import { redirect } from "next/navigation";
import { ROUTES } from "@/constants/routes";

export default function ShopsLandingPage() {
    redirect(ROUTES.CUSTOMER_SHOPS);
}
