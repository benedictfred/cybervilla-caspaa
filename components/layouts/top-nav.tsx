import { Bell, Search, Wifi } from "lucide-react-native";
import { Platform, Pressable, Text, TextInput, View } from "react-native";

export function TopNav() {
  return (
    <View className="h-[88px] bg-white border-b border-gray-100 flex-row items-center justify-between px-8">
      <View>
        <Text className="text-xl font-bold text-primary font-figtree-bold">
          Students
        </Text>
      </View>

      <View className="flex-row items-center flex-1 justify-center px-10">
        <View className="flex-row items-center bg-[#F1F5F9] border border-gray-200 rounded-md px-4 py-2.5 w-[480px]">
          <Search size={18} color="#8A94A6" />
          <TextInput
            placeholder="Search students, staff, classes..."
            placeholderTextColor="#8A94A6"
            className="flex-1 ml-2 text-sm text-gray-700 outline-none font-figtree"
            style={
              Platform.OS === "web" ? ({ outlineStyle: "none" } as any) : {}
            }
          />
          <View className="bg-white border border-gray-200 rounded px-2 py-0.5 ml-2">
            <Text className="text-gray-400 text-xs">/</Text>
          </View>
        </View>
      </View>

      <View className="flex-row items-center gap-6">
        <Pressable>
          <Bell size={20} color="#8A94A6" />
        </Pressable>
        <Pressable>
          <Wifi size={20} color="#10B981" />
        </Pressable>
        <View className="flex-row items-center gap-3 ml-2 border-l border-gray-100 pl-6">
          <View className="w-10 h-10 rounded-full bg-primary items-center justify-center">
            <Text className="text-white font-bold text-sm font-figtree-medium">
              MO
            </Text>
          </View>
          <View>
            <Text className="text-sm font-bold text-primary font-figtree-semibold">
              Mr. Olusegun
            </Text>
            <Text className="text-xs text-gray-400 font-figtree">
              School Proprietor
            </Text>
          </View>
        </View>
      </View>
    </View>
  );
}
