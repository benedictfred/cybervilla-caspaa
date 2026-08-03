import AddStudentModal from "@/components/dashboard/students/add-student-modal";
import BulkUploadModal from "@/components/dashboard/students/bulk-upload-modal";
import StudentsHeader from "@/components/dashboard/students/students-header";
import StudentsTable from "@/components/dashboard/students/students-table";
import { useState } from "react";
import { ScrollView, View } from "react-native";

export default function Index() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isBulkUploadOpen, setIsBulkUploadOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState<any>(null);

  const handleAddStudent = () => {
    setSelectedStudent(null);
    setIsModalOpen(true);
  };

  const handleEditStudent = (student: any) => {
    setSelectedStudent(student);
    setIsModalOpen(true);
  };

  return (
    <View className="flex-1">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <StudentsHeader 
          onAddStudent={handleAddStudent} 
          onBulkUpload={() => setIsBulkUploadOpen(true)}
        />
        <StudentsTable onEdit={handleEditStudent} />
      </ScrollView>
      <AddStudentModal
        visible={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        initialData={selectedStudent}
      />
      <BulkUploadModal
        visible={isBulkUploadOpen}
        onClose={() => setIsBulkUploadOpen(false)}
      />
    </View>
  );
}
