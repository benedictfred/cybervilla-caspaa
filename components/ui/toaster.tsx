import Toast, {
  BaseToast,
  ErrorToast,
  ToastConfig,
  ToastProps,
} from "react-native-toast-message";

const toastConfig: ToastConfig = {
  success: (props) => (
    <BaseToast
      {...props}
      text1Style={{
        fontFamily: "Figtree_400Regular",
      }}
      text2Style={{
        fontFamily: "Figtree_400Regular",
      }}
    />
  ),
  error: (props) => (
    <ErrorToast
      {...props}
      text1Style={{
        fontFamily: "Figtree_400Regular",
      }}
      text2Style={{
        fontFamily: "Figtree_400Regular",
      }}
    />
  ),
};

export function Toaster(props: ToastProps) {
  return <Toast {...props} config={toastConfig} />;
}
