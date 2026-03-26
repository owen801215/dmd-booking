'use server'

import { createClient } from '@/lib/supabase/server'
// import { sendBookingConfirmation } from '@/lib/notifications/email'
// import { sendLinePushMessage } from '@/lib/notifications/line'

export type BookingFormData = {
  stylistId: string;
  serviceId: string;
  date: string; // YYYY-MM-DD
  startTime: string; // HH:mm
  duration: number; // 分鐘數
  customerName: string;
  customerPhone: string;
  customerEmail?: string;
};

/**
 * 輔助函數：計算預期結束時間
 */
function calculateEndTime(startTime: string, durationMinutes: number): string {
  const [hours, minutes] = startTime.split(':').map(Number);
  const totalMinutes = hours * 60 + minutes + durationMinutes;
  const endHours = Math.floor(totalMinutes / 60).toString().padStart(2, '0');
  const endMinutes = (totalMinutes % 60).toString().padStart(2, '0');
  return `${endHours}:${endMinutes}:00`;
}

/**
 * Server Action: 處理建立預約
 */
export async function submitBooking(formData: BookingFormData) {
  const supabase = await createClient()
  
  try {
    const p_end_time = calculateEndTime(formData.startTime, formData.duration);

    // 1. 呼叫 Supabase RPC 進行防撞期寫入 (Safe Double Booking Lock)
    const { data, error } = await supabase.rpc('safe_create_booking', {
      p_stylist_id: formData.stylistId,
      p_service_id: formData.serviceId,
      p_date: formData.date,
      p_start_time: `${formData.startTime}:00`,
      p_end_time: p_end_time,
      p_customer_name: formData.customerName,
      p_customer_phone: formData.customerPhone,
      p_customer_email: formData.customerEmail || null
    })

    if (error) {
      throw new Error(error.message)
    }

    // 2. 取得完整預約資料 (包含自動產生的 cancel_token)
    const { data: booking, error: fetchError } = await supabase
      .from('bookings')
      .select('*')
      .eq('id', data.booking_id)
      .single()

    if (fetchError) {
      console.error('Fetch created booking failed:', fetchError);
    }

    // 3. 非同步發送通知 (不阻塞前端回應)
    // 若有實作這些函式可以取消註解
    /*
    Promise.all([
      sendBookingConfirmation(booking),
      sendLinePushMessage(booking)
    ]).catch(console.error)
    */

    return { success: true, bookingId: data.booking_id }
    
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

/**
 * Server Action: 處理自主取消預約
 */
export async function cancelBookingByToken(cancelToken: string) {
  const supabase = await createClient()

  try {
    // 檢查 token 有效性並更新為 cancelled
    const { data, error } = await supabase
      .from('bookings')
      .update({ status: 'cancelled' })
      .eq('cancel_token', cancelToken)
      .eq('status', 'confirmed') // 確保只有 confirmed 才能取消
      .select('id, stylist_id, date, start_time, customer_name')
      .single()

    if (error || !data) {
      throw new Error('無效的取消請求或該預約已取消');
    }

    // 可於此處加入發送 LINE/Email 通知店家「客人已抽單」的邏輯

    return { success: true, booking: data }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}
