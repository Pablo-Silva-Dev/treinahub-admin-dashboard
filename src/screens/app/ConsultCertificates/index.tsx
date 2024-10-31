import error_warning from "@/assets/error_warning.svg";
import error_warning_dark from "@/assets/error_warning_dark.svg";
import { SelectInput } from "@/components/inputs/SelectInput";
import { Loading } from "@/components/miscellaneous/Loading";
import { ScreenTitleIcon } from "@/components/miscellaneous/ScreenTitleIcon";
import { Subtitle } from "@/components/typography/Subtitle";
import { CertificatesRepository } from "@/repositories/certificatesRepository";
import { ICertificateDTO } from "@/repositories/dtos/CertificateDTO";
import { useLoading } from "@/store/loading";
import { useThemeStore } from "@/store/theme";
import { useQuery } from "@tanstack/react-query";
import { useCallback, useEffect, useMemo, useState } from "react";
import { CertificatesTable } from "./components/CertificatesTable";
import { SeeCertificateModal } from "./components/SeeCertificateModal";

export function ConsultCertificates() {
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedUserId, setSelectedUserId] = useState("");
  const [selectedTrainingId, setSelectedTrainingId] = useState("");
  const [certificates, setCertificates] = useState<ICertificateDTO[]>([]);
  const [selectedCertificate, setSelectedCertificate] =
    useState<ICertificateDTO | null>(null);

  const { isLoading, setIsLoading } = useLoading();
  const { theme } = useThemeStore();

  const handleToggleDetailsModal = () => {
    setIsDetailsModalOpen(!isDetailsModalOpen);
  };

  const certificatesRepository = useMemo(() => {
    return new CertificatesRepository();
  }, []);

  const getCertificates = useCallback(async () => {
    try {
      setIsLoading(true);
      const certificates = await (
        await certificatesRepository.listCertificates()
      ).filter((c) => c.training !== null);
      setCertificates(certificates);
      return certificates;
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  }, [certificatesRepository, setIsLoading]);

  useEffect(() => {
    getCertificates();
  }, [getCertificates]);

  const getCertificateDetails = useCallback(
    async (certificateId: string) => {
      try {
        const certificate =
          await certificatesRepository.getCertificateById(certificateId);
        setSelectedCertificate(certificate);
      } catch (error) {
        console.log(error);
      }
    },
    [certificatesRepository]
  );

  const getCertificatesByUser = useCallback(
    async (userId: string) => {
      try {
        const certificates = await (
          await certificatesRepository.listCertificatesByUser(userId)
        ).filter((c) => c.training !== null);
        setCertificates(certificates);
      } catch (error) {
        console.log(error);
      }
    },
    [certificatesRepository]
  );

  useEffect(() => {
    getCertificatesByUser(selectedUserId);
  }, [getCertificatesByUser, selectedUserId]);

  const getCertificatesByTraining = useCallback(
    async (trainingId: string) => {
      try {
        const certificates = (
          await certificatesRepository.listCertificatesByTraining(trainingId)
        ).filter((c) => c.training !== null);
        setCertificates(certificates);
      } catch (error) {
        console.log(error);
      }
    },
    [certificatesRepository]
  );

  useEffect(() => {
    getCertificatesByTraining(selectedTrainingId);
  }, [getCertificatesByTraining, selectedTrainingId]);

  const uniqueUsersInputOptions = new Set();
  const selectUsersInputOptions = certificates
    .map((certificate) => {
      if (certificate.user) {
        return {
          value: certificate.user.id,
          label: certificate.user.name,
        };
      }
    })
    .filter((option) =>
      option && uniqueUsersInputOptions.has(option?.value)
        ? false
        : uniqueUsersInputOptions.add(option!.value)
    )
    .concat([{ label: "Todos os usuários", value: "" }]);

  const uniqueTrainingsInputOptions = new Set();
  const selectTrainingsInputOptions = certificates
    .map((certificate) => {
      if (certificate && certificate.training) {
        return {
          value: certificate.training.id,
          label: certificate.training.name,
        };
      }
    })
    .filter((option) =>
      option && uniqueTrainingsInputOptions.has(option?.value)
        ? false
        : uniqueTrainingsInputOptions.add(option!.value)
    )
    .concat([{ label: "Todos os treinamentos", value: "" }]);

  const resetCertificates = useCallback(async () => {
    try {
      const certificates = await getCertificates();
      return certificates;
    } catch (error) {
      console.log(error);
    }
  }, [getCertificates]);

  useEffect(() => {
    if (selectedUserId === "" || selectedTrainingId === "") {
      resetCertificates();
    }
  }, [resetCertificates, selectedTrainingId, selectedUserId]);

  const handleDownloadCertificate = async (certificateId: string) => {
    try {
      const certificate =
        await certificatesRepository.getCertificateById(certificateId);
      if (certificate && certificate.url) {
        window.location.href = certificate.url;
      }
    } catch (error) {
      console.error("Failed to fetch certificate details for download:", error);
    }
  };

  const { isLoading: loading, error } = useQuery({
    queryKey: ["certificates"],
    queryFn: getCertificates,
  });

  return (
    <main className="flex flex-1 flex-col w-[85%] md:w-[90%] lg:w-[95%] mt-2 ml-[40px] mx-auto lg:pl-8 bg-gray-100 dark:bg-slate-800">
      <div className="flex flex-col  w-full mx-auto xl:pr-8">
        <div className="mb-2 flex flex-row w-[full] justify-between items-center">
          <div className="mr-3">
            <ScreenTitleIcon screenTitle="Certificados" iconName="star" />
            <Subtitle
              content="Consulte certificados emitidos."
              className="mt-4 mb-6 text-gray-800 dark:text-gray-50 text-sm md:text-[15px]"
            />
          </div>
        </div>
        {isLoading || loading ? (
          <Loading />
        ) : error ? (
          <div className="w-full mt-[10vh] flex flex-col items-center justify-center">
            <img
              src={theme === "light" ? error_warning : error_warning_dark}
              alt="page_not_found"
              width={200}
              height={120}
            />
          </div>
        ) : (
          <>
            {certificates.length > 0 ? (
              <div className="w-full flex flex-col">
                <div className="flex flex-col lg:flex-row items-center w-full">
                  <div className="w-full flex flex-row lg:mr-4 mb-4">
                    <SelectInput
                      options={selectUsersInputOptions}
                      label="Filtrar por usuário"
                      containerClassName="w-full"
                      placeholder="Selecione um usuario"
                      onSelectOption={(val) =>
                        setSelectedUserId(val.value.toString())
                      }
                    />
                  </div>
                  <div className="flex w-full flex-row mb-4">
                    <SelectInput
                      options={selectTrainingsInputOptions}
                      label="Filtrar por treinamento"
                      containerClassName="w-full"
                      placeholder="Selecione um usuario"
                      onSelectOption={(val) =>
                        setSelectedTrainingId(val.value.toString())
                      }
                    />
                  </div>
                </div>
                <div className="w-full flex-col flex items-center">
                  <CertificatesTable
                    certificates={certificates}
                    onDownloadCertificate={handleDownloadCertificate}
                    onSeeCertificate={handleToggleDetailsModal}
                    onSelectCertificate={getCertificateDetails}
                  />
                </div>
              </div>
            ) : (
              <span className="text-[12px] md:text-[14px] text-gray-800 dark:text-gray-200">
                Até o momento nenhum certificado foi emitido.
              </span>
            )}
          </>
        )}
      </div>
      {selectedCertificate && (
        <SeeCertificateModal
          isOpen={isDetailsModalOpen}
          onRequestClose={handleToggleDetailsModal}
          onClose={handleToggleDetailsModal}
          onConfirmAction={handleDownloadCertificate}
          certificate={selectedCertificate}
        />
      )}
    </main>
  );
}
