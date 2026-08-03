import Sidebar from "@/components/layouts/sidebar";
import TopNav from "@/components/layouts/top-nav";
import { Toaster } from "@/components/ui/toaster";
import {
  Figtree_400Regular,
  Figtree_500Medium,
  Figtree_600SemiBold,
  Figtree_700Bold,
  Figtree_800ExtraBold,
  useFonts,
} from "@expo-google-fonts/figtree";
import { Slot } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect, useState } from "react";
import { View } from "react-native";
import "./global.css";

SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [loaded, error] = useFonts({
    Figtree_400Regular,
    Figtree_500Medium,
    Figtree_600SemiBold,
    Figtree_700Bold,
    Figtree_800ExtraBold,
  });

  useEffect(() => {
    if (loaded || error) {
      SplashScreen.hideAsync();
    }
  }, [loaded, error]);

  if (!loaded && !error) {
    return null;
  }

  return (
    <View className="flex-1 flex-row bg-[#F8FAFC] h-screen font-figtree">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      <View className="flex-1">
        <TopNav onToggleSidebar={() => setIsSidebarOpen(!isSidebarOpen)} />
        <View className="flex-1 overflow-hidden">
          <Slot />
        </View>
      </View>
      <Toaster />
    </View>
  );
}
