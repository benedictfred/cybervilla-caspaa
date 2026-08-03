import Toast, {
  ErrorToast,
  SuccessToast,
  ToastConfig,
  ToastProps,
} from "react-native-toast-message";

const toastConfig: ToastConfig = {
  success: (props) => (
    <SuccessToast
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
