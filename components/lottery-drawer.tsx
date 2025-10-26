"use client"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Download, Sparkles, Shuffle, Upload, Users, Hash } from "lucide-react"

type LotteryMode = "numbers" | "employees"

interface Employee {
  name: string
  originalIndex: number
}

export function LotteryDrawer() {
  // Mode state
  const [mode, setMode] = useState<LotteryMode>("numbers")

  // Numbers mode state
  const [totalNumbers, setTotalNumbers] = useState<string>("")
  const [numbersToDraw, setNumbersToDraw] = useState<string>("")
  const [drawnNumbers, setDrawnNumbers] = useState<number[]>([])

  // Employees mode state
  const [employees, setEmployees] = useState<Employee[]>([])
  const [employeesToDraw, setEmployeesToDraw] = useState<string>("")
  const [drawnEmployees, setDrawnEmployees] = useState<Employee[]>([])
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Common state
  const [isDrawing, setIsDrawing] = useState(false)
  const [error, setError] = useState<string>("")

  const generateRandomNumbers = (max: number, count: number): number[] => {
    const numbers = new Set<number>()
    while (numbers.size < count) {
      numbers.add(Math.floor(Math.random() * max) + 1)
    }
    return Array.from(numbers).sort((a, b) => a - b)
  }

  const selectRandomEmployees = (employeeList: Employee[], count: number): Employee[] => {
    const shuffled = [...employeeList].sort(() => Math.random() - 0.5)
    return shuffled.slice(0, count)
  }

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setError("")

    // Check if file is CSV
    if (!file.name.endsWith('.csv')) {
      setError("الرجاء رفع ملف CSV فقط")
      return
    }

    const text = await file.text()
    const lines = text.split('\n').filter(line => line.trim() !== '')

    if (lines.length === 0) {
      setError("الملف فارغ")
      return
    }

    // Parse CSV - assuming each line is an employee name
    const employeeList: Employee[] = lines.map((line, index) => ({
      name: line.trim().replace(/[",]/g, ''), // Remove quotes and commas
      originalIndex: index + 1
    })).filter(emp => emp.name !== '')

    if (employeeList.length === 0) {
      setError("لم يتم العثور على أسماء صحيحة في الملف")
      return
    }

    setEmployees(employeeList)
    setDrawnEmployees([])
    setEmployeesToDraw("")
  }

  const handleNumbersDraw = async () => {
    setError("")

    const total = parseInt(totalNumbers)
    const draw = parseInt(numbersToDraw)

    // Validation
    if (!total || !draw) {
      setError("الرجاء إدخال قيم صحيحة في كلا الحقلين")
      return
    }

    if (total < 1 || draw < 1) {
      setError("يجب أن تكون الأرقام أكبر من صفر")
      return
    }

    if (draw > total) {
      setError("عدد الأرقام المطلوب سحبها يجب أن يكون أقل من أو يساوي العدد الكلي")
      return
    }

    setIsDrawing(true)
    setDrawnNumbers([])

    // Simulate drawing animation
    await new Promise(resolve => setTimeout(resolve, 500))

    const numbers = generateRandomNumbers(total, draw)

    // Animate numbers appearing one by one
    for (let i = 0; i < numbers.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 30))
      setDrawnNumbers(prev => [...prev, numbers[i]])
    }

    setIsDrawing(false)
  }

  const handleEmployeesDraw = async () => {
    setError("")

    const draw = parseInt(employeesToDraw)

    // Validation
    if (!draw) {
      setError("الرجاء إدخال عدد الموظفين المراد سحبهم")
      return
    }

    if (draw < 1) {
      setError("يجب أن يكون العدد أكبر من صفر")
      return
    }

    if (draw > employees.length) {
      setError(`عدد الموظفين المطلوب سحبهم (${draw}) يجب أن يكون أقل من أو يساوي العدد الكلي (${employees.length})`)
      return
    }

    setIsDrawing(true)
    setDrawnEmployees([])

    // Simulate drawing animation
    await new Promise(resolve => setTimeout(resolve, 500))

    const selected = selectRandomEmployees(employees, draw)

    // Animate employees appearing one by one
    for (let i = 0; i < selected.length; i++) {
      await new Promise(resolve => setTimeout(resolve, 50))
      setDrawnEmployees(prev => [...prev, selected[i]])
    }

    setIsDrawing(false)
  }

  const exportNumbersToCSV = () => {
    if (drawnNumbers.length === 0) return

    const csv = drawnNumbers.join("\n")
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)

    link.setAttribute("href", url)
    link.setAttribute("download", `lottery-numbers-${Date.now()}.csv`)
    link.style.visibility = "hidden"

    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const exportEmployeesToCSV = () => {
    if (drawnEmployees.length === 0) return

    const csv = drawnEmployees.map(emp => emp.name).join("\n")
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8;" })
    const link = document.createElement("a")
    const url = URL.createObjectURL(blob)

    link.setAttribute("href", url)
    link.setAttribute("download", `lottery-employees-${Date.now()}.csv`)
    link.style.visibility = "hidden"

    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  const resetNumbers = () => {
    setTotalNumbers("")
    setNumbersToDraw("")
    setDrawnNumbers([])
    setError("")
  }

  const resetEmployees = () => {
    setEmployees([])
    setEmployeesToDraw("")
    setDrawnEmployees([])
    setError("")
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  const switchMode = (newMode: LotteryMode) => {
    setMode(newMode)
    setError("")
  }

  return (
    <div className="w-full max-w-4xl mx-auto space-y-6">
      {/* Mode Switcher */}
      <div className="flex justify-center gap-3">
        <Button
          onClick={() => switchMode("numbers")}
          variant={mode === "numbers" ? "default" : "outline"}
          size="lg"
          className={`font-bold text-lg px-8 h-12 ${
            mode === "numbers"
              ? "bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white"
              : ""
          }`}
        >
          <Hash className="ml-2 h-5 w-5" />
          قرعة الأرقام
        </Button>
        <Button
          onClick={() => switchMode("employees")}
          variant={mode === "employees" ? "default" : "outline"}
          size="lg"
          className={`font-bold text-lg px-8 h-12 ${
            mode === "employees"
              ? "bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white"
              : ""
          }`}
        >
          <Users className="ml-2 h-5 w-5" />
          قرعة الموظفين
        </Button>
      </div>

      <Card className="border-2 shadow-xl bg-gradient-to-br from-white to-gray-50 dark:from-gray-900 dark:to-gray-800">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            <div
              className={`p-4 rounded-2xl shadow-lg ${
                mode === "numbers"
                  ? "bg-gradient-to-br from-purple-500 to-pink-500"
                  : "bg-gradient-to-br from-blue-500 to-cyan-500"
              }`}
            >
              {mode === "numbers" ? (
                <Sparkles className="w-12 h-12 text-white" />
              ) : (
                <Users className="w-12 h-12 text-white" />
              )}
            </div>
          </div>
          <CardTitle
            className={`text-4xl font-bold bg-clip-text text-transparent ${
              mode === "numbers"
                ? "bg-gradient-to-r from-purple-600 to-pink-600"
                : "bg-gradient-to-r from-blue-600 to-cyan-600"
            }`}
          >
            {mode === "numbers" ? "قرعة الأرقام" : "قرعة الموظفين"}
          </CardTitle>
          <CardDescription className="text-lg mt-2">
            {mode === "numbers"
              ? "اختر أرقامك العشوائية بطريقة عصرية وسهلة"
              : "ارفع ملف CSV للموظفين واختر الفائزين"}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {mode === "numbers" ? (
            // Numbers Mode
            <>
              <div className="grid gap-6 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="total" className="text-base font-semibold">
                    إجمالي عدد الأرقام
                  </Label>
                  <Input
                    id="total"
                    type="number"
                    min="1"
                    placeholder="مثال: 500"
                    value={totalNumbers}
                    onChange={(e) => setTotalNumbers(e.target.value)}
                    className="text-lg h-12 text-right"
                    disabled={isDrawing}
                  />
                  <p className="text-sm text-muted-foreground">
                    أدخل العدد الكلي للأرقام المتاحة
                  </p>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="draw" className="text-base font-semibold">
                    عدد الأرقام المراد سحبها
                  </Label>
                  <Input
                    id="draw"
                    type="number"
                    min="1"
                    placeholder="مثال: 200"
                    value={numbersToDraw}
                    onChange={(e) => setNumbersToDraw(e.target.value)}
                    className="text-lg h-12 text-right"
                    disabled={isDrawing}
                  />
                  <p className="text-sm text-muted-foreground">
                    أدخل عدد الأرقام التي تريد اختيارها
                  </p>
                </div>
              </div>

              {error && (
                <div className="p-4 bg-red-50 dark:bg-red-950 border-2 border-red-200 dark:border-red-800 rounded-lg">
                  <p className="text-red-600 dark:text-red-400 text-center font-medium">
                    {error}
                  </p>
                </div>
              )}

              <div className="flex gap-3 justify-center">
                <Button
                  onClick={handleNumbersDraw}
                  disabled={isDrawing || !totalNumbers || !numbersToDraw}
                  size="lg"
                  className="bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 text-white font-bold text-lg px-8 h-12 shadow-lg hover:shadow-xl transition-all"
                >
                  {isDrawing ? (
                    <>
                      <Shuffle className="mr-2 h-5 w-5 animate-spin" />
                      جاري السحب...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-5 w-5" />
                      ابدأ القرعة
                    </>
                  )}
                </Button>

                {drawnNumbers.length > 0 && !isDrawing && (
                  <Button
                    onClick={resetNumbers}
                    variant="outline"
                    size="lg"
                    className="font-bold text-lg px-8 h-12"
                  >
                    إعادة تعيين
                  </Button>
                )}
              </div>
            </>
          ) : (
            // Employees Mode
            <>
              <div className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="csv-upload" className="text-base font-semibold">
                    رفع ملف CSV للموظفين
                  </Label>
                  <div className="flex gap-3">
                    <input
                      ref={fileInputRef}
                      id="csv-upload"
                      type="file"
                      accept=".csv"
                      onChange={handleFileUpload}
                      className="hidden"
                      disabled={isDrawing}
                    />
                    <Button
                      onClick={() => fileInputRef.current?.click()}
                      variant="outline"
                      size="lg"
                      className="flex-1 font-bold text-lg h-12"
                      disabled={isDrawing}
                    >
                      <Upload className="ml-2 h-5 w-5" />
                      {employees.length > 0 ? "تغيير الملف" : "رفع ملف CSV"}
                    </Button>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    ارفع ملف CSV يحتوي على أسماء الموظفين (اسم واحد في كل سطر)
                  </p>
                </div>

                {employees.length > 0 && (
                  <>
                    <div className="p-4 bg-green-50 dark:bg-green-950 border-2 border-green-200 dark:border-green-800 rounded-lg">
                      <p className="text-green-600 dark:text-green-400 text-center font-medium">
                        تم تحميل {employees.length} موظف بنجاح ✓
                      </p>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="emp-draw" className="text-base font-semibold">
                        عدد الموظفين المراد سحبهم
                      </Label>
                      <Input
                        id="emp-draw"
                        type="number"
                        min="1"
                        max={employees.length}
                        placeholder={`مثال: ${Math.min(10, employees.length)}`}
                        value={employeesToDraw}
                        onChange={(e) => setEmployeesToDraw(e.target.value)}
                        className="text-lg h-12 text-right"
                        disabled={isDrawing}
                      />
                      <p className="text-sm text-muted-foreground">
                        أدخل عدد الموظفين الفائزين (من 1 إلى {employees.length})
                      </p>
                    </div>
                  </>
                )}
              </div>

              {error && (
                <div className="p-4 bg-red-50 dark:bg-red-950 border-2 border-red-200 dark:border-red-800 rounded-lg">
                  <p className="text-red-600 dark:text-red-400 text-center font-medium">
                    {error}
                  </p>
                </div>
              )}

              <div className="flex gap-3 justify-center">
                <Button
                  onClick={handleEmployeesDraw}
                  disabled={isDrawing || employees.length === 0 || !employeesToDraw}
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-cyan-600 hover:from-blue-700 hover:to-cyan-700 text-white font-bold text-lg px-8 h-12 shadow-lg hover:shadow-xl transition-all"
                >
                  {isDrawing ? (
                    <>
                      <Shuffle className="mr-2 h-5 w-5 animate-spin" />
                      جاري السحب...
                    </>
                  ) : (
                    <>
                      <Sparkles className="mr-2 h-5 w-5" />
                      ابدأ القرعة
                    </>
                  )}
                </Button>

                {employees.length > 0 && !isDrawing && (
                  <Button
                    onClick={resetEmployees}
                    variant="outline"
                    size="lg"
                    className="font-bold text-lg px-8 h-12"
                  >
                    إعادة تعيين
                  </Button>
                )}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      {/* Results for Numbers */}
      {mode === "numbers" && drawnNumbers.length > 0 && (
        <Card className="border-2 shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-500">
          <CardHeader>
            <div className="flex justify-between items-center flex-wrap gap-4">
              <div>
                <CardTitle className="text-2xl">نتائج القرعة</CardTitle>
                <CardDescription className="text-base mt-2">
                  تم اختيار {drawnNumbers.length} رقم من أصل {totalNumbers}
                </CardDescription>
              </div>
              <Button
                onClick={exportNumbersToCSV}
                variant="outline"
                size="lg"
                className="gap-2 font-bold"
              >
                <Download className="h-5 w-5" />
                تصدير CSV
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-5 sm:grid-cols-8 md:grid-cols-10 lg:grid-cols-12 gap-3">
              {drawnNumbers.map((number, index) => (
                <div
                  key={index}
                  className="animate-in fade-in zoom-in duration-300"
                  style={{ animationDelay: `${index * 30}ms` }}
                >
                  <Badge
                    variant="secondary"
                    className="w-full h-12 flex items-center justify-center text-lg font-bold bg-gradient-to-br from-purple-100 to-pink-100 dark:from-purple-900 dark:to-pink-900 hover:from-purple-200 hover:to-pink-200 dark:hover:from-purple-800 dark:hover:to-pink-800 border-2 border-purple-300 dark:border-purple-700 transition-all cursor-default"
                  >
                    {number}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Results for Employees */}
      {mode === "employees" && drawnEmployees.length > 0 && (
        <Card className="border-2 shadow-xl animate-in fade-in slide-in-from-bottom-4 duration-500">
          <CardHeader>
            <div className="flex justify-between items-center flex-wrap gap-4">
              <div>
                <CardTitle className="text-2xl">الموظفون الفائزون 🎉</CardTitle>
                <CardDescription className="text-base mt-2">
                  تم اختيار {drawnEmployees.length} موظف من أصل {employees.length}
                </CardDescription>
              </div>
              <Button
                onClick={exportEmployeesToCSV}
                variant="outline"
                size="lg"
                className="gap-2 font-bold"
              >
                <Download className="h-5 w-5" />
                تصدير CSV
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {drawnEmployees.map((employee, index) => (
                <div
                  key={index}
                  className="animate-in fade-in slide-in-from-bottom-2 duration-300"
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <Card className="bg-gradient-to-br from-blue-50 to-cyan-50 dark:from-blue-950 dark:to-cyan-950 border-2 border-blue-300 dark:border-blue-700 hover:shadow-lg transition-all">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="flex-shrink-0 w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-cyan-600 flex items-center justify-center text-white font-bold text-lg">
                          {index + 1}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-lg font-bold text-gray-900 dark:text-gray-100 truncate">
                            {employee.name}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
