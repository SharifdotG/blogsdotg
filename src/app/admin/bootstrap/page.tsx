import { notFound } from "next/navigation";
import { AdminBootstrapForm } from "./bootstrap-form";

type AdminBootstrapPageProps = {
    searchParams: Promise<{ token?: string }>;
};

export default async function AdminBootstrapPage({
    searchParams,
}: AdminBootstrapPageProps) {
    const isAdminBootstrapEnabled =
        process.env.ADMIN_BOOTSTRAP_ENABLED?.trim().toLowerCase() === "true";
    if (!isAdminBootstrapEnabled) {
        notFound();
    }

    const params = await searchParams;
    const configuredBootstrapSecret =
        process.env.ADMIN_BOOTSTRAP_SECRET?.trim();
    const providedToken = params.token?.trim();

    if (
        !configuredBootstrapSecret ||
        !providedToken ||
        providedToken !== configuredBootstrapSecret
    ) {
        notFound();
    }

    return <AdminBootstrapForm bootstrapSecret={configuredBootstrapSecret} />;
}
