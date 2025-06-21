import { getUserAuth } from "@/actions/auth";
import UserDataDashboard from "@/components/user-data/UserDataDashboard";


export const dynamic = "force-dynamic";
export default async function DashboardPage() {
  const user = await getUserAuth()
  if (!user) {
    return null
  }
  return (
    <>
      <UserDataDashboard user={user} />
    </>
  )
}