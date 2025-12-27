import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useNavigate } from "react-router-dom";
import { Calculator, Target, TrendingUp, Calendar } from "lucide-react";
import { useAttendance } from "@/hooks/useAttendance";
import { useState } from "react";
import { toast } from "@/hooks/use-toast";

const Home = () => {
  const navigate = useNavigate();
  const { attendance, updateAttendance, getCurrentPercentage } = useAttendance();
  const [totalClasses, setTotalClasses] = useState(attendance.totalClasses || "");
  const [attendedClasses, setAttendedClasses] = useState(attendance.attendedClasses || "");
  const [calculated, setCalculated] = useState(false);

  const handleCalculate = () => {
    const total = Number(totalClasses);
    const attended = Number(attendedClasses);

    if (!total || !attended) {
      toast({
        title: "Invalid Input",
        description: "Please enter valid numbers for both fields",
        variant: "destructive",
      });
      return;
    }

    if (attended > total) {
      toast({
        title: "Invalid Input",
        description: "Classes attended cannot be more than total classes",
        variant: "destructive",
      });
      return;
    }

    updateAttendance({
      totalClasses: total,
      attendedClasses: attended,
    });
    setCalculated(true);
    toast({
      title: "Attendance Calculated",
      description: "Your attendance has been calculated successfully",
    });
  };

  const currentPercentage = getCurrentPercentage();
  const getStatusColor = () => {
    if (currentPercentage >= 75) return "text-success";
    if (currentPercentage >= 65) return "text-warning";
    return "text-destructive";
  };

  return (
    <div className="min-h-screen bg-gradient-subtle">
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="text-center space-y-4 mb-12">
          <h1 className="text-4xl lg:text-5xl font-bold">
            Attendance Calculator &{" "}
            <span className="bg-gradient-primary bg-clip-text text-transparent">
              Holiday Planner
            </span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Track your attendance, plan holidays, and achieve your target percentage with smart calculations
          </p>
        </div>

        {/* Main Calculator Card */}
        <Card className="max-w-2xl mx-auto shadow-medium">
          <CardHeader>
            <CardTitle>Calculate Your Attendance</CardTitle>
            <CardDescription>
              Enter your class details to get started
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="total">Total Classes Conducted</Label>
                <Input
                  id="total"
                  type="number"
                  min="0"
                  placeholder="e.g., 100"
                  value={totalClasses}
                  onChange={(e) => setTotalClasses(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="attended">Classes Attended</Label>
                <Input
                  id="attended"
                  type="number"
                  min="0"
                  placeholder="e.g., 80"
                  value={attendedClasses}
                  onChange={(e) => setAttendedClasses(e.target.value)}
                />
              </div>
            </div>

            <Button onClick={handleCalculate} className="w-full" size="lg">
              Calculate Attendance
            </Button>

            {calculated && (
              <div className="space-y-4 animate-fade-in">
                <div className="text-center p-6 bg-secondary/10 rounded-lg">
                  <p className="text-sm text-muted-foreground mb-2">
                    Current Attendance
                  </p>
                  <p className={`text-5xl font-bold ${getStatusColor()}`}>
                    {currentPercentage.toFixed(2)}%
                  </p>
                  <p className="text-sm text-muted-foreground mt-2">
                    {attendance.attendedClasses} / {attendance.totalClasses} classes
                  </p>
                </div>

                {/* Action Cards */}
                <div className="grid md:grid-cols-2 gap-4">
                  <Card 
                    className="cursor-pointer hover:shadow-soft transition-all border-2 hover:border-primary"
                    onClick={() => navigate("/holiday-planner")}
                  >
                    <CardHeader>
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                        <Calendar className="w-6 h-6 text-primary" />
                      </div>
                      <CardTitle className="text-lg">Holiday Planning</CardTitle>
                      <CardDescription>
                        See how taking holidays affects your attendance percentage
                      </CardDescription>
                    </CardHeader>
                  </Card>

                  <Card 
                    className="cursor-pointer hover:shadow-soft transition-all border-2 hover:border-primary"
                    onClick={() => navigate("/target-achievement")}
                  >
                    <CardHeader>
                      <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center mb-2">
                        <Target className="w-6 h-6 text-primary" />
                      </div>
                      <CardTitle className="text-lg">Target Achievement</CardTitle>
                      <CardDescription>
                        Calculate classes needed to reach or maintain your target
                      </CardDescription>
                    </CardHeader>
                  </Card>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </section>

      {/* Features Section */}
      <section className="container mx-auto px-4 py-12">
        <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto">
          <Card>
            <CardContent className="pt-6">
              <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center mb-4">
                <TrendingUp className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Real-time Calculations</h3>
              <p className="text-muted-foreground text-sm">
                Get instant results with accurate attendance calculations
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center mb-4">
                <Calendar className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Smart Planning</h3>
              <p className="text-muted-foreground text-sm">
                Plan your holidays without compromising attendance goals
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="w-12 h-12 rounded-lg bg-secondary flex items-center justify-center mb-4">
                <Target className="w-6 h-6 text-primary" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Target Tracking</h3>
              <p className="text-muted-foreground text-sm">
                Set goals and see exactly what's needed to achieve them
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
};

export default Home;
