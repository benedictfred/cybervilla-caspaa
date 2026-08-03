import { Button } from "@/components/ui/button";
import { useAsyncStorage } from "@/hooks/useAsyncStorage";
import { cn } from "@/lib/utils";
import { Download, Plus, TrendingUp, Upload } from "lucide-react-native";
import { ScrollView, Text, View, useWindowDimensions } from "react-native";

const tabs = [
  { name: "Students", active: true },
  { name: "New Enrollment" },
  { name: "Returning" },
  { name: "Admissions", badge: 4 },
  { name: "Suspensions" },
  { name: "Alumni" },
  { name: "Analytics" },
];

export default function StudentsHeader({
  onAddStudent,
  onBulkUpload,
}: {
  onAddStudent?: () => void;
  onBulkUpload?: () => void;
}) {
  const [students] = useAsyncStorage<any[]>("students", []);
  const totalStudents = students.length;
  const noOfBoys = students.filter(
    (el) => el.gender.toLowerCase() === "male",
  ).length;
  const noOfGirls = totalStudents - noOfBoys;
  const percentageOfBoys = Math.round((noOfBoys / totalStudents) * 100) || 0;
  const percentageOfGirls = Math.round((noOfGirls / totalStudents) * 100) || 0;
  const { width } = useWindowDimensions();
  const isMobile = width < 1024;

  const ActionButtons = (
    <>
      <Button variant="secondary" className="gap-2 px-4 py-2 h-10">
        <TrendingUp size={16} color="#0A2540" />
        <Text className="font-figtree-semibold text-primary text-sm">
          Bulk Promote
        </Text>
      </Button>
      <Button variant="secondary" className="gap-2 px-4 py-2 h-10">
        <Download size={16} color="#0A2540" />
        <Text className="font-figtree-semibold text-primary text-sm">
          Student Report
        </Text>
      </Button>
      <Button
        variant="secondary"
        className="gap-2 px-4 py-2 h-10"
        onPress={onBulkUpload}
      >
        <Upload size={16} color="#0A2540" />
        <Text className="font-figtree-semibold text-primary text-sm">
          Bulk Upload
        </Text>
      </Button>
      <Button
        className="gap-2 px-5 py-2 h-10 bg-primary"
        onPress={onAddStudent}
      >
        <Plus size={16} color="#FFFFFF" />
        <Text className="font-figtree-semibold text-white text-sm">
          Add Student
        </Text>
      </Button>
    </>
  );

  const TabsContent = (
    <>
      {tabs.map((tab) => (
        <View
          key={tab.name}
          className={cn(
            "pb-2 border-b-2",
            tab.active ? "border-[#00B386]" : "border-transparent",
          )}
        >
          <View className="flex-row items-center gap-2">
            <Text
              className={cn(
                "font-figtree-semibold text-sm",
                tab.active ? "text-primary" : "text-[#8A94A6]",
              )}
            >
              {tab.name}
            </Text>
            {tab.badge && (
              <View className="bg-[#FFE5E5] px-1.5 py-0.5 rounded-full">
                <Text className="text-[#E02424] text-[10px] font-figtree-bold">
                  {tab.badge}
                </Text>
              </View>
            )}
          </View>
        </View>
      ))}
    </>
  );

  return (
    <View className="px-4 sm:px-8 py-8">
      <View
        className={cn(
          "justify-between mb-8",
          isMobile ? "flex-col gap-4" : "flex-row items-center",
        )}
      >
        <View>
          <Text className="text-2xl sm:text-3xl font-figtree-bold text-primary mb-1">
            Students
          </Text>
          <Text className="text-[#8A94A6] font-figtree text-xs sm:text-sm">
            Students, admissions, alumni, enrollment trends
          </Text>
        </View>

        {isMobile ? (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="flex-row items-center gap-3 pr-4">
              {ActionButtons}
            </View>
          </ScrollView>
        ) : (
          <View className="flex-row items-center gap-3">{ActionButtons}</View>
        )}
      </View>

      {isMobile ? (
        <View className="border-b border-gray-100 mb-8 sm:mb-10">
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="flex-row items-center gap-6 sm:gap-8 pr-8">
              {TabsContent}
            </View>
          </ScrollView>
        </View>
      ) : (
        <View className="flex-row items-center border-b border-gray-100 gap-8 mb-10">
          {TabsContent}
        </View>
      )}

      <View className="flex-col bg-white p-4 sm:p-5 rounded-lg">
        <View
          className={cn(
            "justify-between mb-4",
            isMobile ? "flex-col items-start gap-3" : "flex-row items-center",
          )}
        >
          <Text className="font-figtree-semibold text-primary">
            Gender Split
          </Text>
          <View className="flex-row items-center gap-4 sm:gap-6">
            <View className="flex-row items-center gap-2">
              <View className="w-2.5 h-2.5 rounded-full bg-primary" />
              <Text className="font-figtree text-sm text-[#8A94A6]">
                <Text className="font-figtree-semibold text-primary">
                  {noOfBoys}
                </Text>{" "}
                boy{noOfBoys > 1 && "s"} ({percentageOfBoys}%)
              </Text>
            </View>
            <View className="flex-row items-center gap-2">
              <View className="w-2.5 h-2.5 rounded-full bg-[#8A94A6]" />
              <Text className="font-figtree text-sm text-[#8A94A6]">
                <Text className="font-figtree-semibold text-primary">
                  {noOfGirls}
                </Text>{" "}
                girl{noOfGirls > 1 && "s"} ({percentageOfGirls}%)
              </Text>
            </View>
          </View>
        </View>
        <View className="h-3 rounded-full flex-row overflow-hidden bg-[#F2F5F8]">
          <View
            className="bg-primary h-full"
            style={{
              width: `${percentageOfBoys}%`,
            }}
          />
          <View
            className="bg-[#94A7BF] h-full"
            style={{
              width: `${percentageOfGirls}%`,
            }}
          />
        </View>
      </View>
    </View>
  );
}
