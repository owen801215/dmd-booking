type TimeSlot = {
  time: string; // HH:mm
  available: boolean;
};

type Schedule = {
  startTime: string; // HH:mm
  endTime: string; // HH:mm
};

type BlockedTime = {
  startTime: string | null; // HH:mm or null for full day
  endTime: string | null;   // HH:mm or null for full day
};

type Booking = {
  startTime: string; // HH:mm
  endTime: string; // HH:mm
};

/**
 * 將 "HH:mm" 字串轉換為當天的分鐘數 (0 - 1440)
 */
function timeToMinutes(timeStr: string): number {
  const [hours, minutes] = timeStr.split(':').map(Number);
  return hours * 60 + minutes;
}

/**
 * 將分鐘數轉換回 "HH:mm"
 */
function minutesToTime(minutes: number): string {
  const h = Math.floor(minutes / 60).toString().padStart(2, '0');
  const m = (minutes % 60).toString().padStart(2, '0');
  return `${h}:${m}`;
}

/**
 * 🌟 核心：動態時段運算邏輯
 * @param date 目標日期
 * @param schedule 設計師當日班表 (若無代表沒上班)
 * @param duration 預計服務時長 (分鐘)
 * @param blockedTimes 該設計師與全店當日的例外阻擋時間
 * @param bookings 該設計師當日已確認的預約
 * @param interval 每次時段的間隔 (預設 30 分鐘)
 */
export function calculateAvailableSlots(
  schedule: Schedule | null,
  duration: number,
  blockedTimes: BlockedTime[],
  bookings: Booking[],
  interval: number = 30
): TimeSlot[] {
  if (!schedule) return [];

  const slots: TimeSlot[] = [];
  const scheduleStart = timeToMinutes(schedule.startTime);
  const scheduleEnd = timeToMinutes(schedule.endTime);

  // 若有全天休假的 blockedTime，直接回傳空陣列
  const isFullDayBlocked = blockedTimes.some(bt => !bt.startTime || !bt.endTime);
  if (isFullDayBlocked) return [];

  // 合併所有被佔用的區間 (Blocked Times + Bookings)
  const occupiedPeriods = [
    ...blockedTimes.map(bt => ({
      start: timeToMinutes(bt.startTime!),
      end: timeToMinutes(bt.endTime!)
    })),
    ...bookings.map(b => ({
      start: timeToMinutes(b.startTime),
      end: timeToMinutes(b.endTime)
    }))
  ];

  // 以 30 分鐘為單位切塊檢查
  for (let currentStart = scheduleStart; currentStart + duration <= scheduleEnd; currentStart += interval) {
    const currentEnd = currentStart + duration;
    
    // 檢查這個區段 [currentStart, currentEnd] 是否與任何 occupiedPeriods 重疊
    const isConflict = occupiedPeriods.some(period => {
      return (
        (currentStart >= period.start && currentStart < period.end) || // 開始時間落在佔用區間內
        (currentEnd > period.start && currentEnd <= period.end) ||     // 結束時間落在佔用區間內
        (currentStart <= period.start && currentEnd >= period.end)     // 完全包覆佔用區間
      );
    });

    slots.push({
      time: minutesToTime(currentStart),
      available: !isConflict
    });
  }

  // 補足後方空間不夠 `duration` 的時段標示為 unavailable (例如剩20分鐘但服務需30分鐘)
  for(let currentStart = scheduleEnd - (scheduleEnd % interval || interval); currentStart < scheduleEnd; currentStart += interval) {
      if(currentStart + duration > scheduleEnd) {
        slots.push({
            time: minutesToTime(currentStart),
            available: false
        })
      }
  }

  // 依時間排序去重
  return slots.sort((a, b) => timeToMinutes(a.time) - timeToMinutes(b.time)).filter((v,i,a)=>a.findIndex(t=>(t.time === v.time))===i);
}
