'use client';

import Image from 'next/image';
import { Sparkles } from 'lucide-react';

export function AppBar() {
   return (
      <header className='sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md dark:bg-gray-950/80'>
         <div className='container mx-auto px-4'>
            <div className='flex h-16 items-center justify-between'>
               {/* Logo and Title */}
               <div className='flex items-center space-x-3 rtl:space-x-reverse'>
                  <div className='relative h-10 w-10'>
                     <Image src='/logoINSS.png' alt='Logo' fill className='object-contain' priority />
                  </div>
                  <div className='flex flex-col'>
                     <h1 className='text-xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent'>
                        نظام القرعة الذكي
                     </h1>
                     <p className='text-xs text-muted-foreground'>قسم البرمجة التطبيقات .</p>
                  </div>
               </div>

               {/* Right side - Icon */}
               <div className='flex items-center'>
                  <div className='p-2 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-lg shadow-md'>
                     <Sparkles className='h-6 w-6 text-white' />
                  </div>
               </div>
            </div>
         </div>
      </header>
   );
}
