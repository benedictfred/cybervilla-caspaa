import { cn } from "@/lib/utils";
import { Calendar as CalendarIcon } from "lucide-react-native";
import { useState } from "react";
import {
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { Calendar as RNCalendar } from "react-native-calendars";

export interface DatePickerProps {
  value?: string;
  onChange: (date: string) => void;
  error?: boolean;
  placeholder?: string;
}

const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function DatePicker({
  value,
  onChange,
  error,
  placeholder = "YYYY-MM-DD",
}: DatePickerProps) {
  const [showCalendar, setShowCalendar] = useState(false);

  const [currentDate, setCurrentDate] = useState(
    value || new Date().toISOString().split("T")[0],
  );

  const [showYearPicker, setShowYearPicker] = useState(false);
  const [showMonthPicker, setShowMonthPicker] = useState(false);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 40 }, (_, i) => currentYear - i);

  const handleDateChange = (newDateString: string) => {
    setCurrentDate(newDateString);
  };

  const setYear = (year: number) => {
    const d = new Date(currentDate);
    d.setFullYear(year);
    handleDateChange(d.toISOString().split("T")[0]);
    setShowYearPicker(false);
  };

  const setMonth = (monthIndex: number) => {
    const d = new Date(currentDate);
    d.setMonth(monthIndex);
    handleDateChange(d.toISOString().split("T")[0]);
    setShowMonthPicker(false);
  };

  return (
    <>
      <Pressable
        className={cn(
          "flex-row items-center border rounded-xl bg-white px-4 h-11 w-full",
          error ? "border-red-500" : "border-gray-200",
        )}
        onPress={() => setShowCalendar(true)}
      >
        <CalendarIcon size={18} color="#8A94A6" className="mr-3" />
        <Text
          className={cn(
            "text-sm font-figtree",
            value ? "text-primary" : "text-[#8A94A6]",
          )}
        >
          {value || placeholder}
        </Text>
      </Pressable>

      <Modal visible={showCalendar} transparent animationType="fade">
        <Pressable
          className="flex-1 justify-center items-center bg-black/40"
          onPress={() => {
            setShowCalendar(false);
            setShowYearPicker(false);
            setShowMonthPicker(false);
          }}
        >
          <Pressable
            className="bg-white rounded-2xl p-4 shadow-xl max-w-sm w-[90%] overflow-hidden"
            onPress={(e) => e.stopPropagation()}
            style={Platform.OS === "web" ? { maxHeight: 500 } : {}}
          >
            {showYearPicker ? (
              <View className="h-[350px]">
                <View className="flex-row justify-between items-center mb-4 pb-2 border-b border-gray-100">
                  <Text className="font-figtree-bold text-lg text-primary">
                    Select Year
                  </Text>
                  <Pressable onPress={() => setShowYearPicker(false)}>
                    <Text className="text-primary font-figtree-semibold">
                      Cancel
                    </Text>
                  </Pressable>
                </View>
                <ScrollView showsVerticalScrollIndicator={false}>
                  <View className="flex-row flex-wrap justify-between">
                    {years.map((y) => (
                      <Pressable
                        key={y}
                        className={cn(
                          "w-[31%] py-3 mb-2 rounded-lg items-center",
                          new Date(currentDate).getFullYear() === y
                            ? "bg-primary"
                            : "bg-[#F8FAFC]",
                        )}
                        onPress={() => setYear(y)}
                      >
                        <Text
                          className={cn(
                            "font-figtree-medium",
                            new Date(currentDate).getFullYear() === y
                              ? "text-white"
                              : "text-primary",
                          )}
                        >
                          {y}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                </ScrollView>
              </View>
            ) : showMonthPicker ? (
              <View className="h-[350px]">
                <View className="flex-row justify-between items-center mb-4 pb-2 border-b border-gray-100">
                  <Text className="font-figtree-bold text-lg text-primary">
                    Select Month
                  </Text>
                  <Pressable onPress={() => setShowMonthPicker(false)}>
                    <Text className="text-primary font-figtree-semibold">
                      Cancel
                    </Text>
                  </Pressable>
                </View>
                <ScrollView showsVerticalScrollIndicator={false}>
                  <View className="flex-row flex-wrap justify-between">
                    {MONTHS.map((m, i) => (
                      <Pressable
                        key={m}
                        className={cn(
                          "w-[31%] py-3 mb-2 rounded-lg items-center",
                          new Date(currentDate).getMonth() === i
                            ? "bg-primary"
                            : "bg-[#F8FAFC]",
                        )}
                        onPress={() => setMonth(i)}
                      >
                        <Text
                          className={cn(
                            "font-figtree-medium",
                            new Date(currentDate).getMonth() === i
                              ? "text-white"
                              : "text-primary",
                          )}
                        >
                          {m.substring(0, 3)}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                </ScrollView>
              </View>
            ) : (
              <RNCalendar
                key={currentDate} // Force re-render when current date changes explicitly from pickers
                current={currentDate}
                onDayPress={(day: any) => {
                  onChange(day.dateString);
                  setShowCalendar(false);
                }}
                onMonthChange={(date: any) => {
                  setCurrentDate(date.dateString);
                }}
                markedDates={{
                  [value || ""]: {
                    selected: true,
                    marked: true,
                    selectedColor: "#0A2540",
                  },
                }}
                maxDate={new Date().toISOString().split("T")[0]}
                theme={{
                  todayTextColor: "#0A2540",
                  arrowColor: "#0A2540",
                  textDayFontFamily: "Figtree_400Regular",
                  textDayHeaderFontFamily: "Figtree_500Medium",
                }}
                renderHeader={() => {
                  const [yearStr, monthStr] = currentDate.split("-");
                  const year = parseInt(yearStr, 10);
                  const month = parseInt(monthStr, 10) - 1; // 0-indexed

                  return (
                    <View className="flex-row items-center justify-center gap-2 px-4 mb-2">
                      <Pressable
                        className="px-3 py-1.5 bg-[#F2F5F8] rounded-lg border border-gray-100 flex-1 items-center"
                        onPress={() => setShowMonthPicker(true)}
                      >
                        <Text className="font-figtree-semibold text-primary">
                          {MONTHS[month] || MONTHS[0]}
                        </Text>
                      </Pressable>
                      <Pressable
                        className="px-3 py-1.5 bg-[#F2F5F8] rounded-lg border border-gray-100 flex-1 items-center"
                        onPress={() => setShowYearPicker(true)}
                      >
                        <Text className="font-figtree-semibold text-primary">
                          {year || new Date().getFullYear()}
                        </Text>
                      </Pressable>
                    </View>
                  );
                }}
              />
            )}
          </Pressable>
        </Pressable>
      </Modal>
    </>
  );
}
