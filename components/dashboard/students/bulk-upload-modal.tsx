import { Button } from "@/components/ui/button";
import { useAsyncStorage } from "@/hooks/useAsyncStorage";
import {
  addStudentSchema,
  type AddStudentFormValues,
} from "@/lib/form-schemas";
import { cn } from "@/lib/utils";
import { AlertCircle, Check, FileText, Upload, X } from "lucide-react-native";
import Papa from "papaparse";
import React, { useState } from "react";
import {
  Modal,
  Platform,
  Pressable,
  ScrollView,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import Toast from "react-native-toast-message";

export interface BulkUploadModalProps {
  visible: boolean;
  onClose: () => void;
}

interface ParsedRow {
  id: string;
  data: Partial<AddStudentFormValues>;
  isValid: boolean;
  errors: string[];
}

export default function BulkUploadModal({
  visible,
  onClose,
}: BulkUploadModalProps) {
  const [students, setStudents] = useAsyncStorage<any[]>("students", []);
  const [step, setStep] = useState<1 | 2>(1);
  const [parsedRows, setParsedRows] = useState<ParsedRow[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const { width } = useWindowDimensions();
  const isMobile = width < 768;

  const headerMap: Record<string, keyof AddStudentFormValues> = {
    "full name": "fullName",
    name: "fullName",
    "admission number": "admissionNumber",
    "admission no": "admissionNumber",
    "date of birth": "dateOfBirth",
    dob: "dateOfBirth",
    gender: "gender",
    class: "class",
    arm: "arm",
    session: "session",
    "blood group": "bloodGroup",
    house: "house",
    allergies: "allergies",
    "fee category": "feeCategory",
    fees: "feeCategory",
    parent: "parent",
    "parent / guardian": "parent",
    guardian: "parent",
    "admission type": "admissionType",
    status: "status",
  };

  const handlePickFile = () => {
    if (Platform.OS === "web") {
      const input = document.createElement("input");
      input.type = "file";
      input.accept = ".csv";
      input.onchange = (e: any) => {
        const file = e.target.files?.[0];
        if (file) {
          processFile(file);
        }
      };
      input.click();
    } else {
      Toast.show({
        type: "error",
        text1: "Not Supported",
        text2: "Bulk upload is currently supported on web only.",
      });
    }
  };

  const processFile = (file: File) => {
    setIsProcessing(true);
    const reader = new FileReader();
    reader.onload = (event) => {
      const csvText = event.target?.result as string;

      Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          const rows: ParsedRow[] = [];
          const currentAdmissionNumbers = new Set(
            (students || []).map((s) => s.admissionNumber.toLowerCase()),
          );

          results.data.forEach((row: any, index) => {
            const mappedData: Partial<AddStudentFormValues> = {};
            Object.keys(row).forEach((key) => {
              const normalizedKey = key.trim().toLowerCase();
              const mappedKey = headerMap[normalizedKey];
              if (mappedKey && row[key]) {
                mappedData[mappedKey] = row[key].trim();
              }
            });

            const validation = addStudentSchema.safeParse({
              status: "Active",
              activities: [],
              ...mappedData,
            });

            const rowErrors: string[] = [];
            if (!validation.success) {
              validation.error.errors.forEach((err) => {
                rowErrors.push(err.message);
              });
            }

            if (mappedData.admissionNumber) {
              if (
                currentAdmissionNumbers.has(
                  mappedData.admissionNumber.toLowerCase(),
                )
              ) {
                rowErrors.push(
                  `Admission number ${mappedData.admissionNumber} already exists`,
                );
              }

              currentAdmissionNumbers.add(
                mappedData.admissionNumber.toLowerCase(),
              );
            }

            rows.push({
              id: Date.now().toString() + index,
              data: mappedData,
              isValid: rowErrors.length === 0,
              errors: rowErrors,
            });
          });

          setParsedRows(rows);
          setIsProcessing(false);
          setStep(2);
        },
      });
    };
    reader.readAsText(file);
  };

  const handleImport = () => {
    const validRows = parsedRows.filter((row) => row.isValid);
    if (validRows.length === 0) return;

    const newStudents = validRows.map((row) => ({
      ...row.data,
      activities: [],
      status: row.data.status || "Active",
      id: row.id,
    }));

    setStudents([...(students || []), ...newStudents]);

    Toast.show({
      type: "success",
      text1: "Import Successful",
      text2: `${validRows.length} student(s) imported successfully.`,
    });

    handleClose();
  };

  const handleClose = () => {
    setStep(1);
    setParsedRows([]);
    onClose();
  };

  const validCount = parsedRows.filter((r) => r.isValid).length;
  const errorCount = parsedRows.filter((r) => !r.isValid).length;

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View className="flex-1 bg-black/40 justify-center items-center">
        <View
          className="bg-white w-[95%] sm:w-[860px] h-[95%] sm:h-[90%] rounded-2xl overflow-hidden shadow-xl"
          style={Platform.OS === "web" ? { maxHeight: 850 } : {}}
        >
          <View className="px-4 sm:px-8 py-4 sm:py-6 border-b border-gray-100 flex-row items-center justify-between bg-white z-10">
            <Text className="text-xl font-figtree-bold text-primary">
              Bulk Upload Students
            </Text>
            <Pressable
              onPress={handleClose}
              className="p-2 -mr-2 rounded-full hover:bg-gray-100 cursor-pointer"
            >
              <X size={20} color="#8A94A6" />
            </Pressable>
          </View>

          {step === 1 ? (
            <View className="flex-1 items-center justify-center p-4 sm:p-8">
              <View className="w-full max-w-md bg-[#F8FAFC] border-2 border-dashed border-gray-200 rounded-2xl p-6 sm:p-10 items-center justify-center">
                <View className="w-16 h-16 rounded-full bg-primary/5 items-center justify-center mb-6">
                  <FileText size={32} color="#0A2540" />
                </View>
                <Text className="text-lg font-figtree-bold text-primary mb-2 text-center">
                  Upload CSV File
                </Text>
                <Text className="text-sm font-figtree text-[#8A94A6] text-center mb-8">
                  Upload a CSV file containing student records. Ensure the
                  headers include Full Name, Admission Number, Class, etc.
                </Text>
                <Button
                  className="bg-primary px-8"
                  onPress={handlePickFile}
                  disabled={isProcessing}
                >
                  <Text className="font-figtree-semibold text-white">
                    {isProcessing ? "Processing..." : "Select File"}
                  </Text>
                </Button>
                <Pressable className="mt-4" onPress={() => {}}>
                  <Text className="text-sm font-figtree-semibold text-primary underline">
                    Download CSV Template
                  </Text>
                </Pressable>
              </View>
            </View>
          ) : (
            <>
              <View className="px-4 sm:px-8 py-4 bg-[#F8FAFC] border-b border-gray-100 flex-row items-center justify-between">
                <View className="flex-row items-center gap-4 sm:gap-6">
                  <View className="flex-row items-center gap-2">
                    <View className="w-3 h-3 rounded-full bg-[#10B981]" />
                    <Text className="font-figtree-semibold text-[#475569]">
                      {validCount} Valid
                    </Text>
                  </View>
                  <View className="flex-row items-center gap-2">
                    <View className="w-3 h-3 rounded-full bg-[#EF4444]" />
                    <Text className="font-figtree-semibold text-[#475569]">
                      {errorCount} Errors
                    </Text>
                  </View>
                </View>
                <Text className="font-figtree text-[#8A94A6] text-sm">
                  Total Rows: {parsedRows.length}
                </Text>
              </View>

              <ScrollView className="flex-1">
                <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                  <View
                    className={cn(
                      isMobile
                        ? "min-w-[700px] w-full"
                        : "min-w-[1000px] w-full",
                    )}
                  >
                    <View className="flex-row items-center bg-gray-50 border-b border-gray-100 px-4 sm:px-8 py-3">
                      <View className="flex-[1.5]">
                        <Text className="text-xs font-figtree-semibold text-[#475569] uppercase">
                          Name
                        </Text>
                      </View>
                      <View className="flex-1">
                        <Text className="text-xs font-figtree-semibold text-[#475569] uppercase">
                          Adm. No
                        </Text>
                      </View>
                      <View className="flex-1">
                        <Text className="text-xs font-figtree-semibold text-[#475569] uppercase">
                          Class
                        </Text>
                      </View>
                      <View className="flex-[2]">
                        <Text className="text-xs font-figtree-semibold text-[#475569] uppercase">
                          Status / Errors
                        </Text>
                      </View>
                    </View>

                    {parsedRows.map((row) => (
                      <View
                        key={row.id}
                        className={cn(
                          "flex-row items-center px-4 sm:px-8 py-4 bg-white border-b border-gray-50",
                          !row.isValid && "bg-[#FEF2F2]",
                        )}
                      >
                        <View className="flex-[1.5]">
                          <Text
                            className={cn(
                              "font-figtree-semibold text-sm",
                              !row.isValid ? "text-[#991B1B]" : "text-primary",
                            )}
                          >
                            {row.data.fullName || "—"}
                          </Text>
                        </View>
                        <View className="flex-1">
                          <Text
                            className={cn(
                              "font-figtree text-sm",
                              !row.isValid
                                ? "text-[#991B1B]"
                                : "text-[#475569]",
                            )}
                          >
                            {row.data.admissionNumber || "—"}
                          </Text>
                        </View>
                        <View className="flex-1">
                          <Text
                            className={cn(
                              "font-figtree text-sm",
                              !row.isValid
                                ? "text-[#991B1B]"
                                : "text-[#475569]",
                            )}
                          >
                            {row.data.class || "—"}
                          </Text>
                        </View>
                        <View className="flex-[2]">
                          {row.isValid ? (
                            <View className="flex-row items-center gap-2">
                              <Check size={14} color="#10B981" />
                              <Text className="font-figtree text-sm text-[#10B981]">
                                Ready to import
                              </Text>
                            </View>
                          ) : (
                            <View className="flex-row gap-2">
                              <AlertCircle
                                size={14}
                                color="#EF4444"
                                className="mt-0.5"
                              />
                              <View>
                                {row.errors.map((err, i) => (
                                  <Text
                                    key={i}
                                    className="font-figtree text-xs text-[#EF4444] mb-0.5"
                                  >
                                    {err}
                                  </Text>
                                ))}
                              </View>
                            </View>
                          )}
                        </View>
                      </View>
                    ))}
                  </View>
                </ScrollView>
              </ScrollView>

              <View className="px-4 sm:px-8 py-4 sm:py-5 border-t border-gray-100 flex-row justify-end gap-3 sm:gap-4 bg-white">
                <Button
                  variant="secondary"
                  onPress={handleClose}
                  className="px-6 border-0 shadow-sm shadow-gray-100"
                >
                  <Text className="font-figtree-semibold text-primary">
                    Cancel
                  </Text>
                </Button>
                <Button
                  className={cn(
                    "gap-2 px-6 shadow-sm",
                    validCount > 0 ? "bg-primary" : "bg-[#8A94A6]",
                  )}
                  onPress={handleImport}
                  disabled={validCount === 0}
                >
                  <Upload size={16} color="#FFFFFF" />
                  <Text className="font-figtree-semibold text-white">
                    Import {validCount}{" "}
                    {validCount === 1 ? "Student" : "Students"}
                  </Text>
                </Button>
              </View>
            </>
          )}
        </View>
      </View>
    </Modal>
  );
}
