import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAttendance } from "@/hooks/useAttendance";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Target, TrendingUp, TrendingDown } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { Progress } from "@/components/ui/progress";

const TargetAchievement = () => {
  const navigate = useNavigate();
  const { attendance, getCurrentPercentage, calculateTargetAchievement } = useAttendance();
  const [targetPercentage, setTargetPercentage] = useState([75]);
  const [classesPerDay, setClassesPerDay] = useState("7");
  const [result, setResult] = useState<any>(null);
  const [calculated, setCalculated] = useState(false);

  const currentPercentage = getCurrentPercentage();

  if (!attendance.totalClasses) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="max-w-md">
          <CardHeader>
            <CardTitle>No Data Available</CardTitle>
            <CardDescription>
              Please calculate your attendance first on the home page
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => navigate("/")} className="w-full">
              Go to Home
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleCalculate = () => {
    const perDay = Number(classesPerDay);

    if (!perDay || perDay <= 0) {
      toast({
        title: "Invalid Input",
        description: "Please enter a valid number for classes per day",
        variant: "destructive",
      });
      return;
    }

    const calculation = calculateTargetAchievement(targetPercentage[0], perDay);
    setResult(calculation);
    setCalculated(true);
  };

  const getStatusColor = (percentage: number) => {
    if (percentage >= 75) return "text-success";
    if (percentage >= 65) return "text-warning";
    return "text-destructive";
  };

  const generateTableData = () => {
    if (!result) return [];

    if (result.isAboveTarget) {
      const data = [];
      const maxSkips = Math.min(result.classesDifference, 10);
      for (let i = 0; i <= maxSkips; i += Math.max(1, Math.floor(maxSkips / 5))) {
        const newTotal = attendance.totalClasses + i;
        const percentage = (attendance.attendedClasses / newTotal) * 100;
        const buffer = result.classesDifference - i;
        data.push({
          classesSkipped: i,
          percentage: percentage.toFixed(2),
          buffer,
        });
      }
      return data;
    } else {
      const data = [];
      for (let i = 0; i <= result.classesDifference; i += Math.max(1, Math.floor(result.classesDifference / 5))) {
        const newTotal = attendance.totalClasses + i;
        const newAttended = attendance.attendedClasses + i;
        const percentage = (newAttended / newTotal) * 100;
        data.push({
          additionalClasses: i,
          percentage: percentage.toFixed(2),
          progress: ((i / result.classesDifference) * 100).toFixed(0),
        });
      }
      if (data[data.length - 1].additionalClasses !== result.classesDifference) {
        const newTotal = attendance.totalClasses + result.classesDifference;
        const newAttended = attendance.attendedClasses + result.classesDifference;
        const percentage = (newAttended / newTotal) * 100;
        data.push({
          additionalClasses: result.classesDifference,
          percentage: percentage.toFixed(2),
          progress: "100",
        });
      }
      return data;
    }
  };

  const chartData = generateTableData().map(item => ({
    name: result?.isAboveTarget 
      ? `Skip ${item.classesSkipped || 0}` 
      : `+${item.additionalClasses || 0}`,
    percentage: parseFloat(item.percentage || "0"),
  }));

  return (
    <div className="min-h-screen p-4 md:p-8">
      <div className="container mx-auto max-w-6xl">
        <Button 
          variant="ghost" 
          onClick={() => navigate("/")}
          className="mb-6"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Home
        </Button>

        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
              <Target className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Target Achievement</h1>
              <p className="text-muted-foreground">
                Calculate what's needed to reach or maintain your goal
              </p>
            </div>
          </div>

          {/* Current Status */}
          <Card>
            <CardHeader>
              <CardTitle>Current Attendance Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-secondary/10 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Classes Attended</p>
                  <p className="text-2xl font-bold">{attendance.attendedClasses}</p>
                </div>
                <div className="text-center p-4 bg-secondary/10 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Total Classes</p>
                  <p className="text-2xl font-bold">{attendance.totalClasses}</p>
                </div>
                <div className="text-center p-4 bg-secondary/10 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-1">Current Percentage</p>
                  <p className={`text-2xl font-bold ${getStatusColor(currentPercentage)}`}>
                    {currentPercentage.toFixed(2)}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Input Section */}
          <Card>
            <CardHeader>
              <CardTitle>Set Your Target</CardTitle>
              <CardDescription>
                Choose your target attendance percentage
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label>Target Attendance Percentage</Label>
                  <span className="text-2xl font-bold text-primary">{targetPercentage[0]}%</span>
                </div>
                <Slider
                  value={targetPercentage}
                  onValueChange={setTargetPercentage}
                  min={50}
                  max={100}
                  step={1}
                  className="w-full"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="perday">Classes per Day</Label>
                <Input
                  id="perday"
                  type="number"
                  min="1"
                  placeholder="e.g., 7"
                  value={classesPerDay}
                  onChange={(e) => setClassesPerDay(e.target.value)}
                />
              </div>
              <Button onClick={handleCalculate} className="w-full" size="lg">
                Calculate Target
              </Button>
            </CardContent>
          </Card>

          {/* Results */}
          {calculated && result && (
            <>
              {/* Status Card */}
              <Card className={`animate-fade-in border-2 ${
                result.isAboveTarget ? "border-success" : "border-warning"
              }`}>
                <CardHeader>
                  <div className="flex items-center gap-3">
                    {result.isAboveTarget ? (
                      <TrendingUp className="w-8 h-8 text-success" />
                    ) : (
                      <TrendingDown className="w-8 h-8 text-warning" />
                    )}
                    <div>
                      <CardTitle>
                        {result.isAboveTarget 
                          ? "Great! You're Above Your Target" 
                          : "You Need to Improve Attendance"
                        }
                      </CardTitle>
                      <CardDescription>
                        {result.isAboveTarget
                          ? `You can skip ${result.classesDifference} more classes (approx. ${result.daysEstimate} days)`
                          : `You need to attend ${result.classesDifference} more classes (approx. ${result.daysEstimate} days)`
                        }
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {!result.isAboveTarget && (
                    <div className="space-y-2">
                      <div className="flex justify-between text-sm">
                        <span>Progress to Target</span>
                        <span className="font-medium">
                          {((currentPercentage / targetPercentage[0]) * 100).toFixed(0)}%
                        </span>
                      </div>
                      <Progress value={(currentPercentage / targetPercentage[0]) * 100} />
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Table */}
              <Card className="animate-fade-in">
                <CardHeader>
                  <CardTitle>
                    {result.isAboveTarget ? "Safe Skip Range" : "Path to Target"}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>
                          {result.isAboveTarget ? "Classes Skipped" : "Additional Classes"}
                        </TableHead>
                        <TableHead>Resulting Percentage</TableHead>
                        <TableHead>
                          {result.isAboveTarget ? "Buffer Remaining" : "Progress"}
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {generateTableData().map((row, index) => (
                        <TableRow key={index}>
                          <TableCell className="font-medium">
                            {result.isAboveTarget ? row.classesSkipped : row.additionalClasses}
                          </TableCell>
                          <TableCell className={getStatusColor(parseFloat(row.percentage))}>
                            {row.percentage}%
                          </TableCell>
                          <TableCell>
                            {result.isAboveTarget ? row.buffer : `${row.progress}%`}
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              {/* Chart */}
              <Card className="animate-fade-in">
                <CardHeader>
                  <CardTitle>Visual Projection</CardTitle>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="name" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip />
                      <Bar 
                        dataKey="percentage" 
                        fill="hsl(var(--primary))"
                        radius={[8, 8, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              {/* Recommendations */}
              <Card className="animate-fade-in">
                <CardHeader>
                  <CardTitle>Recommendations</CardTitle>
                </CardHeader>
                <CardContent className="space-y-2">
                  {result.isAboveTarget ? (
                    <>
                      <p className="text-muted-foreground">
                        ✓ You're doing great! Your attendance is above the target of {targetPercentage[0]}%.
                      </p>
                      <p className="text-muted-foreground">
                        ✓ You can safely miss up to {result.classesDifference} classes while staying above your target.
                      </p>
                      <p className="text-muted-foreground">
                        ✓ This equals approximately {result.daysEstimate} days off (based on {classesPerDay} classes per day).
                      </p>
                    </>
                  ) : (
                    <>
                      <p className="text-muted-foreground">
                        • Focus on attending all upcoming classes without any absences.
                      </p>
                      <p className="text-muted-foreground">
                        • You need to attend {result.classesDifference} consecutive classes to reach {targetPercentage[0]}%.
                      </p>
                      <p className="text-muted-foreground">
                        • This will take approximately {result.daysEstimate} days (based on {classesPerDay} classes per day).
                      </p>
                      <p className="text-muted-foreground">
                        • Consider setting daily reminders to ensure you don't miss any classes.
                      </p>
                    </>
                  )}
                </CardContent>
              </Card>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default TargetAchievement;
