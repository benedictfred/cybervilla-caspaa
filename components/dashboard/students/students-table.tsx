import { Badge } from "@/components/ui/badge";
import { Dropdown } from "@/components/ui/dropdown";
import { Input } from "@/components/ui/input";
import { useAsyncStorage } from "@/hooks/useAsyncStorage";
import { CLASS_OPTIONS, STATUS_OPTIONS } from "@/lib/constants";
import { cn, getAge, getInitials } from "@/lib/utils";
import { SquarePen, Trash2, Users } from "lucide-react-native";
import { useEffect, useState } from "react";
import {
  Alert,
  Platform,
  Pressable,
  ScrollView,
  Text,
  View,
  useWindowDimensions,
} from "react-native";

export interface StudentsTableProps {
  onEdit?: (student: any) => void;
}

export default function StudentsTable({ onEdit }: StudentsTableProps) {
  const [students, setStudents, isReady] = useAsyncStorage<any[]>(
    "students",
    [],
  );
  const { width } = useWindowDimensions();
  const isMobile = width < 1024;

  const [searchQuery, setSearchQuery] = useState("");
  const [classFilter, setClassFilter] = useState("All Classes");
  const [statusFilter, setStatusFilter] = useState("All Statuses");
  const [currentPage, setCurrentPage] = useState(1);
  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, classFilter, statusFilter]);

  const filteredStudents = (students || []).filter((student) => {
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      const matchName = student.fullName?.toLowerCase().includes(q);
      const matchAdm = student.admissionNumber?.toLowerCase().includes(q);
      if (!matchName && !matchAdm) return false;
    }

    if (classFilter !== "All Classes" && student.class !== classFilter) {
      return false;
    }

    const sStatus = student.status || "Active";
    if (statusFilter !== "All Statuses" && sStatus !== statusFilter) {
      return false;
    }

    return true;
  });

  const totalPages = Math.ceil(filteredStudents.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedStudents = filteredStudents.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );

  const handleDelete = (id: string, name: string) => {
    const confirmDelete = () => {
      setStudents((prev: any[]) => prev.filter((s) => s.id !== id));
    };

    if (Platform.OS === "web") {
      if (window.confirm(`Are you sure you want to delete ${name}?`)) {
        confirmDelete();
      }
    } else {
      Alert.alert(
        "Delete Student",
        `Are you sure you want to delete ${name}?`,
        [
          { text: "Cancel", style: "cancel" },
          { text: "Delete", style: "destructive", onPress: confirmDelete },
        ],
      );
    }
  };

  const FilterDropdowns = (
    <>
      <View className="w-32 sm:w-40 h-11">
        <Dropdown
          value={classFilter === "All Classes" ? "" : classFilter}
          placeholder="All Classes"
          options={["All Classes", ...CLASS_OPTIONS]}
          onChange={(val) => setClassFilter(val)}
        />
      </View>
      <View className="w-32 sm:w-40 h-11">
        <Dropdown
          value={statusFilter === "All Statuses" ? "" : statusFilter}
          placeholder="All Statuses"
          options={["All Statuses", ...STATUS_OPTIONS]}
          onChange={(val) => setStatusFilter(val)}
        />
      </View>
    </>
  );

  const TableContent = (
    <View
      role="table"
      className={cn(
        "border border-gray-100 rounded-md overflow-hidden bg-white",
        isMobile ? "min-w-[900px] w-full" : "w-full",
      )}
    >
      <View className="flex-row items-center bg-[#F8FAFC] border-b border-gray-100 px-6 py-4">
        <View className="flex-[2]">
          <Text className="text-xs font-figtree-semibold text-[#475569] uppercase tracking-widest">
            Student
          </Text>
        </View>
        <View className="flex-1">
          <Text className="text-xs font-figtree-semibold text-[#475569] uppercase tracking-widest">
            Admission No.
          </Text>
        </View>
        <View className="flex-1">
          <Text className="text-xs font-figtree-semibold text-[#475569] uppercase tracking-widest">
            Class
          </Text>
        </View>
        <View className="flex-[1.5]">
          <Text className="text-xs font-figtree-semibold text-[#475569] uppercase tracking-widest">
            Parent
          </Text>
        </View>
        <View className="flex-[1.5]">
          <Text className="text-xs font-figtree-semibold text-[#475569] uppercase tracking-widest">
            Fees
          </Text>
        </View>
        <View className="w-16" />
      </View>

      {!isReady ? (
        <View className="py-20 items-center justify-center bg-white">
          <Text className="font-figtree text-[#8A94A6]">Loading...</Text>
        </View>
      ) : paginatedStudents.length > 0 ? (
        paginatedStudents.map((student, index) => (
          <View
            key={student.id || index}
            className={cn(
              "flex-row items-center px-6 py-4 bg-white",
              index !== paginatedStudents.length - 1 &&
                "border-b border-gray-50",
            )}
          >
            <View className="flex-[2] flex-row items-center gap-3">
              <View className="w-10 h-10 rounded-full bg-primary items-center justify-center">
                <Text className="text-white font-figtree-bold text-sm">
                  {getInitials(student.fullName)}
                </Text>
              </View>
              <View>
                <Text className="font-figtree-bold text-primary text-sm mb-0.5">
                  {student.fullName}
                </Text>
                <Text className="font-figtree text-xs text-[#64748B]">
                  {student.gender} &bull; {getAge(student.dateOfBirth)} &bull;{" "}
                  {(student.status || "Active").toLowerCase()}
                </Text>
              </View>
            </View>

            <View className="flex-1">
              <View className="bg-[#F1F5F9] rounded-full px-3 py-1.5 self-start">
                <Text className="font-figtree text-sm text-[#1E293B]">
                  {student.admissionNumber}
                </Text>
              </View>
            </View>

            <View className="flex-1">
              <Text className="font-figtree text-sm text-[#1E293B]">
                {student.class} {student.arm || ""}
              </Text>
            </View>

            <View className="flex-[1.5]">
              <Text className="font-figtree text-sm text-[#1E293B]">
                {student.parent}
              </Text>
            </View>

            <View className="flex-[1.5] md:flex-row items-center gap-2">
              <Badge
                variant={
                  student.feeCategory === "Paid"
                    ? "success"
                    : student.feeCategory === "Partial"
                      ? "warning"
                      : "destructive"
                }
                className="py-1.5 px-3"
              >
                {student.feeCategory || "Outstanding"}
              </Badge>
              {student.activities && student.activities.length > 0 && (
                <Badge variant="secondary" className="py-1.5 px-3">
                  {student.activities.length}{" "}
                  {student.activities.length === 1 ? "activity" : "activities"}
                </Badge>
              )}
            </View>

            <View className="w-16 flex-row items-center justify-end gap-3">
              <Pressable onPress={() => onEdit?.(student)}>
                <SquarePen size={16} color="#8A94A6" />
              </Pressable>
              <Pressable
                onPress={() => handleDelete(student.id, student.fullName)}
              >
                <Trash2 size={16} color="#ef4444" />
              </Pressable>
            </View>
          </View>
        ))
      ) : (
        <View className="py-24 items-center justify-center bg-white">
          <View className="w-16 h-16 rounded-full bg-[#F8FAFC] items-center justify-center mb-4">
            <Users size={24} color="#8A94A6" />
          </View>
          <Text className="font-figtree-bold text-lg text-primary mb-2">
            No students found
          </Text>
          <Text className="font-figtree text-sm text-[#8A94A6] text-center max-w-xs">
            You haven't added any students yet. Add a student to see them appear
            in this table.
          </Text>
        </View>
      )}

      {filteredStudents.length > 0 && (
        <View className="flex-row items-center justify-between px-6 py-4 bg-[#F8FAFC] border-t border-gray-100">
          <Text className="text-sm font-figtree text-[#8A94A6]">
            Showing {startIndex + 1} to{" "}
            {Math.min(startIndex + ITEMS_PER_PAGE, filteredStudents.length)} of{" "}
            {filteredStudents.length} entries
          </Text>
          <View className="flex-row items-center gap-4">
            <Pressable
              disabled={currentPage === 1}
              onPress={() => setCurrentPage((p) => Math.max(1, p - 1))}
              className={cn(
                "px-3 py-1.5 rounded-md border",
                currentPage === 1
                  ? "border-transparent opacity-50"
                  : "border-gray-200 bg-white",
              )}
            >
              <Text className="text-sm font-figtree-medium text-[#475569]">
                Previous
              </Text>
            </Pressable>
            <Text className="text-sm font-figtree-medium text-[#475569]">
              Page {currentPage} of {Math.max(1, totalPages)}
            </Text>
            <Pressable
              disabled={currentPage === totalPages || totalPages === 0}
              onPress={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              className={cn(
                "px-3 py-1.5 rounded-md border",
                currentPage === totalPages || totalPages === 0
                  ? "border-transparent opacity-50"
                  : "border-gray-200 bg-white",
              )}
            >
              <Text className="text-sm font-figtree-medium text-[#475569]">
                Next
              </Text>
            </Pressable>
          </View>
        </View>
      )}
    </View>
  );

  return (
    <View className="px-4 sm:px-8 pb-12 mt-8">
      <View
        className={cn(
          "mb-6",
          isMobile ? "flex-col gap-4" : "flex-row items-center gap-4",
        )}
      >
        <Input
          placeholder="Search by name or admission no..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          wrapperClassName={isMobile ? "w-full" : "flex-1"}
        />
        {isMobile ? (
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="flex-row items-center gap-3 pr-4">
              {FilterDropdowns}
            </View>
          </ScrollView>
        ) : (
          FilterDropdowns
        )}
      </View>

      {isMobile ? (
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          className="w-full"
        >
          {TableContent}
        </ScrollView>
      ) : (
        TableContent
      )}
    </View>
  );
}
