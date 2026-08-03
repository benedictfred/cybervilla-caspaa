import AsyncStorage from "@react-native-async-storage/async-storage";
import { useCallback, useEffect, useState } from "react";
import { DeviceEventEmitter } from "react-native";

export function useAsyncStorage<T>(key: string, initialValue: T) {
  const [storedValue, setStoredValue] = useState<T>(initialValue);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    async function loadStoredValue() {
      try {
        const item = await AsyncStorage.getItem(key);
        if (item) {
          setStoredValue(JSON.parse(item));
        }
      } catch (error) {
        console.warn(`Error reading AsyncStorage key "${key}":`, error);
      } finally {
        setIsReady(true);
      }
    }
    loadStoredValue();

    const subscription = DeviceEventEmitter.addListener(
      `async_storage_${key}`,
      (newValue) => {
        setStoredValue(newValue);
      },
    );

    return () => {
      subscription.remove();
    };
  }, [key]);

  const setValue = useCallback(
    async (value: T | ((val: T) => T)) => {
      try {
        const valueToStore =
          value instanceof Function ? value(storedValue) : value;
        setStoredValue(valueToStore);
        await AsyncStorage.setItem(key, JSON.stringify(valueToStore));
        // Broadcast the update to all other hooks listening to this key
        DeviceEventEmitter.emit(`async_storage_${key}`, valueToStore);
      } catch (error) {
        console.warn(`Error setting AsyncStorage key "${key}":`, error);
      }
    },
    [key, storedValue],
  );

  return [storedValue, setValue, isReady] as const;
}
