'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Download, Sparkles, Shuffle } from 'lucide-react';

export function LotteryDrawer() {
   const [totalNumbers, setTotalNumbers] = useState<string>('');
   const [numbersToDraw, setNumbersToDraw] = useState<string>('');
   const [drawnNumbers, setDrawnNumbers] = useState<number[]>([]);
   const [isDrawing, setIsDrawing] = useState(false);
   const [error, setError] = useState<string>('');

   const generateRandomNumbers = (max: number, count: number): number[] => {
      const numbers = new Set<number>();
      while (numbers.size < count) {
         numbers.add(Math.floor(Math.random() * max) + 1);
      }
      return Array.from(numbers).sort((a, b) => a - b);
   };

   const handleDraw = async () => {
      setError('');

      const total = parseInt(totalNumbers);
      const draw = parseInt(numbersToDraw);

      // Validation
      if (!total || !draw) {
         setError('الرجاء إدخال قيم صحيحة في كلا الحقلين');
         return;
      }

      if (total < 1 || draw < 1) {
         setError('يجب أن تكون الأرقام أكبر من صفر');
         return;
      }

      if (draw > total) {
         setError('عدد الأرقام المطلوب سحبها يجب أن يكون أقل من أو يساوي العدد الكلي');
         return;
      }

      setIsDrawing(true);
      setDrawnNumbers([]);

      // Simulate drawing animation
      await new Promise((resolve) => setTimeout(resolve, 500));

      const numbers = generateRandomNumbers(total, draw);

      // Animate numbers appearing one by one
      for (let i = 0; i < numbers.length; i++) {
         await new Promise((resolve) => setTimeout(resolve, 30));
         setDrawnNumbers((prev) => [...prev, numbers[i]]);
      }

      setIsDrawing(false);
   };

   const exportToCSV = () => {
      if (drawnNumbers.length === 0) return;

      const csv = drawnNumbers.join(',');
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement('a');
      const url = URL.createObjectURL(blob);

      link.setAttribute('href', url);
      link.setAttribute('download', `lottery-results-${Date.now()}.csv`);
      link.style.visibility = 'hidden';

      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
   };

   const reset = () => {
      setTotalNumbers('');
      setNumbersToDraw('');
      setDrawnNumbers([]);
      setError('');
   };

   return (
      <div className='w-full max-w-4xl mx-auto space-y-6'>
         <Card className='border-2 shadow-xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800'>
            <CardHeader className='text-center'>
               <div className='flex justify-center mb-4'>
                  <div className='p-4 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl shadow-lg'>
                     <Sparkles className='w-12 h-12 text-white' />
                  </div>
               </div>
               <CardTitle className='text-4xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent'>
                  نظام القرعة الذكي
               </CardTitle>
               <CardDescription className='text-lg mt-2'>قم بادخال العدد الكلي للموظفين المتاحين للقرعة</CardDescription>
            </CardHeader>
            <CardContent className='space-y-6'>
               <div className='grid gap-6 md:grid-cols-2'>
                  <div className='space-y-2'>
                     <Label htmlFor='total' className='text-base font-semibold'>
                        إجمالي عدد الموظفين
                     </Label>
                     <Input
                        id='total'
                        type='number'
                        min='1'
                        placeholder='مثال: 500'
                        value={totalNumbers}
                        onChange={(e) => setTotalNumbers(e.target.value)}
                        className='text-lg h-12 text-right'
                        disabled={isDrawing}
                     />
                     <p className='text-sm text-muted-foreground'>أدخل العدد الكلي للموظفين المتاحين للقرعة</p>
                  </div>

                  <div className='space-y-2'>
                     <Label htmlFor='draw' className='text-base font-semibold'>
                        عدد الموظفين المراد سحبهم
                     </Label>
                     <Input
                        id='draw'
                        type='number'
                        min='1'
                        placeholder='مثال: 100'
                        value={numbersToDraw}
                        onChange={(e) => setNumbersToDraw(e.target.value)}
                        className='text-lg h-12 text-right'
                        disabled={isDrawing}
                     />
                     <p className='text-sm text-muted-foreground'>أدخل عدد الموظفين المراد سحبهم</p>
                  </div>
               </div>

               {error && (
                  <div className='p-4 bg-red-50 dark:bg-red-950 border-2 border-red-200 dark:border-red-800 rounded-lg'>
                     <p className='text-red-600 dark:text-red-400 text-center font-medium'>{error}</p>
                  </div>
               )}

               <div className='flex gap-3 justify-center'>
                  <Button
                     onClick={handleDraw}
                     disabled={isDrawing || !totalNumbers || !numbersToDraw}
                     size='lg'
                     className='bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold text-lg px-8 h-12 shadow-lg hover:shadow-xl transition-all'
                  >
                     {isDrawing ? (
                        <>
                           <Shuffle className='mr-2 h-5 w-5 animate-spin' />
                           جاري السحب...
                        </>
                     ) : (
                        <>
                           <Sparkles className='mr-2 h-5 w-5' />
                           ابدأ القرعة
                        </>
                     )}
                  </Button>

                  {drawnNumbers.length > 0 && !isDrawing && (
                     <Button onClick={reset} variant='outline' size='lg' className='font-bold text-lg px-8 h-12'>
                        إعادة تعيين
                     </Button>
                  )}
               </div>
            </CardContent>
         </Card>

         {drawnNumbers.length > 0 && (
            <Card className='border-2 shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-500'>
               <CardHeader>
                  <div className='flex justify-between items-center'>
                     <div>
                        <CardTitle className='text-2xl'>نتائج القرعة</CardTitle>
                        <CardDescription className='text-base mt-2'>
                           تم اختيار {drawnNumbers.length} رقم من أصل {totalNumbers}
                        </CardDescription>
                     </div>
                     <Button onClick={exportToCSV} variant='outline' size='lg' className='gap-2 font-bold'>
                        <Download className='h-5 w-5' />
                        تصدير CSV
                     </Button>
                  </div>
               </CardHeader>
               <CardContent>
                  <div className='grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-3'>
                     {drawnNumbers.map((number, index) => (
                        <div key={index} className='animate-in fade-in zoom-in duration-300' style={{ animationDelay: `${index * 30}ms` }}>
                           <Badge
                              variant='secondary'
                              className='w-full h-12 flex items-center justify-center text-lg font-bold bg-gradient-to-br from-blue-100 to-cyan-100 dark:from-blue-900 dark:to-cyan-900 hover:from-blue-200 hover:to-cyan-200 dark:hover:from-blue-800 dark:hover:to-cyan-800 border-2 border-blue-300 dark:border-blue-700 transition-all cursor-default'
                           >
                              {number}
                           </Badge>
                        </div>
                     ))}
                  </div>
               </CardContent>
            </Card>
         )}
      </div>
   );
}
