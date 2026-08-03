import { Button } from "@/components/ui/button";
import { Dropdown } from "@/components/ui/dropdown";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { DatePicker } from "@/components/ui/date-picker";
import { Input } from "@/components/ui/input";
import { Toaster } from "@/components/ui/toaster";
import { useAsyncStorage } from "@/hooks/useAsyncStorage";
import {
  ACTIVITIES,
  ADMISSION_TYPE_OPTIONS,
  ARM_OPTIONS,
  BLOOD_GROUP_OPTIONS,
  CLASS_OPTIONS,
  DOCUMENTS,
  FEE_CATEGORY_OPTIONS,
  GENDER_OPTIONS,
  HOUSE_OPTIONS,
  PARENT_OPTIONS,
  SESSION_OPTIONS,
  STATUS_OPTIONS,
} from "@/lib/constants";
import {
  addStudentSchema,
  type AddStudentFormValues,
} from "@/lib/form-schemas";
import { cn } from "@/lib/utils";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  BookOpen,
  Calendar as CalendarIcon,
  Check,
  Image as ImageIcon,
  Paperclip,
  Upload,
  X,
} from "lucide-react-native";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
} from "react-native";
import { Calendar as RNCalendar } from "react-native-calendars";
import Toast from "react-native-toast-message";
export interface AddStudentModalProps {
  visible: boolean;
  onClose: () => void;
  initialData?: any;
}

