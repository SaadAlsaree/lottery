import { LotteryDrawer } from '@/components/lottery-drawer';
import { AppBar } from '@/components/app-bar';

export default function Home() {
   return (
      <div className='min-h-screen bg-gradient-to-br from-blue-50 via-cyan-50 to-sky-50 dark:from-gray-950 dark:via-blue-950 dark:to-gray-900'>
         <AppBar />
         <div className='py-12 px-4'>
            <div className='container mx-auto'>
               <LotteryDrawer />
            </div>
         </div>
      </div>
   );
}
