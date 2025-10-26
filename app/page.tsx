import { LotteryDrawer } from "@/components/lottery-drawer"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 dark:from-gray-950 dark:via-purple-950 dark:to-gray-900 py-12 px-4">
      <div className="container mx-auto">
        <LotteryDrawer />
      </div>
    </div>
  )
}
