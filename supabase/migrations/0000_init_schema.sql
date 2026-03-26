-- =====================
-- 1. 基礎資料表 (設計師與服務項目)
-- =====================
CREATE TABLE stylists (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  nickname TEXT,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE TABLE services (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  duration INT NOT NULL, -- 預設服務長度(分鐘)
  price INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);-- =====================
-- 2. 設計師常規班表
-- =====================
CREATE TABLE stylist_schedules (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stylist_id    UUID NOT NULL REFERENCES stylists(id) ON DELETE CASCADE,
  day_of_week   INT NOT NULL CHECK (day_of_week BETWEEN 0 AND 6), -- 0=週日, 1=週一...
  start_time    TIME NOT NULL, -- e.g., '11:00'
  end_time      TIME NOT NULL, -- e.g., '20:00'
  is_working    BOOLEAN NOT NULL DEFAULT TRUE,
  UNIQUE (stylist_id, day_of_week)
);

-- =====================
-- 3. 封鎖日期與特定時段 (請假/公休/開會)
-- =====================
CREATE TABLE blocked_times (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stylist_id  UUID REFERENCES stylists(id) ON DELETE CASCADE, -- NULL = 全店
  date        DATE NOT NULL,
  start_time  TIME, -- 若為 NULL 代表全天休假
  end_time    TIME,
  reason      TEXT
);

-- =====================
-- 4. 預約主表 (加入取消 Token 與預期結束時間)
-- =====================
CREATE TABLE bookings (
  id               UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  stylist_id       UUID NOT NULL REFERENCES stylists(id),
  service_id       UUID NOT NULL REFERENCES services(id),
  
  -- 時間資訊
  date             DATE NOT NULL,
  start_time       TIME NOT NULL,
  end_time         TIME NOT NULL, -- 由服務時長自動推算寫入，方便資料庫比對
  
  -- 客戶資訊
  customer_name    TEXT NOT NULL,
  customer_phone   TEXT NOT NULL,
  customer_email   TEXT,
  notes            TEXT,
  
  -- 狀態與授權
  status           TEXT NOT NULL DEFAULT 'confirmed' 
                   CHECK (status IN ('confirmed', 'cancelled', 'completed')),
  cancel_token     UUID NOT NULL DEFAULT gen_random_uuid(), -- 供客戶免登入取消使用
  
  created_at       TIMESTAMPTZ NOT NULL DEFAULT now()
);

-- =====================
-- 5. Supabase RPC: 安全建立預約 (防撞核心)
-- =====================
CREATE OR REPLACE FUNCTION safe_create_booking(
  p_stylist_id UUID,
  p_service_id UUID,
  p_date DATE,
  p_start_time TIME,
  p_end_time TIME,
  p_customer_name TEXT,
  p_customer_phone TEXT,
  p_customer_email TEXT
) RETURNS JSON AS $$
DECLARE
  conflict_exists BOOLEAN;
  new_booking_id UUID;
BEGIN
  -- 1. 鎖定並檢查是否有重疊的已確認預約
  SELECT EXISTS (
    SELECT 1 FROM bookings
    WHERE stylist_id = p_stylist_id
      AND date = p_date
      AND status = 'confirmed'
      AND (
        (p_start_time >= start_time AND p_start_time < end_time) OR
        (p_end_time > start_time AND p_end_time <= end_time) OR
        (p_start_time <= start_time AND p_end_time >= end_time)
      )
  ) INTO conflict_exists;

  -- 2. 如果有衝突，擲出錯誤
  IF conflict_exists THEN
    RAISE EXCEPTION '該時段已被預約';
  END IF;

  -- 3. 無衝突，安全寫入
  INSERT INTO bookings (stylist_id, service_id, date, start_time, end_time, customer_name, customer_phone, customer_email)
  VALUES (p_stylist_id, p_service_id, p_date, p_start_time, p_end_time, p_customer_name, p_customer_phone, p_customer_email)
  RETURNING id INTO new_booking_id;

  RETURN json_build_object('success', true, 'booking_id', new_booking_id);
END;
$$ LANGUAGE plpgsql;
