import { Image } from "expo-image";
import { usePathname } from "expo-router";
import {
  Bell,
  BookOpen,
  Box,
  Calendar,
  ChartNoAxesColumn,
  Folder,
  LayoutDashboard,
  LogOut,
  MessageCircle,
  Package,
  Users,
  Volleyball,
} from "lucide-react-native";
import { Pressable, ScrollView, Text, View } from "react-native";

const MENU_ITEMS = [
  { name: "Dashboard", icon: LayoutDashboard, route: "/dashboard" },
  { name: "Students", icon: Users, route: "/" },
  { name: "Admissions", icon: Users, route: "/admissions" },
  { name: "Front Desk", icon: Bell, route: "/front-desk" },
  { name: "Staff & HR", icon: Folder, route: "/staff-hr" },
  { name: "Academic", icon: BookOpen, route: "/academic" },
  { name: "Finance", icon: Package, route: "/finance" },
  { name: "School Store", icon: Box, route: "/school-store" },
  { name: "Reports", icon: ChartNoAxesColumn, route: "/reports" },
  { name: "Operations", icon: Package, route: "/operations" },
  { name: "Communications", icon: MessageCircle, route: "/communications" },
  { name: "Calendar", icon: Calendar, route: "/calendar" },
  {
    name: "Inter House Points",
    icon: Volleyball,
    route: "/inter-house-points",
  },
];

export function Sidebar() {
  const pathname = usePathname();

  return (
    <View className="w-[260px] bg-white border-r border-gray-100 flex-col h-[85%]">
      <View className="px-6 py-6 border-b border-gray-100 justify-center">
        <Image
          source={require("../../assets/images/caspaa.svg")}
          style={{ width: 140, height: 32 }}
        />
        <Text className="text-gray-400 text-xs mt-2 font-figtree">
          School Proprietor
        </Text>
      </View>

      <ScrollView
        className="flex-1 px-4 py-6"
        showsVerticalScrollIndicator={false}
      >
        {MENU_ITEMS.map((item) => {
          const isActive =
            pathname === item.route ||
            (pathname === "/" && item.name === "Students");
          const Icon = item.icon;
          return (
            <Pressable
              key={item.name}
              className={`flex-row items-center gap-3 px-4 py-3 rounded-xl mb-1 ${isActive ? "bg-[#F2F5F8]" : ""}`}
            >
              <Icon
                size={20}
                color={isActive ? "#0A2540" : "#8A94A6"}
                strokeWidth={isActive ? 2.5 : 2}
              />
              <Text
                className={`font-medium ${isActive ? "text-primary font-figtree-semibold" : "text-[#8A94A6] font-figtree-medium"}`}
              >
                {item.name}
              </Text>
            </Pressable>
          );
        })}
      </ScrollView>

      <View className="px-4 py-3 border-t border-gray-100">
        <Pressable className="flex-row items-center gap-3 px-4 py-3">
          <LogOut size={20} color="#E02424" />
          <Text className="text-[#E02424] font-medium">Sign out</Text>
        </Pressable>
      </View>
    </View>
  );
}
