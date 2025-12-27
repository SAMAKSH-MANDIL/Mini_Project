import { useState, useEffect } from "react";

interface AttendanceData {
  totalClasses: number;
  attendedClasses: number;
  targetPercentage: number;
}

interface HolidayImpact {
  day: number;
  percentage: number;
  decrement: number;
  totalClasses: number;
}

interface TargetCalculation {
  isAboveTarget: boolean;
  classesDifference: number;
  daysEstimate: number;
  resultingPercentage: number;
}

const STORAGE_KEY = "attendance-data";

const defaultData: AttendanceData = {
  totalClasses: 0,
  attendedClasses: 0,
  targetPercentage: 75,
};

export const useAttendance = () => {
  const [attendance, setAttendance] = useState<AttendanceData>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : defaultData;
  });

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(attendance));
  }, [attendance]);

  const updateAttendance = (updates: Partial<AttendanceData>) => {
    setAttendance(prev => ({ ...prev, ...updates }));
  };

  const getCurrentPercentage = () => {
    if (attendance.totalClasses === 0) return 0;
    return (attendance.attendedClasses / attendance.totalClasses) * 100;
  };

  const calculateHolidayImpact = (futureHolidays: number, classesPerDay: number): HolidayImpact[] => {
    const results: HolidayImpact[] = [];
    let previousPercentage = getCurrentPercentage();

    for (let day = 1; day <= futureHolidays; day++) {
      const newTotal = attendance.totalClasses + (classesPerDay * day);
      const newPercentage = (attendance.attendedClasses / newTotal) * 100;
      const decrement = previousPercentage - newPercentage;

      results.push({
        day,
        percentage: newPercentage,
        decrement,
        totalClasses: newTotal,
      });

      previousPercentage = newPercentage;
    }

    return results;
  };

  const calculateTargetAchievement = (targetPercentage: number, classesPerDay: number): TargetCalculation => {
    const currentPercentage = getCurrentPercentage();
    const isAboveTarget = currentPercentage >= targetPercentage;

    if (isAboveTarget) {
      // Calculate how many classes can be skipped
      let classesCanSkip = 0;
      let futureClasses = 0;
      
      while (true) {
        const newTotal = attendance.totalClasses + futureClasses;
        const newAttended = attendance.attendedClasses;
        const newPercentage = (newAttended / newTotal) * 100;
        
        if (newPercentage < targetPercentage) break;
        
        classesCanSkip = futureClasses;
        futureClasses++;
      }

      return {
        isAboveTarget: true,
        classesDifference: classesCanSkip,
        daysEstimate: Math.floor(classesCanSkip / classesPerDay),
        resultingPercentage: (attendance.attendedClasses / (attendance.totalClasses + classesCanSkip)) * 100,
      };
    } else {
      // Calculate how many classes need to attend
      let classesNeeded = 0;
      
      while (true) {
        const newTotal = attendance.totalClasses + classesNeeded;
        const newAttended = attendance.attendedClasses + classesNeeded;
        const newPercentage = (newAttended / newTotal) * 100;
        
        if (newPercentage >= targetPercentage) break;
        
        classesNeeded++;
      }

      return {
        isAboveTarget: false,
        classesDifference: classesNeeded,
        daysEstimate: Math.ceil(classesNeeded / classesPerDay),
        resultingPercentage: ((attendance.attendedClasses + classesNeeded) / (attendance.totalClasses + classesNeeded)) * 100,
      };
    }
  };

  const resetAttendance = () => {
    setAttendance(defaultData);
  };

  return {
    attendance,
    updateAttendance,
    getCurrentPercentage,
    calculateHolidayImpact,
    calculateTargetAchievement,
    resetAttendance,
  };
};
