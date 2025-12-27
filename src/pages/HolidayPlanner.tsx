import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { useAttendance } from "@/hooks/useAttendance";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Calendar } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from "recharts";

const HolidayPlanner = () => {
  const navigate = useNavigate();
  const { attendance, getCurrentPercentage, calculateHolidayImpact } = useAttendance();
  const [futureHolidays, setFutureHolidays] = useState("");
  const [classesPerDay, setClassesPerDay] = useState("7");
  const [results, setResults] = useState<any[]>([]);
  const [analyzed, setAnalyzed] = useState(false);

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

  const handleAnalyze = () => {
    const holidays = Number(futureHolidays);
    const perDay = Number(classesPerDay);

    if (!holidays || !perDay || holidays <= 0 || perDay <= 0) {
      toast({
        title: "Invalid Input",
        description: "Please enter valid positive numbers",
        variant: "destructive",
      });
      return;
    }

    const impact = calculateHolidayImpact(holidays, perDay);
    setResults(impact);
    setAnalyzed(true);
  };

  const getStatusColor = (percentage: number) => {
    if (percentage >= 75) return "text-success";
    if (percentage >= 65) return "text-warning";
    return "text-destructive";
  };

  const lineChartData = results.map(r => ({
    day: `Day ${r.day}`,
    percentage: r.percentage,
  }));

  const totalMissed = results.length > 0 
    ? Number(classesPerDay) * results.length 
    : 0;

  const pieData = [
    { name: "Attended", value: attendance.attendedClasses },
    { name: "Will Miss", value: totalMissed },
  ];

  const COLORS = ["hsl(var(--success))", "hsl(var(--destructive))"];

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
              <Calendar className="w-6 h-6 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold">Holiday Planning</h1>
              <p className="text-muted-foreground">
                Analyze how taking holidays affects your attendance
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
              <CardTitle>Plan Your Holidays</CardTitle>
              <CardDescription>
                Enter the number of days you plan to take off
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="holidays">Number of Future Holidays (Days)</Label>
                  <Input
                    id="holidays"
                    type="number"
                    min="1"
                    placeholder="e.g., 5"
                    value={futureHolidays}
                    onChange={(e) => setFutureHolidays(e.target.value)}
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
              </div>
              <Button onClick={handleAnalyze} className="w-full" size="lg">
                Analyze Impact
              </Button>
            </CardContent>
          </Card>

          {/* Results */}
          {analyzed && results.length > 0 && (
            <>
              {/* Table */}
              <Card className="animate-fade-in">
                <CardHeader>
                  <CardTitle>Day-by-Day Breakdown</CardTitle>
                </CardHeader>
                <CardContent>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Day</TableHead>
                        <TableHead>Percentage After</TableHead>
                        <TableHead>Decrement</TableHead>
                        <TableHead>Total Classes</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {results.map((result) => (
                        <TableRow key={result.day}>
                          <TableCell className="font-medium">Day {result.day}</TableCell>
                          <TableCell className={getStatusColor(result.percentage)}>
                            {result.percentage.toFixed(2)}%
                          </TableCell>
                          <TableCell className="text-destructive">
                            -{result.decrement.toFixed(2)}%
                          </TableCell>
                          <TableCell>{result.totalClasses}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>

              {/* Charts */}
              <div className="grid md:grid-cols-2 gap-6 animate-fade-in">
                <Card>
                  <CardHeader>
                    <CardTitle>Attendance Decline Trend</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <LineChart data={lineChartData}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="day" />
                        <YAxis domain={[0, 100]} />
                        <Tooltip />
                        <Line 
                          type="monotone" 
                          dataKey="percentage" 
                          stroke="hsl(var(--primary))" 
                          strokeWidth={2}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Attendance Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={300}>
                      <PieChart>
                        <Pie
                          data={pieData}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={(entry) => `${entry.name}: ${entry.value}`}
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                        >
                          {pieData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default HolidayPlanner;