export default function AddStudentModal({
  visible,
  onClose,
  initialData,
}: AddStudentModalProps) {
  const [students, setStudents] = useAsyncStorage<any[]>("students", []);
  const [showCalendar, setShowCalendar] = useState(false);

  const form = useForm<AddStudentFormValues>({
    resolver: zodResolver(addStudentSchema),
    defaultValues: {
      fullName: "",
      admissionNumber: "BL/2024/020",
      dateOfBirth: "",
      gender: "",
      class: "",
      arm: "",
      session: "",
      bloodGroup: "",
      house: "",
      allergies: "",
      feeCategory: "",
      parent: "",
      admissionType: "",
      activities: [],
      status: "Active",
    },
  });

  useEffect(() => {
    if (visible) {
      if (initialData) {
        form.reset(initialData);
      } else {
        form.reset({
          fullName: "",
          admissionNumber: "",
          dateOfBirth: "",
          gender: "",
          class: "",
          arm: "",
          session: "",
          bloodGroup: "",
          house: "",
          allergies: "",
          feeCategory: "",
          parent: "",
          admissionType: "",
          activities: [],
          status: "Active",
        });
      }
    }
  }, [visible, initialData, form]);

  const {
    formState: { errors },
  } = form;

  const onSubmit = (data: AddStudentFormValues) => {
    if (initialData) {
      const isDuplicate = students?.some(
        (s) =>
          s.id !== initialData.id &&
          s.admissionNumber.toLowerCase() ===
            data.admissionNumber.toLowerCase(),
      );

      if (isDuplicate) {
        form.setError("admissionNumber", {
          type: "manual",
          message: `The admission number ${data.admissionNumber} is already in use.`,
        });
        return;
      }

      const updatedStudents = (students || []).map((s) =>
        s.id === initialData.id ? { ...data, id: initialData.id } : s,
      );
      setStudents(updatedStudents);

      Toast.show({
        type: "success",
        text1: "Student Updated",
        text2: `${data.fullName} has been successfully updated.`,
      });

      setTimeout(() => {
        form.reset();
        onClose();
      }, 1000);
    } else {
      const isDuplicate = students?.some(
        (s) =>
          s.admissionNumber.toLowerCase() ===
          data.admissionNumber.toLowerCase(),
      );

      if (isDuplicate) {
        form.setError("admissionNumber", {
          type: "manual",
          message: `The admission number ${data.admissionNumber} is already in use.`,
        });
        return;
      }

      const newStudent = { ...data, id: Date.now().toString() };
      setStudents([...(students || []), newStudent]);

      Toast.show({
        type: "success",
        text1: "Student Added",
        text2: `${data.fullName} has been successfully added to the system.`,
      });

      setTimeout(() => {
        form.reset();
        onClose();
      }, 1000);
    }
  };

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View className="flex-1 bg-black/40 justify-center items-center">
        <View
          className="bg-white w-[95%] sm:w-[860px] h-[95%] sm:h-[90%] rounded-2xl overflow-hidden shadow-xl"
          style={Platform.OS === "web" ? { maxHeight: 850 } : {}}
        >
          <View className="px-4 sm:px-8 py-4 sm:py-6 border-b border-gray-100 flex-row items-center justify-between bg-white z-10">
            <Text className="text-xl font-figtree-bold text-primary">
              {initialData ? "Edit Student" : "Add New Student"}
            </Text>
            <Pressable
              onPress={onClose}
              className="p-2 -mr-2 rounded-full hover:bg-gray-100 cursor-pointer"
            >
              <X size={20} color="#8A94A6" />
            </Pressable>
          </View>

          <Form {...form}>
            <ScrollView
              className="flex-1 px-4 sm:px-8 py-4 sm:py-6"
              showsVerticalScrollIndicator={false}
            >
              <View className="flex-row items-center gap-6 mb-10">
                <View className="w-20 h-20 rounded-full bg-primary items-center justify-center">
                  <ImageIcon size={24} color="#FFFFFF" />
                </View>
                <View>
                  <Text className="font-figtree-semibold text-primary mb-1">
                    Student Photo
                  </Text>
                  <Text className="font-figtree text-xs text-[#8A94A6] mb-3">
                    JPG / PNG, max 1MB
                  </Text>
                  <Button
                    variant="secondary"
                    className="h-9 px-4 rounded-lg bg-[#F2F5F8] gap-2 border-0"
                  >
                    <Upload size={14} color="#0A2540" />
                    <Text className="font-figtree-semibold text-primary text-xs">
                      Choose photo
                    </Text>
                  </Button>
                </View>
              </View>
              <View className="flex-row flex-wrap justify-between">
                <FormField
                  control={form.control}
                  name="fullName"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel required>Full Name</FormLabel>
                      <Input
                        placeholder="e.g. Chiamaka Okafor"
                        value={field.value}
                        onChangeText={field.onChange}
                        error={!!fieldState.error}
                      />
                      <FormMessage error={fieldState.error} />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="admissionNumber"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel required>Admission Number</FormLabel>
                      <Input
                        value={field.value}
                        onChangeText={field.onChange}
                        error={!!fieldState.error}
                      />
                      <FormMessage error={fieldState.error} />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="dateOfBirth"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel required>Date of Birth</FormLabel>
                      <DatePicker
                        value={field.value}
                        onChange={field.onChange}
                        error={!!fieldState.error}
                      />

                      <FormMessage error={fieldState.error} />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="gender"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel required>Gender</FormLabel>
                      <Dropdown
                        value={field.value}
                        placeholder="Select Gender"
                        error={!!fieldState.error}
                        options={GENDER_OPTIONS}
                        onChange={field.onChange}
                      />
                      <FormMessage error={fieldState.error} />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="class"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel required>Class</FormLabel>
                      <Dropdown
                        value={field.value}
                        placeholder="Select Class"
                        error={!!fieldState.error}
                        options={CLASS_OPTIONS}
                        onChange={field.onChange}
                      />
                      <FormMessage error={fieldState.error} />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="arm"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel>Arm</FormLabel>
                      <Dropdown
                        value={field.value}
                        placeholder="Select Arm"
                        error={!!fieldState.error}
                        options={ARM_OPTIONS}
                        onChange={field.onChange}
                      />
                      <FormMessage error={fieldState.error} />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="session"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel>Session</FormLabel>
                      <Dropdown
                        value={field.value}
                        error={!!fieldState.error}
                        options={SESSION_OPTIONS}
                        onChange={field.onChange}
                      />
                      <FormMessage error={fieldState.error} />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="bloodGroup"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel>Blood Group</FormLabel>
                      <Dropdown
                        value={field.value}
                        error={!!fieldState.error}
                        options={BLOOD_GROUP_OPTIONS}
                        onChange={field.onChange}
                      />
                      <FormMessage error={fieldState.error} />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="house"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel>House</FormLabel>
                      <Dropdown
                        value={field.value}
                        error={!!fieldState.error}
                        options={HOUSE_OPTIONS}
                        onChange={field.onChange}
                      />
                      <FormMessage error={fieldState.error} />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="allergies"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel>Allergies / Medical Notes</FormLabel>
                      <Input
                        placeholder="e.g. Peanut allergy, asthma — or 'None'"
                        value={field.value}
                        onChangeText={field.onChange}
                        error={!!fieldState.error}
                      />
                      <FormMessage error={fieldState.error} />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="feeCategory"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel>Fee Category</FormLabel>
                      <Dropdown
                        value={field.value}
                        error={!!fieldState.error}
                        options={FEE_CATEGORY_OPTIONS}
                        onChange={field.onChange}
                      />
                      <FormMessage error={fieldState.error} />
                    </FormItem>
                  )}
                />

                <View className="w-[48%] hidden sm:flex" />

                <FormField
                  control={form.control}
                  name="parent"
                  render={({ field, fieldState }) => (
                    <FormItem fullWidth>
                      <FormLabel required>Parent / Guardian</FormLabel>
                      <Dropdown
                        value={field.value}
                        placeholder="Select Parent / Guardian"
                        error={!!fieldState.error}
                        options={PARENT_OPTIONS}
                        onChange={field.onChange}
                      />
                      <FormMessage error={fieldState.error} />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="admissionType"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel>Admission Type</FormLabel>
                      <Dropdown
                        value={field.value}
                        error={!!fieldState.error}
                        options={ADMISSION_TYPE_OPTIONS}
                        onChange={field.onChange}
                      />
                      <FormMessage error={fieldState.error} />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="status"
                  render={({ field, fieldState }) => (
                    <FormItem>
                      <FormLabel>Status</FormLabel>
                      <Dropdown
                        value={field.value}
                        error={!!fieldState.error}
                        options={STATUS_OPTIONS}
                        onChange={field.onChange}
                      />
                      <FormMessage error={fieldState.error} />
                    </FormItem>
                  )}
                />
              </View>

              <View className="mt-2 mb-10 bg-[#F8FAFC] rounded-2xl p-6 border border-gray-100">
                <View className="flex-row items-center gap-3 mb-2">
                  <BookOpen size={18} color="#0A2540" />
                  <Text className="text-base font-figtree-bold text-primary">
                    Extracurricular Activities
                  </Text>
                </View>
                <Text className="font-figtree text-sm text-[#8A94A6] mb-6">
                  Select any activities for this student. The fee will be added
                  as a line item on their invoice automatically.
                </Text>
                <FormField
                  control={form.control}
                  name="activities"
                  render={({ field }) => (
                    <>
                      {ACTIVITIES.map((activity) => {
                        const isSelected = field.value?.includes(activity.id);
                        return (
                          <Pressable
                            key={activity.id}
                            onPress={() => {
                              if (isSelected) {
                                field.onChange(
                                  field.value?.filter(
                                    (id: string) => id !== activity.id,
                                  ),
                                );
                              } else {
                                field.onChange([
                                  ...(field.value || []),
                                  activity.id,
                                ]);
                              }
                            }}
                            className={cn(
                              "border rounded-xl p-4 flex-row items-center justify-between mb-3 shadow-sm",
                              isSelected
                                ? "border-primary bg-primary/5 shadow-primary/10"
                                : "border-gray-100 bg-white shadow-gray-100/50",
                            )}
                          >
                            <View className="flex-row items-center gap-3 sm:gap-4 flex-1 pr-2">
                              <View
                                className={cn(
                                  "w-10 h-10 rounded-full items-center justify-center shrink-0",
                                  isSelected ? "bg-white" : "bg-[#F2F5F8]",
                                )}
                              >
                                <Text className="text-lg">{activity.icon}</Text>
                              </View>
                              <View className="flex-1">
                                <Text className="font-figtree-semibold text-primary text-sm">
                                  {activity.name}
                                </Text>
                                <Text className="font-figtree text-xs text-[#8A94A6] mt-0.5 leading-4">
                                  {activity.desc}
                                </Text>
                              </View>
                            </View>
                            <Text className="font-figtree-bold text-primary text-sm">
                              {activity.price}
                            </Text>
                          </Pressable>
                        );
                      })}
                    </>
                  )}
                />
              </View>

              <View className="mb-10 bg-[#F8FAFC] rounded-2xl p-6 border border-gray-100">
                <View className="flex-row items-center gap-3 mb-6">
                  <Paperclip size={18} color="#0A2540" />
                  <Text className="text-base font-figtree-bold text-primary">
                    Upload Documents
                  </Text>
                </View>

                <View className="flex-row flex-wrap justify-between gap-y-4">
                  {DOCUMENTS.map((doc) => (
                    <View
                      key={doc.id}
                      className="w-full sm:w-[48%] border border-gray-100 rounded-xl p-4 bg-white shadow-sm shadow-gray-100/50"
                    >
                      <View className="flex-row justify-between items-center mb-4">
                        <Text className="font-figtree-semibold text-primary text-sm">
                          {doc.name}
                        </Text>
                        <Text className="font-figtree text-xs text-[#8A94A6]">
                          No file
                        </Text>
                      </View>
                      <Button
                        variant="secondary"
                        className="w-full h-10 bg-[#F2F5F8] gap-2 border-0"
                      >
                        <Upload size={14} color="#0A2540" />
                        <Text className="font-figtree-semibold text-primary text-xs">
                          Choose
                        </Text>
                      </Button>
                    </View>
                  ))}
                </View>
              </View>

              <View className="h-10" />
            </ScrollView>
          </Form>

          <View className="px-4 sm:px-8 py-4 sm:py-5 border-t border-gray-100 flex-row justify-end gap-3 sm:gap-4 bg-[#F8FAFC]">
            <Button
              variant="secondary"
              onPress={onClose}
              className="px-6 border-0 bg-white shadow-sm shadow-gray-100"
            >
              <Text className="font-figtree-semibold text-primary">Cancel</Text>
            </Button>
            <Button
              className="gap-2 px-8 bg-primary shadow-sm"
              onPress={() => form.handleSubmit(onSubmit)()}
            >
              <Check size={16} color="#FFFFFF" />
              <Text className="font-figtree-semibold text-white">
                Save Student
              </Text>
            </Button>
          </View>
        </View>
      </View>
      <Toaster />
    </Modal>
  );
}
