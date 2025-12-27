import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useAttendance } from "@/hooks/useAttendance";
import { toast } from "sonner";
import { Trash2, Save } from "lucide-react";

const Settings = () => {
  const { attendance, updateAttendance, resetAttendance, getCurrentPercentage } = useAttendance();
  const [targetPercentage, setTargetPercentage] = useState(attendance.targetPercentage.toString());

  const saveTarget = () => {
    const target = parseInt(targetPercentage);
    if (target < 0 || target > 100) {
      toast.error("Target must be between 0 and 100");
      return;
    }
    updateAttendance({ targetPercentage: target });
    toast.success("Target percentage updated!");
  };

  const handleResetData = () => {
    if (window.confirm("Are you sure you want to reset all attendance data? This action cannot be undone.")) {
      resetAttendance();
      toast.success("All data has been reset");
    }
  };

  const currentPercentage = getCurrentPercentage();

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <h1 className="text-4xl font-bold mb-8">Settings</h1>

      <div className="space-y-6">
        {/* Target Settings */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle>Target Attendance</CardTitle>
            <CardDescription>
              Set your desired attendance percentage goal
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="target">Target Percentage (%)</Label>
              <Input
                id="target"
                type="number"
                value={targetPercentage}
                onChange={(e) => setTargetPercentage(e.target.value)}
                min="0"
                max="100"
                placeholder="75"
              />
            </div>
            <Button onClick={saveTarget} className="bg-gradient-primary">
              <Save className="w-4 h-4 mr-2" />
              Save Target
            </Button>
          </CardContent>
        </Card>

        {/* Current Stats */}
        <Card className="shadow-soft">
          <CardHeader>
            <CardTitle>Current Statistics</CardTitle>
            <CardDescription>
              Overview of your attendance data
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between p-3 bg-secondary rounded-lg">
                <span className="font-medium">Total Classes</span>
                <span className="font-bold">{attendance.totalClasses}</span>
              </div>
              <div className="flex justify-between p-3 bg-secondary rounded-lg">
                <span className="font-medium">Classes Attended</span>
                <span className="font-bold text-accent">{attendance.attendedClasses}</span>
              </div>
              <div className="flex justify-between p-3 bg-secondary rounded-lg">
                <span className="font-medium">Classes Missed</span>
                <span className="font-bold text-destructive">
                  {attendance.totalClasses - attendance.attendedClasses}
                </span>
              </div>
              <div className="flex justify-between p-3 bg-gradient-primary text-primary-foreground rounded-lg">
                <span className="font-medium">Current Percentage</span>
                <span className="font-bold">
                  {currentPercentage.toFixed(2)}%
                </span>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Danger Zone */}
        <Card className="shadow-soft border-destructive">
          <CardHeader>
            <CardTitle className="text-destructive">Danger Zone</CardTitle>
            <CardDescription>
              Irreversible actions - proceed with caution
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button 
              onClick={handleResetData} 
              variant="destructive"
              className="w-full"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Reset All Data
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default Settings;
